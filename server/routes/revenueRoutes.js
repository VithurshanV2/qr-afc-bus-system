import express from 'express';
import userAuth from '../middleware/userAuth.js';
import requireRole from '../middleware/requireRole.js';
import {
  getDailyRevenue,
  getMonthlyRevenue,
  getOperatorMonthlyTripsDetails,
  getOperatorsMonthlyRevenue,
  getTripRevenue,
} from '../controllers/revenueController.js';
import checkOperatorActive from '../middleware/checkOperatorActive.js';

const revenueRouter = express.Router();

revenueRouter.get(
  '/trip/:tripId',
  userAuth,
  checkOperatorActive,
  requireRole(['BUSOPERATOR']),
  getTripRevenue,
);
revenueRouter.get(
  '/daily',
  userAuth,
  checkOperatorActive,
  requireRole(['BUSOPERATOR']),
  getDailyRevenue,
);
revenueRouter.get(
  '/monthly',
  userAuth,
  checkOperatorActive,
  requireRole(['BUSOPERATOR']),
  getMonthlyRevenue,
);
revenueRouter.get(
  '/operators/monthly',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  getOperatorsMonthlyRevenue,
);
revenueRouter.get(
  '/operators/:operatorId/trips',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  getOperatorMonthlyTripsDetails,
);

export default revenueRouter;
