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
) => {
  return await prisma.$transaction(async (prisma) => {
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
      },
    });

    return wallet;
  });
};

// Top up wallet via third party gateway
export const topUpWallet = async () => {};

// Deduct fare from the wallet balance
export const deductFare = async () => {};
