export const getHaltsByDirection = (trip) => {
  if (trip.direction === 'DIRECTIONA') {
    return trip.route.haltsA.halts;
  } else {
    return trip.route.haltsB.halts;
  }
};
