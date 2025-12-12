import { PrismaClient } from '../generated/prisma/index.js';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Create ticket at boarding only if no active ticket
export const createTicketAtBoarding = async ({
  userId,
  tripId,
  boardingHalt,
}) => {
  await expireOldTickets(userId);

  const active = await getActiveTicket(userId);

  if (active) {
    throw new Error(
      'An active ticket exists. Please either cancel or complete it to proceed',
    );
  }

  const expiry = 15 * 60 * 1000; // 15 minutes
  const expiresAt = new Date(Date.now() + expiry);

  const barcode = uuidv4();

  return await prisma.ticket.create({
    data: {
      commuterId: userId,
      tripId,
      boardingHalt,
      expiresAt,
      status: 'PENDING',
      barcode,
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
    include: {
      trip: { include: { bus: true, route: true } },
    },
  });
};

// Update passenger count
export const setPassengerCount = async (ticketId, adultCount, childCount) => {
  return await prisma.ticket.update({
    where: { id: ticketId },
    data: { adultCount, childCount, status: 'PENDING' },
    include: {
      trip: { include: { bus: true, route: true } },
    },
  });
};

// set ticket status to EXPIRED
export const expireOldTickets = async (userId) => {
  return await prisma.ticket.updateMany({
    where: {
      commuterId: userId,
      status: 'PENDING',
      expiresAt: { lt: new Date() },
    },
    data: { status: 'EXPIRED' },
  });
};

// Get active tickets
export const getActiveTicket = async (userId) => {
  await expireOldTickets(userId);

  return await prisma.ticket.findFirst({
    where: {
      commuterId: userId,
      status: 'PENDING',
      expiresAt: { gt: new Date() },
    },
    orderBy: { id: 'desc' },
    include: {
      trip: { include: { bus: true, route: true } },
      commuter: true,
    },
  });
};

// Cancel active ticket
export const setCancelTicket = async (activeTicket) => {
  return await prisma.ticket.update({
    where: { id: activeTicket.id },
    data: { status: 'CANCELLED', cancelledAt: new Date() },
  });
};

// Get latest ticket
export const getLatestTicket = async (userId) => {
  return await prisma.ticket.findFirst({
    where: { commuterId: userId, status: 'CONFIRMED' },
    include: {
      trip: { include: { bus: true, route: true } },
      commuter: true,
    },
    orderBy: { issuedAt: 'desc' },
  });
};

// Get past tickets excluding the latest ticket
export const getPastTickets = async (
  userId,
  limit = 5,
  cursor,
  latestTicketId,
) => {
  const query = {
    where: { commuterId: userId, status: 'CONFIRMED' },
    orderBy: { issuedAt: 'desc' },
    take: limit,
    include: {
      commuter: true,
      trip: {
        include: { route: true, bus: true },
      },
    },
  };

  if (latestTicketId) {
    query.where.id = { not: latestTicketId };
  }

  if (cursor) {
    query.cursor = { id: cursor };
    query.skip = 1;
  }

  return await prisma.ticket.findMany(query);
};
