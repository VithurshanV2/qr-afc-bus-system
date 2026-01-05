import {
  countDailyRevenueForOperator,
  countMonthlyRevenueForOperator,
  countOperatorMonthlyTrips,
  getDailyRevenueForOperator,
  getMonthlyRevenueForAuthority,
  getMonthlyRevenueForOperator,
  getOperatorMonthlyTrips,
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
    const { date, page = 1, limit = 10 } = req.query;
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

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const revenues = await getDailyRevenueForOperator({
      operatorId,
      startOfDay,
      endOfDay,
      skip,
      take,
    });

    const total = await countDailyRevenueForOperator({
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
      total,
      page: Number(page),
      limit: Number(limit),
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
    const { year, month, page = 1, limit = 10 } = req.query;
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

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const revenues = await getMonthlyRevenueForOperator({
      operatorId,
      startOfMonth,
      endOfMonth,
      skip,
      take,
    });

    const total = await countMonthlyRevenueForOperator({
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
      total,
      page: Number(page),
      limit: Number(limit),
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

// Get monthly revenue of operators for transport authority
export const getOperatorsMonthlyRevenue = async (req, res) => {
  try {
    let { year, month, search, page = 1, limit = 10 } = req.query;

    search = search?.trim();

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

    const revenues = await getMonthlyRevenueForAuthority({
      search,
      startOfMonth,
      endOfMonth,
    });

    // Group operators
    const operatorRevenue = {};

    for (let i = 0; i < revenues.length; i++) {
      const operatorId = revenues[i].trip.bus.operator.userId;

      if (!operatorRevenue[operatorId]) {
        operatorRevenue[operatorId] = {
          operator: revenues[i].trip.bus.operator,
          totalRevenue: 0,
          totalTickets: 0,
          totalTrips: 0,
        };
      }

      operatorRevenue[operatorId].totalRevenue += revenues[i].totalAmount;
      operatorRevenue[operatorId].totalTickets += revenues[i].ticketCount;
      operatorRevenue[operatorId].totalTrips += 1;
    }

    // Convert to array
    let operators = Object.values(operatorRevenue);
    operators.sort((a, b) => b.totalRevenue - a.totalRevenue);
    const total = operators.length;

    const skip = (Number(page) - 1) * Number(limit);
    operators = operators.slice(skip, skip + Number(limit));

    let totalTickets = 0;
    let totalRevenue = 0;
    let totalTrips = 0;

    for (let i = 0; i < operators.length; i++) {
      totalTickets += operators[i].totalTickets;
      totalRevenue += operators[i].totalRevenue;
      totalTrips += operators[i].totalTrips;
    }

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      totalTickets,
      totalRevenue,
      totalTrips,
      operators,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Fetch trips for a operator for a specific month
export const getOperatorMonthlyTripsDetails = async (req, res) => {
  try {
    const { operatorId } = req.params;
    const { year, month, page = 1, limit = 50 } = req.query;

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

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const revenues = await getOperatorMonthlyTrips({
      operatorId: Number(operatorId),
      startOfMonth,
      endOfMonth,
      skip,
      take,
    });

    const total = await countOperatorMonthlyTrips({
      operatorId: Number(operatorId),
      startOfMonth,
      endOfMonth,
    });

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
