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
  return await prisma.$transaction(async (prisma) => {
    if (sessionId) {
      const existing = await prisma.walletTransaction.findUnique({
        where: { sessionId },
      });

      if (existing) {
        return null;
      }
    }

    const wallet = await prisma.wallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    });

    await prisma.walletTransaction.create({
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
