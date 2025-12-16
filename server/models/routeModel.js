import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

// Check if route already exists
export const findRouteByNumberBusType = async (number, busType) => {
  return await prisma.route.findUnique({
    where: {
      number_busType: {
        number,
        busType,
      },
    },
  });
};

// Create new route as draft
export const insertRoute = async ({
  number,
  name,
  busType,
  haltsA,
  haltsB,
  createdById,
}) => {
  return await prisma.route.create({
    data: {
      number,
      name,
      busType,
      haltsA,
      haltsB,
      createdById,
      status: 'DRAFT',
    },
  });
};
