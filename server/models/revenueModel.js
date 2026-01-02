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

// Fetch operator revenue for transport authority
export const getOperatorsRevenueList = async ({
  search = '',
  from,
  to,
  skip = 0,
  take = 10,
}) => {
  const where = {};

  if (from && to) {
    where.trip = {
      startTime: {
        gte: new Date(from),
        lte: new Date(to),
      },
    };
  }

  if (search) {
    where.OR = [
      {
        trip: {
          bus: {
            registrationNumber: { contains: search, mode: 'insensitive' },
          },
        },
      },
      {
        trip: {
          bus: {
            operator: {
              user: { name: { contains: search, mode: 'insensitive' } },
            },
          },
        },
      },
      {
        trip: {
          bus: {
            operator: {
              user: { email: { contains: search, mode: 'insensitive' } },
            },
          },
        },
      },
      {
        trip: {
          route: {
            number: { contains: search, mode: 'insensitive' },
          },
        },
      },
      {
        trip: {
          route: {
            name: { contains: search, mode: 'insensitive' },
          },
        },
      },
    ];
  }

  return await prisma.revenue.findMany({
    where,
    include: {
      trip: {
        include: {
          route: true,
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
    orderBy: { trip: { startTime: 'desc' } },
    skip,
    take,
  });
};

export const countOperatorsRevenue = async ({ search = '', from, to }) => {
  const where = {};

  if (from && to) {
    where.trip = {
      startTime: {
        gte: new Date(from),
        lte: new Date(to),
      },
    };
  }

  if (search) {
    where.OR = [
      {
        trip: {
          bus: {
            registrationNumber: { contains: search, mode: 'insensitive' },
          },
        },
      },
      {
        trip: {
          bus: {
            operator: {
              user: { name: { contains: search, mode: 'insensitive' } },
            },
          },
        },
      },
      {
        trip: {
          bus: {
            operator: {
              user: { email: { contains: search, mode: 'insensitive' } },
            },
          },
        },
      },
      {
        trip: {
          route: {
            number: { contains: search, mode: 'insensitive' },
          },
        },
      },
      {
        trip: {
          route: {
            name: { contains: search, mode: 'insensitive' },
          },
        },
      },
    ];
  }

  return await prisma.revenue.count({ where });
};
