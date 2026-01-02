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
