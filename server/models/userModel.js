import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

// Fetch a user by email from the database
export const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// Create a new user in the database
export const createUser = async ({ name, email, password }) => {
  return await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

// Fetch a user by ID from the database
export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
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
