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
