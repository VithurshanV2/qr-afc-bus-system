import {
  createTicketAtBoarding,
  getActiveTicket,
  getLatestTicket,
  getPastTickets,
  getTicketById,
  getTicketByQrCode,
  setCancelTicket,
  setDestinationHalt,
  setPassengerCount,
} from '../models/ticketModel.js';
import {
  countTripLogs,
  getActiveTripByBusQrCode,
  getTripLogs,
} from '../models/tripModel.js';
import {
  calculateFare,
  getNearestBoardingHalt,
  getUpcomingDestinationHalts,
} from '../services/ticketService.js';
import {
  ensurePendingTicket,
  getAuthorizedTicket,
} from '../utils/ticketUtils.js';
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

    const activeTicket = await getActiveTicket(userId);

    if (activeTicket) {
      return res.status(400).json({
        success: false,
        message:
          'An active ticket exists. Please either cancel or complete it to proceed',
      });
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

    const ticket = await ensurePendingTicket(ticketId, userId, res);
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

    const ticket = await ensurePendingTicket(ticketId, userId, res);
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

    const ticket = await ensurePendingTicket(ticketId, userId, res);
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

    const updatedTicket = {
      ...ticket,
      baseFare: fares.baseFare,
      totalFare: fares.totalFare,
    };

    return res.status(200).json({ success: true, ticket: updatedTicket });
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

    const PROGRESS = {
      SCAN: 1,
      DESTINATION: 2,
      PASSENGERS: 3,
      PAYMENT: 4,
    };

    let progressStep = PROGRESS.SCAN;

    if (ticket.boardingHalt && !ticket.destinationHalt) {
      progressStep = PROGRESS.DESTINATION;
    } else if (
      ticket.destinationHalt &&
      ticket.adultCount === 1 &&
      ticket.childCount === 0
    ) {
      progressStep = PROGRESS.PASSENGERS;
    } else if (
      ticket.destinationHalt &&
      (ticket.adultCount > 1 || ticket.childCount > 0)
    ) {
      progressStep = PROGRESS.PAYMENT;
    }

    return res.status(200).json({ success: true, ticket, progressStep });
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

// Fetch latest ticket
export const fetchLatestTicket = async (req, res) => {
  try {
    const userId = req.userId;

    const ticket = await getLatestTicket(userId);

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: 'Ticket not found' });
    }

    if (ticket.commuterId !== userId) {
      return res
        .status(403)
        .json({ success: false, message: 'Unauthorized ticket' });
    }

    return res.status(200).json({ success: true, ticket });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Fetch past tickets
export const fetchPastTickets = async (req, res) => {
  try {
    const userId = req.userId;
    const { cursor, limit } = req.query;

    // Validate limit
    let parsedLimit = parseInt(limit, 10);

    if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
      parsedLimit = 5;
    }

    if (parsedLimit > 50) {
      parsedLimit = 50;
    }

    // Validate cursor
    let parsedCursor = cursor ? parseInt(cursor, 10) : undefined;

    if (cursor && !Number.isFinite(parsedCursor)) {
      parsedCursor = undefined;
    }

    const latestTicketId = await getLatestTicket(userId)?.id;

    const tickets = await getPastTickets(
      userId,
      parsedLimit,
      parsedCursor,
      latestTicketId,
    );

    return res.status(200).json({
      success: true,
      tickets,
      nextCursor: tickets.length > 0 ? tickets[tickets.length - 1].id : null,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Verify ticket by QR Code
export const verifyTicket = async (req, res) => {
  try {
    const { qrCode } = req.body;

    if (!requireFields(res, { qrCode }, ['qrCode'])) return;

    const ticket = await getTicketByQrCode(qrCode);

    if (!ticket) {
      return res
        .status(400)
        .json({ success: false, message: 'Ticket not found' });
    }

    return res
      .status(200)
      .json({ success: true, message: 'Ticket found', ticket });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Fetch trip logs for transport authority
export const searchTickets = async (req, res) => {
  try {
    let { from, to, search, page = 1, limit = 50 } = req.query;

    search = search?.trim();

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const tripLogs = await getTripLogs({
      from,
      to,
      search,
      skip,
      take,
    });

    const total = await countTripLogs({
      from,
      to,
      search,
    });

    return res
      .status(200)
      .json({ success: true, total, page, limit, tripLogs });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Fetch ticket for viewing by transport authority
export const viewTicket = async (req, res) => {
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

    return res.status(200).json({ success: true, ticket });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
