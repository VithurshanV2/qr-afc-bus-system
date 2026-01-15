import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

// Create admin account by superadmin
export const createAdminAccount = async ({ name, email, number }) => {
  return await prisma.user.create({
    data: {
      name,
      email,
      number,
      role: 'TRANSPORTAUTHORITY',
      isAccountVerified: false,
    },
  });
};

// Create activation token
export const createActivationToken = async ({ userId, token, expiresAt }) => {
  return await prisma.accountActivationToken.create({
    data: { userId, token, expiresAt },
  });
};

// Delete existing activation token
export const deleteActivationToken = async ({ userId }) => {
  return await prisma.accountActivationToken.deleteMany({
    where: { userId },
  });
};
