import express from 'express';
import userAuth from '../middleware/userAuth.js';
import {
  cancelTicket,
  fetchActiveTicket,
  getFares,
  getUpcomingHalts,
  scanQrBoarding,
  selectDestinationHalt,
  setAccompanyingPassengers,
} from '../controllers/ticketController.js';

const ticketRouter = express.Router();

ticketRouter.post('/scan-qr', userAuth, scanQrBoarding);
ticketRouter.get('/upcoming-halts/:ticketId', userAuth, getUpcomingHalts);
ticketRouter.post(
  '/destination-halt/:ticketId',
  userAuth,
  selectDestinationHalt,
);
ticketRouter.post(
  '/accompanying-passengers/:ticketId',
  userAuth,
  setAccompanyingPassengers,
);
ticketRouter.get('/fares/:ticketId', userAuth, getFares);
ticketRouter.post('/cancel', userAuth, cancelTicket);
ticketRouter.get('/active', userAuth, fetchActiveTicket);

export default ticketRouter;
