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
      status: 'PENDING',
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

  // If commuter is close to first halt, return it
  const firstHalt = halts[0];
  const firstDistance = geolib.getDistance(
    { latitude, longitude },
    { latitude: firstHalt.latitude, longitude: firstHalt.longitude },
  );

  if (firstDistance < 50) {
    return firstHalt;
  }

  // Loop through consecutive halts to find which segment the commuter is on
  for (let i = 1; i < halts.length; i++) {
    const previous = halts[i - 1];
    const current = halts[i];

    const dPrevious = geolib.getDistance(
      {
        latitude,
        longitude,
      },
      { latitude: previous.latitude, longitude: previous.longitude },
    );

    const dCurrent = geolib.getDistance(
      {
        latitude,
        longitude,
      },
      { latitude: current.latitude, longitude: current.longitude },
    );

    const dSegment = geolib.getDistance(
      {
        latitude: previous.latitude,
        longitude: previous.longitude,
      },
      { latitude: current.latitude, longitude: current.longitude },
    );

    // If commuter is between previous and current halt, pick previous as boarding halt
    if (dPrevious + dCurrent - dSegment < 100) {
      return previous;
    }
  }

  // Fallback if not on any segment, pick nearest halt by distance
  let nearestHalt = halts[0];
  let minDistance = Infinity;

  for (let i = 0; i < halts.length; i++) {
    const halt = halts[i];
    const distance = geolib.getDistance(
      { latitude, longitude },
      { latitude: halt.latitude, longitude: halt.longitude },
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestHalt = halt;
    }
  }

  return nearestHalt;
};

// Fetch upcoming destination halts after boarding halt
export const getUpcomingDestinationHalts = (trip, boardingHalt) => {
  let haltsData;

  if (trip.direction === 'DIRECTIONA') {
    haltsData = trip.route.haltsA;
  } else {
    haltsData = trip.route.haltsB;
  }

  const halts = haltsData.halts;

  const boardingIndex = halts.findIndex((halt) => halt.id === boardingHalt.id);

  if (boardingIndex === -1) {
    return halts;
  }

  return halts.slice(boardingIndex + 1);
};

// Update ticket with destination halt
export const setDestinationHalt = async (ticketId, destinationHalt) => {
  return await prisma.ticket.update({
    where: { id: ticketId },
    data: { destinationHalt, status: 'PENDING' },
  });
};

// Update passenger count
export const setPassengerCount = async (ticketId, adultCount, childCount) => {
  return await prisma.ticket.update({
    where: { id: ticketId },
    data: { adultCount, childCount, status: 'PENDING' },
  });
};
