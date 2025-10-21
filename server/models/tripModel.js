import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

// Fetch active trip by busId
export const getActiveTripByBusId = async (busId) => {
  return await prisma.trip.findFirst({
    where: {
      busId,
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
