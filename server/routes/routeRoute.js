import express from 'express';
import userAuth from '../middleware/userAuth.js';
import requireRole from '../middleware/requireRole.js';
import {
  createRoute,
  deleteRoute,
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

export default routeRouter;
