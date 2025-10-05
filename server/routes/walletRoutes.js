import express from 'express';
import {
  createCheckoutSession,
  fetchCheckoutSession,
  getWallet,
  stripeWebhook,
} from '../controllers/walletController.js';
import userAuth from '../middleware/userAuth.js';

const walletRouter = express.Router();

walletRouter.get('/', userAuth, getWallet);

// Stripe webhook endpoint
walletRouter.post('/stripe-webhook', stripeWebhook);

walletRouter.post('/create-checkout-session', userAuth, createCheckoutSession);
walletRouter.post('/fetch-session', userAuth, fetchCheckoutSession);

export default walletRouter;
