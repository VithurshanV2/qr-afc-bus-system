import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

// Fetch a user by email from the database
export const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      isActive: true,
      verifyOtp: true,
      verifyOtpExpireAt: true,
      resetOtp: true,
      resetOtpExpireAt: true,
      isAccountVerified: true,
      isFirstLogin: true,
    },
  });
};

// Create a new user in the database
export const createUser = async ({ name, email, number, password }) => {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      number,
      password,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isAccountVerified: true,
      isFirstLogin: true,
    },
  });

  // Create wallet for the new user
  await prisma.wallet.create({
    data: { userId: user.id },
  });

  return user;
};

// Fetch a user by ID from the database
export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      isActive: true,
      verifyOtp: true,
      verifyOtpExpireAt: true,
      resetOtp: true,
      resetOtpExpireAt: true,
      isAccountVerified: true,
      isFirstLogin: true,
    },
  });
};

// Update OTP fields for account verification
export const updateVerifyOtp = async (id, otp, expiry) => {
  return await prisma.user.update({
    where: { id },
    data: {
      verifyOtp: otp,
      verifyOtpExpireAt: expiry,
    },
  });
};

// Verify user account via OTP
export const verifyUserAccount = async (id) => {
  return await prisma.user.update({
    where: { id },
    data: {
      isAccountVerified: true,
      verifyOtp: null,
      verifyOtpExpireAt: null,
    },
  });
};

// Update OTP fields for reset password
export const updateResetOtp = async (email, otp, expiry) => {
  return await prisma.user.update({
    where: { email },
    data: {
      resetOtp: otp,
      resetOtpExpireAt: expiry,
    },
  });
};

// Reset password via OTP
export const resetPasswordUserAccount = async (email, newPassword) => {
  return await prisma.user.update({
    where: { email },
    data: {
      password: newPassword,
      resetOtp: null,
      resetOtpExpireAt: null,
    },
  });
};

// Find or create a user using Google OAuth profile
export const findOrCreateUserByGoogleId = async (profile) => {
  const { id: googleId, displayName, emails } = profile;
  const email = emails?.[0].value;

  if (!email) {
    throw new Error('No email found in Google profile');
  }

  let user = await prisma.user.findFirst({
    where: {
      OR: [{ googleId }, { email }],
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: displayName,
        email,
        googleId,
        isAccountVerified: true,
        role: 'COMMUTER',
        isFirstLogin: true,
      },
    });

    // Create wallet for Google user
    await prisma.wallet.create({
      data: { userId: user.id },
    });
  }
  return user;
};

// Update first time login status
export const updateIsFirstLogin = async (id, isFirstLogin) => {
  return await prisma.user.update({
    where: { id },
    data: { isFirstLogin },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isFirstLogin: true,
    },
  });
};

// Fetch bus operator by activation token
export const getOperatorByActivationToken = async (token) => {
  return await prisma.accountActivationToken.findUnique({
    where: { token },
    include: { user: true },
  });
};

// Activate bus operator account and set password
export const setOperatorPassword = async (userId, hashedPassword) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword, isAccountVerified: true },
  });
};

// Delete activation token
export const deleteActivationTokens = async (userId) => {
  return await prisma.accountActivationToken.deleteMany({
    where: { userId },
  });
};

// Fetch operators with assigned and unassigned routes
export const getOperatorList = async ({
  search = '',
  isActive,
  skip = 0,
  take = 10,
}) => {
  return await prisma.user.findMany({
    where: {
      role: 'BUSOPERATOR',
      AND: [
        isActive !== undefined ? { isActive } : {},
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
      ],
    },
    include: {
      BusOperator: { include: { Bus: { include: { route: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });
};

export const countOperator = async ({ search = '', isActive }) => {
  return await prisma.user.count({
    where: {
      role: 'BUSOPERATOR',
      AND: [
        isActive !== undefined ? { isActive } : {},
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
      ],
    },
  });
};

// Activate and Deactivate operator account
export const setOperatorActiveStatus = async (userId, isActive) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: { id: true, name: true, email: true, isActive: true },
  });
};

// Fetch operator to get linked userId
export const getLinkedOperatorAccount = async (userId) => {
  return await prisma.busOperator.findUnique({
    where: { userId },
    select: {
      user: { select: { id: true, name: true, email: true, isActive: true } },
    },
  });
};
