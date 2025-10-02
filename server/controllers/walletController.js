import Stripe from 'stripe';
import { getWalletByUserId } from '../models/walletModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const MAX_WALLET_BALANCE = 5000;

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

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid amount' });
    }

    // Fetch current wallet balance
    const wallet = await getWalletByUserId(userId);
    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: 'Wallet not found' });
    }

    // Check if top up exceeds max balance
    if (wallet.balance + amount > MAX_WALLET_BALANCE) {
      return res.status(400).json({
        success: false,
        message: `Top Up exceeds maximum wallet balance of ${MAX_WALLET_BALANCE} LKR`,
      });
    }

    // Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
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
