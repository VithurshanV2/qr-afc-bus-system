import { getTicketById } from '../models/ticketModel.js';

export const getAuthorizedTicket = async (ticketId, userId, res) => {
  const ticket = await getTicketById(Number(ticketId));

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

  return ticket;
};

export const validateHaltSelection = (ticket) => {
  if (!ticket.boardingHalt || !ticket.destinationHalt) {
    return {
      success: false,
      message: 'Boarding and destination halts must be selected first',
    };
  }
  return null;
};

export const validatePassengerCount = (ticket) => {
  if (ticket.adultCount + ticket.childCount < 1) {
    return {
      success: false,
      message: 'At least one passenger must be selected',
    };
  }
  return null;
};
