import express from 'express';
import {
  getWallet,
  stripeWebhook,
  topUpWallet,
} from '../controllers/walletController.js';
import userAuth from '../middleware/userAuth.js';

const walletRouter = express.Router();

walletRouter.get('/', userAuth, getWallet);
walletRouter.post('/top-up', userAuth, topUpWallet);

// Stripe webhook endpoint
walletRouter.post('/stripe-webhook', stripeWebhook);

export default walletRouter;
