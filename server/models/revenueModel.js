import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

// Fetch revenue for a specific trip of a operator
export const getRevenueByTripId = async ({ tripId, operatorId }) => {
  return await prisma.revenue.findFirst({
    where: {
      tripId,
      trip: {
        bus: {
          operator: {
            userId: operatorId,
          },
        },
      },
    },
    include: {
      trip: {
        include: {
          route: {
            select: {
              number: true,
              name: true,
              busType: true,
            },
          },
          bus: {
            select: {
              registrationNumber: true,
            },
          },
        },
      },
    },
  });
};

// Fetch daily revenue for an operator
export const getDailyRevenueForOperator = async ({
  operatorId,
  startOfDay,
  endOfDay,
}) => {
  return await prisma.revenue.findMany({
    where: {
      trip: {
        bus: {
          operator: {
            userId: operatorId,
          },
        },
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    },
    include: { trip: { include: { route: true, bus: true } } },
    orderBy: { trip: { startTime: 'desc' } },
  });
};

// Fetch monthly revenue for an operator
export const getMonthlyRevenueForOperator = async ({
  operatorId,
  startOfMonth,
  endOfMonth,
}) => {
  return await prisma.revenue.findMany({
    where: {
      trip: {
        bus: {
          operator: {
            userId: operatorId,
          },
        },
        startTime: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    },
    include: { trip: { include: { route: true, bus: true } } },
    orderBy: { trip: { startTime: 'desc' } },
  });
};

// Fetch monthly operator revenue for transport authority
export const getMonthlyRevenueForAuthority = async ({
  search = '',
  startOfMonth,
  endOfMonth,
}) => {
  const where = {
    trip: {
      startTime: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  };

  if (search) {
    where.trip.bus = {
      operator: {
        OR: [
          { user: { name: { contains: search, mode: 'insensitive' } } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { nic: { contains: search, mode: 'insensitive' } },
        ],
      },
    };
  }

  return await prisma.revenue.findMany({
    where,
    include: {
      trip: {
        include: {
          bus: {
            include: {
              operator: {
                include: { user: true },
              },
            },
          },
        },
      },
    },
  });
};
