import {
  endTripById,
  getActiveTripByBusId,
  getBusesForOperator,
  getBusRouteOperator,
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
        .json({ success: false, message: 'BusID and direction are required' });
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
