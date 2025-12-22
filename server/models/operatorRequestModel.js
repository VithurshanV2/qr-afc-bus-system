import { PrismaClient } from '../generated/prisma/index.js';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Create new bus operator request
export const createOperatorRequest = async ({
  name,
  nic,
  email,
  number,
  address,
  buses,
  uploadedDocs,
}) => {
  return await prisma.busOperatorRequest.create({
    data: {
      name,
      nic,
      email,
      number,
      address,
      buses,
      uploadedDocs,
      status: 'PENDING',
    },
  });
};

// Check for existing pending request for certain email
export const existingRequestByEmail = async (email) => {
  return await prisma.busOperatorRequest.findFirst({
    where: { email, status: 'PENDING' },
  });
};

// Check for duplicate registration number of buses
export const existingRegisteredBus = async (registrationNumbers) => {
  return await prisma.bus.findMany({
    where: {
      registrationNumber: { in: registrationNumbers },
    },
    select: { registrationNumber: true },
  });
};

// Fetch operator account requests list
export const getOperatorRequestList = async ({
  search = '',
  status,
  skip = 0,
  take = 10,
}) => {
  return await prisma.busOperatorRequest.findMany({
    where: {
      AND: [
        status ? { status } : {},
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { nic: { contains: search, mode: 'insensitive' } },
          ],
        },
      ],
    },
    include: {
      reviewedBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });
};

export const countOperatorRequests = async ({ search = '', status }) => {
  return await prisma.busOperatorRequest.count({
    where: {
      AND: [
        status ? { status } : {},
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { nic: { contains: search, mode: 'insensitive' } },
          ],
        },
      ],
    },
  });
};

export const getOperatorRequestById = async (id) => {
  return await prisma.busOperatorRequest.findUnique({
    where: { id },
  });
};

// Approve request
export const approveRequest = async ({
  requestId,
  remarks = null,
  reviewerId,
}) => {
  return await prisma.busOperatorRequest.update({
    where: { id: requestId },
    data: {
      status: 'APPROVED',
      remarks,
      reviewedById: reviewerId,
      reviewedAt: new Date(),
    },
  });
};

// Create activation token
export const createActivationToken = async ({ userId, token, expiresAt }) => {
  return await prisma.accountActivationToken.create({
    data: { userId, token, expiresAt },
  });
};

// Create bus operator user account
export const createUser = async ({ name, email, role }) => {
  return await prisma.user.create({
    data: { name, email, role, isAccountVerified: false },
  });
};

// Create a new BusOperator linked to a user
export const createBusOperator = async ({ userId }) => {
  return await prisma.busOperator.create({ data: { userId } });
};

// Add buses for bus operator
export const createBusesForOperator = async ({ operatorId, buses }) => {
  return await Promise.all(
    buses.map((bus) =>
      prisma.bus.create({
        data: {
          registrationNumber: bus.registrationNumber.toUpperCase(),
          operatorId,
          qrCode: uuidv4(),
        },
      }),
    ),
  );
};

// Reject request
export const rejectRequest = async ({
  requestId,
  remarks = null,
  reviewerId,
}) => {
  return await prisma.busOperatorRequest.update({
    where: { id: requestId },
    data: {
      status: 'REJECTED',
      remarks,
      reviewedById: reviewerId,
      reviewedAt: new Date(),
    },
  });
};

// Fetch approved operator with user linked
export const getApprovedRequestUser = async ({ requestId }) => {
  return await prisma.busOperatorRequest.findFirst({
    where: { id: requestId, status: 'APPROVED' },
    include: {
      reviewedBy: true,
    },
  });
};

// Find the approved user by email
export const getApprovedUserByEmail = async ({ email }) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// Delete existing activation token
export const deleteActivationToken = async ({ userId }) => {
  return await prisma.accountActivationToken.deleteMany({
    where: { id: userId },
  });
};
