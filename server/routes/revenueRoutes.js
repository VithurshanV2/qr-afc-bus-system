import express from 'express';
import userAuth from '../middleware/userAuth.js';
import requireRole from '../middleware/requireRole.js';
import { getTripRevenue } from '../controllers/revenueController.js';

const revenueRouter = express.Router();

revenueRouter.get(
  '/trip/:tripId',
  userAuth,
  requireRole(['BUSOPERATOR']),
  getTripRevenue,
);

export default revenueRouter;
