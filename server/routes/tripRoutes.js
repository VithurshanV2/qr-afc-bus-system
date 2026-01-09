import express from 'express';
import userAuth from '../middleware/userAuth.js';
import requireRole from '../middleware/requireRole.js';
import {
  endTrip,
  getNextHaltExitCount,
  getOperatorBuses,
  startTrip,
} from '../controllers/tripController.js';
import checkOperatorActive from '../middleware/checkOperatorActive.js';

const tripRouter = express.Router();

tripRouter.post(
  '/start',
  userAuth,
  checkOperatorActive,
  requireRole(['BUSOPERATOR']),
  startTrip,
);
tripRouter.post(
  '/end',
  userAuth,
  checkOperatorActive,
  requireRole(['BUSOPERATOR']),
  endTrip,
);
tripRouter.get(
  '/operator-buses',
  userAuth,
  checkOperatorActive,
  requireRole(['BUSOPERATOR']),
  getOperatorBuses,
);
tripRouter.get(
  '/:tripId/next-halt-exit',
  userAuth,
  checkOperatorActive,
  requireRole(['BUSOPERATOR']),
  getNextHaltExitCount,
);

export default tripRouter;
