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
