import express from 'express';
import userAuth from '../middleware/userAuth.js';
import requireRole from '../middleware/requireRole.js';
import {
  endTrip,
  getOperatorBuses,
  startTrip,
} from '../controllers/tripController.js';

const tripRouter = express.Router();

tripRouter.post('/start', userAuth, requireRole(['BUSOPERATOR']), startTrip);
tripRouter.post('/end', userAuth, requireRole(['BUSOPERATOR']), endTrip);
tripRouter.post(
  '/operator-buses',
  userAuth,
  requireRole(['BUSOPERATOR']),
  getOperatorBuses,
);

export default tripRouter;
