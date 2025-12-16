import express from 'express';
import userAuth from '../middleware/userAuth';
import requireRole from '../middleware/requireRole';
import {
  createRoute,
  updateRouteController,
} from '../controllers/routeController';

const routeRouter = express.Router();

routeRouter.post(
  '/create-route',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY']),
  createRoute,
);
routeRouter.put(
  '/update-route/:routeId',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY']),
  updateRouteController,
);

export default routeRouter;
