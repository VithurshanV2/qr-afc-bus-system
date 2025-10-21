import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { scanQrBoarding } from '../controllers/ticketController.js';

const ticketRouter = express.Router();

ticketRouter.post('/scan-qr', userAuth, scanQrBoarding);

export default ticketRouter;
