import Stripe from 'stripe';
import {
  getWalletByUserId,
  getWalletTransaction,
  payTicketFare,
  updateWalletBalance,
} from '../models/walletModel.js';
import {
  getAuthorizedTicket,
  validateHaltSelection,
  validatePassengerCount,
} from '../utils/ticketUtils.js';
import { calculateFare } from '../services/ticketService.js';

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

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount } = req.body;
    const amountInCents = Math.round(amount * 100);

    if (!Number.isFinite(amount) || amount <= 0 || !Number.isInteger(amount)) {
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

    const wallet = await getWalletByUserId(userId);

    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: 'Wallet not found' });
    }

    if (wallet.balance + amountInCents > MAX_WALLET_BALANCE) {
      return res.status(400).json({
        success: false,
        message: `Top Up exceeds maximum wallet balance of ${MAX_WALLET_BALANCE / 100} LKR`,
      });
    }

    // Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'lkr',
            product_data: { name: 'Wallet Top Up' },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],

      mode: 'payment',
      metadata: { userId },
      success_url: `${process.env.CLIENT_URL}/commuter/wallet`,
      cancel_url: `${process.env.CLIENT_URL}/commuter/wallet`,
    });

    return res.status(200).json({
      success: true,
      url: session.url,
      message: 'Stripe checkout session created',
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

  if (event.type === 'checkout.session.completed') {
    try {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const amount = session.amount_total;
      const sessionId = session.id;

      if (!userId) {
        return res.sendStatus(200);
      }

      await updateWalletBalance(
        parseInt(userId, 10),
        amount,
        'CREDIT',
        'Top Up via Stripe',
        sessionId,
      );
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  } else if (event.type === 'payment_intent.succeeded') {
    try {
      const paymentIntent = event.data.object;
      const userId = paymentIntent.metadata.userId;
      const amount = paymentIntent.amount;

      if (!userId) {
        return res.sendStatus(200);
      }

      await updateWalletBalance(
        parseInt(userId, 10),
        amount,
        'CREDIT',
        'Top Up via Stripe',
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

export const fetchCheckoutSession = async (req, res) => {
  try {
    const { session_id } = req.body;
    if (!session_id) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing session ID' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    const wallet = await getWalletByUserId(req.userId);

    return res.status(200).json({ success: true, session, wallet });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Retrieve recent transactions
export const getTransactions = async (req, res) => {
  try {
    const userId = req.userId;
    const { cursor, limit } = req.query;

    // Validate limit
    let parsedLimit = parseInt(limit, 10);

    if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
      parsedLimit = 5;
    }

    if (parsedLimit > 50) {
      parsedLimit = 50;
    }

    // Validate cursor
    let parsedCursor = cursor ? parseInt(cursor, 10) : undefined;

    if (cursor && !Number.isFinite(parsedCursor)) {
      parsedCursor = undefined;
    }

    const transactions = await getWalletTransaction(
      userId,
      parsedLimit,
      parsedCursor,
    );

    return res.status(200).json({
      success: true,
      transactions,
      nextCursor:
        transactions.length > 0
          ? transactions[transactions.length - 1].id
          : null,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Fare is deducted from commuters wallet balance
export const payFare = async (req, res) => {
  try {
    const ticketId = Number(req.params.ticketId);
    const userId = req.userId;

    const ticket = await getAuthorizedTicket(ticketId, userId, res);
    if (!ticket) return;

    const haltError = validateHaltSelection(ticket);
    if (haltError) return res.status(400).json(haltError);

    const passengerError = validatePassengerCount(ticket);
    if (passengerError) return res.status(400).json(passengerError);

    const fares = calculateFare(ticket.trip, ticket);

    const result = await payTicketFare(ticketId, userId, fares);

    return res.status(200).json({
      success: true,
      message: 'Ticket paid successfully',
      ticket: result.updatedTicket,
    });
  } catch (error) {
    console.error(error);
    const status = error.message === 'Insufficient balance' ? 400 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};
