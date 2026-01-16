import express from 'express';
import userAuth from '../middleware/userAuth.js';
import requireRole from '../middleware/requireRole.js';
import {
  activateRouteController,
  createRoute,
  deleteRoute,
  fetchRouteHalts,
  inactivateRouteController,
  searchRoutes,
  updateAllFares,
  updateRouteController,
} from '../controllers/routeController.js';

const routeRouter = express.Router();

routeRouter.post(
  '/create-route',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  createRoute,
);
routeRouter.put(
  '/update-route/:routeId',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  updateRouteController,
);
routeRouter.get(
  '/list',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  searchRoutes,
);
routeRouter.delete(
  '/delete-route/:routeId',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  deleteRoute,
);
routeRouter.get(
  '/halts/:routeId',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  fetchRouteHalts,
);
routeRouter.post(
  '/inactive/:routeId',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  inactivateRouteController,
);
routeRouter.post(
  '/activate/:routeId',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  activateRouteController,
);
routeRouter.post(
  '/update-all-fares',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  updateAllFares,
);

export default routeRouter;
