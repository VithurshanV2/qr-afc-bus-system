import express from 'express';
import userAuth from '../middleware/userAuth.js';
import requireRole from '../middleware/requireRole.js';
import {
  createRoute,
  deleteRoute,
  fetchRouteHalts,
  inactiveRouteController,
  searchRoutes,
  updateRouteController,
} from '../controllers/routeController.js';

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
routeRouter.get(
  '/list',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY']),
  searchRoutes,
);
routeRouter.delete(
  '/delete-route/:routeId',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY']),
  deleteRoute,
);
routeRouter.get(
  '/halts/:routeId',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY']),
  fetchRouteHalts,
);
routeRouter.post(
  '/inactive/:routeId',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY']),
  inactiveRouteController,
);

export default routeRouter;
