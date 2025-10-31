import {
  createTicketAtBoarding,
  getActiveTicket,
  setCancelTicket,
  setDestinationHalt,
  setPassengerCount,
} from '../models/ticketModel.js';
import { getActiveTripByBusQrCode } from '../models/tripModel.js';
import {
  calculateFare,
  getNearestBoardingHalt,
  getUpcomingDestinationHalts,
} from '../services/ticketService.js';
import { getAuthorizedTicket } from '../utils/ticketUtils.js';
import { requireFields } from '../utils/validateRequest.js';

// Commuter scans QR, determine the boarding halt
export const scanQrBoarding = async (req, res) => {
  try {
    const userId = req.userId;
    const { busId, latitude, longitude } = req.body;

    if (
      !requireFields(res, { busId, latitude, longitude }, [
        'busId',
        'latitude',
        'longitude',
      ])
    )
      return;

    const trip = await getActiveTripByBusQrCode(busId);

    if (!trip) {
      return res
        .status(404)
        .json({ success: false, message: 'No active trip found for this bus' });
    }

    const boardingHalt = getNearestBoardingHalt(trip, latitude, longitude);

    const ticket = await createTicketAtBoarding({
      userId,
      tripId: trip.id,
      boardingHalt,
    });

    return res.status(200).json({
      success: true,
      message: 'Boarding halt identified',
      ticket,
      tripInfo: {
        id: trip.id,
        bus: trip.bus,
        route: trip.route,
        direction: trip.direction,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Fetch upcoming destination halts after boarding halt
export const getUpcomingHalts = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.userId;

    if (!requireFields(res, { ticketId }, ['ticketId'])) return;

    const ticket = await getAuthorizedTicket(ticketId, userId, res);
    if (!ticket) return;

    const upcomingHalts = getUpcomingDestinationHalts(
      ticket.trip,
      ticket.boardingHalt,
    );

    return res.status(200).json({ success: true, upcomingHalts });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Select a destination halt and update ticket
export const selectDestinationHalt = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { destinationHalt } = req.body;
    const userId = req.userId;

    if (
      !requireFields(res, { ticketId, destinationHalt }, [
        'ticketId',
        'destinationHalt',
      ])
    )
      return;

    if (!destinationHalt.id) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required data' });
    }

    const ticket = await getAuthorizedTicket(ticketId, userId, res);
    if (!ticket) return;

    const upcomingHalts = getUpcomingDestinationHalts(
      ticket.trip,
      ticket.boardingHalt,
    );

    const isValidDestination = upcomingHalts.some(
      (halt) => halt.id === destinationHalt.id,
    );

    if (!isValidDestination) {
      return res
        .status(404)
        .json({ success: false, message: 'Invalid destination halt' });
    }

    const updateTicket = await setDestinationHalt(ticket.id, destinationHalt);

    return res.status(200).json({
      success: true,
      message: 'Destination halt is selected successfully',
      ticket: updateTicket,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Add accompanying passengers to the ticket
export const setAccompanyingPassengers = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { adultCount, childCount } = req.body;
    const userId = req.userId;

    if (
      !requireFields(res, { ticketId, adultCount, childCount }, [
        'ticketId',
        'adultCount',
        'childCount',
      ])
    )
      return;

    if (adultCount + childCount < 1) {
      return res.status(400).json({
        success: false,
        message: 'At least one passenger must be selected',
      });
    }

    const ticket = await getAuthorizedTicket(ticketId, userId, res);
    if (!ticket) return;

    const updateTicket = await setPassengerCount(
      Number(ticketId),
      adultCount,
      childCount,
    );

    return res.status(200).json({
      success: true,
      message: 'Accompanying passengers added successfully',
      ticket: updateTicket,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Get base fare and total fare
export const getFares = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.userId;

    if (!requireFields(res, { ticketId }, ['ticketId'])) return;

    const ticket = await getAuthorizedTicket(ticketId, userId, res);
    if (!ticket) return;

    if (!ticket.boardingHalt || !ticket.destinationHalt) {
      return res.status(400).json({
        success: false,
        message: 'Boarding and destination halts must be selected first',
      });
    }

    if (ticket.adultCount + ticket.childCount < 1) {
      return res.status(400).json({
        success: false,
        message: 'At least one passenger must be selected',
      });
    }

    const fares = calculateFare(ticket.trip, ticket);

    const ticketSummary = {
      boardingHalt: ticket.boardingHalt.englishName,
      destinationHalt: ticket.destinationHalt.englishName,
      adultCount: ticket.adultCount,
      childCount: ticket.childCount,
      baseFare: fares.baseFare,
      totalFare: fares.totalFare,
      routeNumber: ticket.trip.route.number,
      routeName: ticket.trip.route.name,
    };

    return res.status(200).json({ success: true, ticketSummary });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// fetch active ticket
export const fetchActiveTicket = async (req, res) => {
  try {
    const userId = req.userId;

    const ticket = await getActiveTicket(userId);

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: 'No active ticket' });
    }

    return res.status(200).json({ success: true, ticket });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Cancel active ticket
export const cancelTicket = async (req, res) => {
  try {
    const userId = req.userId;

    const activeTicket = await getActiveTicket(userId);

    if (!activeTicket) {
      return res
        .status(404)
        .json({ success: false, message: 'No active ticket found' });
    }

    const cancelTicket = await setCancelTicket(activeTicket);

    return res.status(200).json({
      success: true,
      message: 'Ticket cancelled successfully',
      cancelTicket,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
