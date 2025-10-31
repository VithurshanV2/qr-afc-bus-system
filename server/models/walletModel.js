import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

// Fetch wallet by userId from the database
export const getWalletByUserId = async (userId) => {
  return await prisma.wallet.findUnique({
    where: { userId },
    select: { id: true, userId: true, balance: true },
  });
};

// Update wallet balance and transaction history
export const updateWalletBalance = async (
  userId,
  amount,
  type = 'CREDIT',
  description,
  sessionId,
) => {
  return await prisma.$transaction(async (tx) => {
    if (sessionId) {
      const existing = await tx.walletTransaction.findUnique({
        where: { sessionId },
      });

      if (existing) {
        return null;
      }
    }

    const wallet = await tx.wallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type,
        description,
        sessionId,
      },
    });

    return wallet;
  });
};

// Fetch transaction information
export const getWalletTransaction = async (userId, limit = 5, cursor) => {
  const query = {
    where: { wallet: { userId } },
    orderBy: { id: 'desc' },
    take: limit,
    select: {
      id: true,
      amount: true,
      type: true,
      description: true,
      createdAt: true,
    },
  };

  if (cursor) {
    query.cursor = { id: cursor };
    query.skip = 1;
  }

  return await prisma.walletTransaction.findMany(query);
};

// Deduct fare from wallet balance and update ticket
export const payTicketFare = async (ticketId, userId, fares) => {
  return await prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.findUnique({
      where: { id: ticketId },
      include: {
        trip: { include: { route: true } },
      },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    if (ticket.commuterId !== userId) {
      throw new Error('Unauthorized ticket');
    }

    if (ticket.status !== 'PENDING') {
      throw new Error('Ticket already paid or cancelled');
    }

    const wallet = await tx.wallet.findUnique({
      where: { userId },
      select: { id: true, balance: true },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    if (wallet.balance < fares.totalFare) {
      throw new Error('Insufficient balance');
    }

    await tx.wallet.update({
      where: { userId },
      data: { balance: { decrement: fares.totalFare } },
    });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: fares.totalFare,
        type: 'DEBIT',
        description: `Ticket #${ticket.id}: ${ticket.boardingHalt.englishName} - ${ticket.destinationHalt.englishName} via Route ${ticket.trip.route.number}`,
        sessionId: `ticket-${ticket.id}-${Date.now()}`,
      },
    });

    const updatedTicket = await tx.ticket.update({
      where: { id: ticketId },
      data: {
        baseFare: fares.baseFare,
        totalFare: fares.totalFare,
        status: 'CONFIRMED',
        issuedAt: new Date(),
      },
    });

    return updatedTicket;
  });
};
