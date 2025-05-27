import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

// Fetch a user by email from the database
export const getUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email }
    });
};

// Create a new user in the database
export const createUser = async ({ name, email, password }) => {
    return await prisma.user.create({
        data: {
            name, email, password
        },
        select: {
            id: true,
            name: true,
            email: true
        }
    });
};

// Fetch a user by ID from the database
export const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id }
    });
};

// Update OTP fields
export const updateVerifyOtp = async (id, otp, expiry) => {
    return await prisma.user.update({
        where: { id },
        data: {
            verifyOtp: otp,
            verifyOtpExpireAt: expiry
        }
    });
};