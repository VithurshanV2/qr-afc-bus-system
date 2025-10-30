import express from 'express';
import {
  createCheckoutSession,
  fetchCheckoutSession,
  getTransactions,
  getWallet,
  payFare,
  stripeWebhook,
} from '../controllers/walletController.js';
import userAuth from '../middleware/userAuth.js';

const walletRouter = express.Router();

walletRouter.get('/', userAuth, getWallet);
walletRouter.get('/transactions', userAuth, getTransactions);
walletRouter.post('/pay-fare/:ticketId', userAuth, payFare);

// Stripe webhook endpoint
walletRouter.post('/stripe-webhook', stripeWebhook);
walletRouter.post('/create-checkout-session', userAuth, createCheckoutSession);
walletRouter.post('/fetch-session', userAuth, fetchCheckoutSession);

export default walletRouter;
