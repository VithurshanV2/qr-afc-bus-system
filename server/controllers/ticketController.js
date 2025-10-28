import {
  createTicketAtBoarding,
  getNearestBoardingHalt,
  getTicketById,
  getUpcomingDestinationHalts,
  setDestinationHalt,
} from '../models/ticketModel.js';
import { getActiveTripByBusQrCode } from '../models/tripModel.js';

// Commuter scans QR, determine the boarding halt
export const scanQrBoarding = async (req, res) => {
  try {
    const userId = req.userId;
    const { busId, latitude, longitude } = req.body;

    if (!busId || !latitude || !longitude) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required data' });
    }

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

    if (!ticketId) {
      return res
        .status(400)
        .json({ success: false, message: 'Ticket ID is required' });
    }

    const ticket = await getTicketById(Number(ticketId));

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: 'Ticket not found' });
    }

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
export const selectDestinationHalt = async (res, req) => {
  try {
    const { ticketId } = req.params;
    const { destinationHalt } = req.body;

    if (!ticketId || !destinationHalt || !destinationHalt.id) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required data' });
    }

    const ticket = await getTicketById(ticketId);

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: 'Ticket not found' });
    }

    const upcomingHalts = getUpcomingDestinationHalts(
      ticket.trip,
      ticket.boardingHalt,
    );

    const isValidDestination = upcomingHalts.some(
      (halt) => halt.id === destinationHalt,
    );

    if (!isValidDestination) {
      return res
        .status(404)
        .json({ success: false, message: 'Invalid destination halt' });
    }

    const updateTicket = setDestinationHalt(ticket.id, destinationHalt);

    return res.status(200).json({
      success: true,
      message: 'Destination halt is selected successfully',
      ticket: updateTicket,
    });
  } catch (error) {
    console.error(error);
    return req
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
