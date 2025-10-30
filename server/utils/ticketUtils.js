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
