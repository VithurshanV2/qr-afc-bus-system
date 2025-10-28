import express from 'express';
import userAuth from '../middleware/userAuth.js';
import {
  getUpcomingHalts,
  scanQrBoarding,
  selectDestinationHalt,
} from '../controllers/ticketController.js';

const ticketRouter = express.Router();

ticketRouter.post('/scan-qr', userAuth, scanQrBoarding);
ticketRouter.get('/upcoming-halts/:ticketId', userAuth, getUpcomingHalts);
ticketRouter.post(
  '/destination-halt/:ticketId',
  userAuth,
  selectDestinationHalt,
);

export default ticketRouter;
