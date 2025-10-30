import geolib from 'geolib';
import { getHaltsByDirection } from '../utils/routeUtils.js';

// Compute nearest boarding halt from commuter GPS
export const getNearestBoardingHalt = (trip, latitude, longitude) => {
  const halts = getHaltsByDirection(trip);

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
  const halts = getHaltsByDirection(trip);

  const boardingIndex = halts.findIndex((halt) => halt.id === boardingHalt.id);

  if (boardingIndex === -1) {
    return halts;
  }

  return halts.slice(boardingIndex + 1);
};

// Calculate base fare and total fare
export const calculateFare = (trip, ticket) => {
  const halts = getHaltsByDirection(trip);

  const haltsTraveled = ticket.destinationHalt.id - ticket.boardingHalt.id;

  const baseFare = halts[haltsTraveled].fare;

  const totalFare =
    baseFare * ticket.adultCount + (baseFare / 2) * ticket.childCount;

  return { baseFare, totalFare };
};
