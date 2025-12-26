import express from 'express';
import userAuth from '../middleware/userAuth.js';
import requireRole from '../middleware/requireRole.js';
import { endTrip, startTrip } from '../controllers/tripController.js';

const tripRouter = express.Router();

tripRouter.post('/start', userAuth, requireRole(['BUSOPERATOR']), startTrip);
tripRouter.post('/end', userAuth, requireRole(['BUSOPERATOR']), endTrip);

export default tripRouter;
