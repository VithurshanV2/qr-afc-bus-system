import { getRevenueByTripId } from '../models/revenueModel.js';

// Get revenue for a specific trip
export const getTripRevenue = async (req, res) => {
  try {
    const { tripId } = req.params;
    const operatorId = req.userId;

    if (!tripId) {
      return res
        .status(400)
        .json({ success: false, message: 'Trip ID is required' });
    }

    const revenue = await getRevenueByTripId({
      tripId: Number(tripId),
      operatorId,
    });

    if (!revenue) {
      return res
        .status(404)
        .json({ success: false, message: 'Revenue data not found' });
    }

    return res.status(200).json({ success: true, revenue });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
