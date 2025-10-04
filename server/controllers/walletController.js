import Stripe from 'stripe';
import {
  getWalletByUserId,
  updateWalletBalance,
} from '../models/walletModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const MAX_WALLET_BALANCE = 5000 * 100;
const MIN_TOP_UP = 200 * 100;

// Get wallet balance for logged in user
export const getWallet = async (req, res) => {
  try {
    const userId = req.userId;
    const wallet = await getWalletByUserId(userId);

    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: 'Wallet not found' });
    }

    return res.json({
      success: true,
      message: 'Wallet fetched successfully',
      wallet,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Top up wallet via third party gateway (PayHere)
export const topUpWallet = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount } = req.body;
    const amountInCents = Math.round(amount * 100);

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid amount' });
    }

    if (amountInCents < MIN_TOP_UP) {
      return res.status(400).json({
        success: false,
        message: `Minimum Top Up amount is ${MIN_TOP_UP / 100} LKR`,
      });
    }

    // Fetch current wallet balance
    const wallet = await getWalletByUserId(userId);
    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: 'Wallet not found' });
    }

    // Check if top up exceeds max balance
    if (wallet.balance + amountInCents > MAX_WALLET_BALANCE) {
      return res.status(400).json({
        success: false,
        message: `Top Up exceeds maximum wallet balance of ${MAX_WALLET_BALANCE / 100} LKR`,
      });
    }

    // Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'lkr',
      metadata: { userId },
    });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      message: 'Stripe payment intent created',
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Stripe webhook
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, message: 'Webhook error' });
  }

  if (event.type === 'payment_intent.succeeded') {
    try {
      const paymentIntent = event.data.object;
      const userId = paymentIntent.metadata.userId;
      const amount = paymentIntent.amount;

      if (!userId) {
        return res.sendStatus(200);
      }

      await updateWalletBalance(
        userId,
        amount,
        'CREDIT',
        'Wallet Top Up via Stripe',
      );
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    const userId = paymentIntent.metadata.userId;
    const reason = paymentIntent.last_payment_error;

    console.log(`Top up failed for user ${userId}: ${reason}`);
  }

  return res.sendStatus(200);
};
