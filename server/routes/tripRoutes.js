import express from 'express';
import userAuth from '../middleware/userAuth.js';
import requireRole from '../middleware/requireRole.js';
import { startTrip } from '../controllers/tripController.js';

const tripRouter = express.Router();

tripRouter.post('/start', userAuth, requireRole(['BUSOPERATOR']), startTrip);

export default tripRouter;
