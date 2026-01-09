import {
  countExitCountAtHalt,
  createRevenueForTrip,
  endTripById,
  getActiveTripByBusId,
  getBusesForOperator,
  getBusRouteOperator,
  getTripById,
  startNewTrip,
} from '../models/tripModel.js';

// Start a trip
export const startTrip = async (req, res) => {
  try {
    const { busId, direction } = req.body;
    const operatorId = req.userId;

    if (!busId || !direction) {
      return res
        .status(400)
        .json({ success: false, message: 'Direction is required' });
    }
    const busIdNum = Number(busId);
    const operatorIdNum = Number(operatorId);

    const bus = await getBusRouteOperator({
      busId: busIdNum,
      operatorId: operatorIdNum,
    });

    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    if (!bus.route) {
      return res
        .status(400)
        .json({ success: false, message: 'Bus has no assigned route' });
    }

    if (bus.route.status !== 'ACTIVE') {
      return res
        .status(400)
        .json({ success: false, message: 'Route is not active' });
    }

    const activeTrip = await getActiveTripByBusId({ busId: busIdNum });

    if (activeTrip) {
      return res.status(400).json({
        success: false,
        message: 'An active trip already exists for this bus',
      });
    }

    const trip = await startNewTrip({
      busId: busIdNum,
      routeId: bus.route.id,
      direction,
    });

    return res.status(200).json({ success: true, trip });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// End a trip
export const endTrip = async (req, res) => {
  try {
    const { busId } = req.body;

    if (!busId) {
      return res
        .status(400)
        .json({ success: false, message: 'BusID is required' });
    }
    const busIdNum = Number(busId);

    const activeTrip = await getActiveTripByBusId({ busId: busIdNum });

    if (!activeTrip) {
      return res.status(400).json({
        success: false,
        message: 'No active trip found for this bus',
      });
    }

    const trip = await endTripById({
      tripId: activeTrip.id,
    });

    await createRevenueForTrip({ tripId: activeTrip.id });

    return res.status(200).json({ success: true, trip });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Fetch all buses of operators
export const getOperatorBuses = async (req, res) => {
  try {
    const operatorId = Number(req.userId);

    const buses = await getBusesForOperator({ operatorId });

    return res.status(200).json({ success: true, buses });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Get next halt exit count
export const getNextHaltExitCount = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { currentHaltId } = req.query;

    if (!tripId || !currentHaltId) {
      return res.status(400).json({
        success: false,
        message: 'Trip and current halt data required',
      });
    }

    const trip = await getTripById({ tripId: Number(tripId) });

    if (!trip) {
      return res
        .status(404)
        .json({ success: false, message: 'Trip not found' });
    }

    if (!trip.isActive) {
      return res
        .status(400)
        .json({ success: false, message: 'Trip is not active' });
    }

    const haltsJson =
      trip.direction === 'DIRECTIONA' ? trip.route.haltsA : trip.route.haltsB;

    const haltsData = JSON.parse(haltsJson);
    const halts = haltsData.halts;

    // Find current position
    let currentPosition = null;

    for (let i = 0; i < halts.length; i++) {
      if (halts[i].id === Number(currentHaltId)) {
        currentPosition = i;
        break;
      }
    }

    if (currentPosition === null) {
      return res
        .status(400)
        .json({ success: false, message: 'Halt not found in route' });
    }

    // Find next halt position
    const nextPosition = currentPosition + 1;

    // Last halt
    if (nextPosition >= halts.length) {
      const exitCount = await countExitCountAtHalt({
        tripId: Number(tripId),
        haltId: Number(currentHaltId),
      });

      return res.status(200).json({
        success: true,
        currentHalt: {
          id: halts[currentPosition].id,
          name: halts[currentPosition].englishName,
        },
        exitCount,
        isLastHalt: true,
      });
    }

    // show next halt and exit count
    const nextHalt = halts[nextPosition];

    const exitCount = await countExitCountAtHalt({
      tripId: Number(tripId),
      haltId: nextHalt.id,
    });

    return res.status(200).json({
      success: true,
      nextHalt: { id: nextHalt.id, name: nextHalt.englishName },
      exitCount,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
