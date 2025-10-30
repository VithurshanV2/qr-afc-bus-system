import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

// Create ticket at boarding
export const createTicketAtBoarding = async ({
  userId,
  tripId,
  boardingHalt,
}) => {
  return await prisma.ticket.create({
    data: {
      commuterId: userId,
      tripId,
      boardingHalt,
      status: 'PENDING',
    },
  });
};

// Fetch ticket by ID
export const getTicketById = async (id) => {
  return await prisma.ticket.findUnique({
    where: { id },
    include: {
      commuter: true,
      trip: {
        include: { route: true, bus: true },
      },
    },
  });
};

// Update ticket with destination halt
export const setDestinationHalt = async (ticketId, destinationHalt) => {
  return await prisma.ticket.update({
    where: { id: ticketId },
    data: { destinationHalt, status: 'PENDING' },
  });
};

// Update passenger count
export const setPassengerCount = async (ticketId, adultCount, childCount) => {
  return await prisma.ticket.update({
    where: { id: ticketId },
    data: { adultCount, childCount, status: 'PENDING' },
  });
};
