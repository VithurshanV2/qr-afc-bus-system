import {
  countOperatorsRevenue,
  getDailyRevenueForOperator,
  getMonthlyRevenueForOperator,
  getOperatorsRevenueList,
  getRevenueByTripId,
} from '../models/revenueModel.js';

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

// Get daily revenue for operator
export const getDailyRevenue = async (req, res) => {
  try {
    const { date } = req.query;
    const operatorId = req.userId;

    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: 'Date is required' });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const revenues = await getDailyRevenueForOperator({
      operatorId,
      startOfDay,
      endOfDay,
    });

    let totalTickets = 0;
    let totalRevenue = 0;
    const totalTrips = revenues.length;

    for (let i = 0; i < revenues.length; i++) {
      totalTickets += revenues[i].ticketCount;
      totalRevenue += revenues[i].totalAmount;
    }

    return res.status(200).json({
      success: true,
      totalTrips,
      totalTickets,
      totalRevenue,
      revenues,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Get monthly revenue for operator
export const getMonthlyRevenue = async (req, res) => {
  try {
    const { year, month } = req.query;
    const operatorId = req.userId;

    if (!year || !month) {
      return res
        .status(400)
        .json({ success: false, message: 'Year and month are required' });
    }

    if (month < 1 || month > 12) {
      return res.status(400).json({ success: false, message: 'Invalid month' });
    }

    const startOfMonth = new Date(year, month - 1, 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(year, month, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const revenues = await getMonthlyRevenueForOperator({
      operatorId,
      startOfMonth,
      endOfMonth,
    });

    let totalTickets = 0;
    let totalRevenue = 0;
    const totalTrips = revenues.length;

    for (let i = 0; i < revenues.length; i++) {
      totalTickets += revenues[i].ticketCount;
      totalRevenue += revenues[i].totalAmount;
    }

    return res.status(200).json({
      success: true,
      totalTrips,
      totalTickets,
      totalRevenue,
      revenues,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Search operators revenue for transport authority
export const searchOperatorsRevenue = async (req, res) => {
  try {
    let { from, to, search, page = 1, limit = 50 } = req.query;

    search = search?.trim();

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const revenues = await getOperatorsRevenueList({
      from,
      to,
      search,
      skip,
      take,
    });

    const total = await countOperatorsRevenue({ from, to, search });

    let totalTickets = 0;
    let totalRevenue = 0;

    for (let i = 0; i < revenues.length; i++) {
      totalTickets += revenues[i].ticketCount;
      totalRevenue += revenues[i].totalAmount;
    }

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      totalTickets,
      totalRevenue,
      revenues,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
