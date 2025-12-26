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
  search = '',
  skip = 0,
  take = 50,
}) => {
  return await prisma.ticket.findMany({
    where: {
      status: 'CONFIRMED',

      ...(from &&
        to && {
          issuedAt: {
            gte: new Date(from),
            lte: new Date(to),
          },
        }),

      ...(search && {
        OR: [
          {
            commuter: { name: { contains: search, mode: 'insensitive' } },
          },
          {
            commuter: {
              email: { contains: search, mode: 'insensitive' },
            },
          },
          {
            commuter: {
              number: { contains: search, mode: 'insensitive' },
            },
          },
          {
            trip: {
              bus: {
                registrationNumber: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          },
        ],
      }),
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

export const countTripLogs = async ({ from, to, search = '' }) => {
  return await prisma.ticket.count({
    where: {
      status: 'CONFIRMED',

      ...(from &&
        to && {
          issuedAt: {
            gte: new Date(from),
            lte: new Date(to),
          },
        }),
      ...(search && {
        OR: [
          {
            commuter: { name: { contains: search, mode: 'insensitive' } },
          },
          {
            commuter: {
              email: { contains: search, mode: 'insensitive' },
            },
          },
          {
            commuter: {
              number: { contains: search, mode: 'insensitive' },
            },
          },
          {
            trip: {
              bus: {
                registrationNumber: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          },
        ],
      }),
    },
  });
};

// Fetch active trip by bus ID
export const getActiveTripByBusId = async ({ busId }) => {
  return await prisma.trip.findFirst({
    where: {
      busId,
      isActive: true,
    },
  });
};

// Fetch bus with route and operator
export const getBusRouteOperator = async ({ busId, operatorId }) => {
  return await prisma.bus.findFirst({
    where: {
      id: busId,
      operator: {
        userId: operatorId,
      },
    },
    include: {
      route: true,
    },
  });
};

// Create a new trip
export const startNewTrip = async ({ busId, routeId, direction }) => {
  return await prisma.trip.create({
    data: {
      busId,
      routeId,
      direction,
    },
  });
};

// End a trip
export const endTripById = async ({ tripId }) => {
  return await prisma.trip.update({
    where: {
      id: tripId,
    },
    data: {
      isActive: false,
      endTime: new Date(),
    },
  });
};

// Fetch all buses for operator with current active trip
export const getBusesForOperator = async ({ operatorId }) => {
  return await prisma.bus.findMany({
    where: {
      operatorId,
    },
    include: {
      route: true,
      Trip: {
        where: { isActive: true },
        take: 1,
      },
    },
  });
};
