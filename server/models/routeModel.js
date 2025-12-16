import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

// Fetch route by ID
export const getRouteById = async (routeId) => {
  return await prisma.route.findUnique({
    where: { id: routeId },
  });
};

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

// Update existing route
export const updateRoute = async ({ routeId, data }) => {
  return await prisma.route.update({
    where: { id: routeId },
    data,
  });
};
