import express from 'express';
import userAuth from '../middleware/userAuth.js';
import requireRole from '../middleware/requireRole.js';
import {
  getDailyRevenue,
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

export default revenueRouter;
