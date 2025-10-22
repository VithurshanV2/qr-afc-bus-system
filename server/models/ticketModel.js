import { PrismaClient } from '../generated/prisma/index.js';
import geolib from 'geolib';

const prisma = new PrismaClient();

// Create ticket at boarding
export const createTicketAtBoarding = async ({
  userId,
  tripId,
  boardingHalt,
}) => {
  return await prisma.ticket.create({
    data: {
      commuterId: userId,
      tripId,
      boardingHalt,
    },
  });
};

// Fetch ticket by ID
export const getTicketById = async (id) => {
  return await prisma.ticket.findUnique({
    where: { id },
    include: {
      commuter: true,
      trip: {
        include: { route: true, bus: true },
      },
    },
  });
};

// Compute nearest boarding halt from commuter GPS
export const getNearestBoardingHalt = (trip, latitude, longitude) => {
  let haltsData;

  if (trip.direction === 'DIRECTIONA') {
    haltsData = trip.route.haltsA;
  } else {
    haltsData = trip.route.haltsB;
  }

  const halts = haltsData.halts;

  let nearestHalt = halts[0];
  let minDistance = Infinity;

  halts.forEach((halt) => {
    const distance = geolib.getDistance(
      {
        latitude,
        longitude,
      },
      { latitude: halt.latitude, longitude: halt.longitude },
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestHalt = halt;
    }
  });

  return nearestHalt.englishName;
};
