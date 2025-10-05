import express from 'express';
import {
  createCheckoutSession,
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

walletRouter.post('/create-checkout-session', userAuth, createCheckoutSession);

export default walletRouter;
