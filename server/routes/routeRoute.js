import express from 'express';
import userAuth from '../middleware/userAuth';
import requireRole from '../middleware/requireRole';
import { createRoute } from '../controllers/routeController';

const routeRouter = express.Router();

routeRouter.post(
  '/create-route',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY']),
  createRoute,
);

export default routeRouter;
