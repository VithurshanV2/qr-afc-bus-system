import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

// Fetch active trip by bus QR code
export const getActiveTripByBusQrCode = async (qrCode) => {
  return await prisma.trip.findFirst({
    where: {
      bus: { qrCode },
      isActive: true,
    },
    include: {
      route: true,
      bus: true,
    },
  });
};

// Fetch trip by ID
export const getTripById = async (tripId) => {
  return await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      route: true,
      bus: true,
    },
  });
};

// Fetch trip logs for transport authority
export const getTripLogs = async ({
  from,
  to,
  name = '',
  email = '',
  number = '',
  busRegistration = '',
  skip = 0,
  take = 50,
}) => {
  return await prisma.ticket.findMany({
    where: {
      status: 'CONFIRMED',
      issuedAt: {
        gte: new Date(from),
        lte: new Date(to),
      },
      commuter: {
        OR: [
          { name: { contains: name || '', mode: 'insensitive' } },
          { email: { contains: email || '', mode: 'insensitive' } },
          { number: { contains: number || '', mode: 'insensitive' } },
        ],
      },

      trip: {
        bus: {
          registrationNumber: busRegistration
            ? { contains: busRegistration, mode: 'insensitive' }
            : undefined,
        },
      },
    },
    select: {
      id: true,
      issuedAt: true,
      status: true,

      commuter: {
        select: { name: true, email: true, number: true },
      },

      boardingHalt: true,
      destinationHalt: true,
      adultCount: true,
      childCount: true,
      totalFare: true,

      trip: {
        select: {
          route: { select: { name: true, number: true, busType: true } },
          bus: { select: { registrationNumber: true, requestedBusType: true } },
        },
      },
    },

    orderBy: { issuedAt: 'desc' },
    skip,
    take,
  });
};

export const countTripLogs = async ({
  from,
  to,
  name = '',
  email = '',
  number = '',
  busRegistration = '',
}) => {
  return await prisma.ticket.count({
    where: {
      status: 'CONFIRMED',
      issuedAt: {
        gte: new Date(from),
        lte: new Date(to),
      },
      commuter: {
        OR: [
          { name: { contains: name || '', mode: 'insensitive' } },
          { email: { contains: email || '', mode: 'insensitive' } },
          { number: { contains: number || '', mode: 'insensitive' } },
        ],
      },

      trip: {
        bus: {
          registrationNumber: busRegistration
            ? { contains: busRegistration, mode: 'insensitive' }
            : undefined,
        },
      },
    },
  });
};
