import express from 'express';
import userAuth from '../middleware/userAuth.js';
import requireRole from '../middleware/requireRole.js';
import {
  getDailyRevenue,
  getMonthlyRevenue,
  getOperatorsMonthlyRevenue,
  getTripRevenue,
} from '../controllers/revenueController.js';

const revenueRouter = express.Router();

revenueRouter.get(
  '/trip/:tripId',
  userAuth,
  requireRole(['BUSOPERATOR']),
  getTripRevenue,
);
revenueRouter.get(
  '/daily',
  userAuth,
  requireRole(['BUSOPERATOR']),
  getDailyRevenue,
);
revenueRouter.get(
  '/monthly',
  userAuth,
  requireRole(['BUSOPERATOR']),
  getMonthlyRevenue,
);
revenueRouter.get(
  '/operators/monthly',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY']),
  getOperatorsMonthlyRevenue,
);

export default revenueRouter;
