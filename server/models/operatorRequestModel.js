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
      user: { select: { id: true, isAccountVerified: true } },
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
export const createUser = async ({ name, email, number, role }) => {
  return await prisma.user.create({
    data: { name, email, number, role, isAccountVerified: false },
  });
};

// Link BusOperatorRequest to the created user
export const linkRequestToUser = async ({ requestId, userId }) => {
  return await prisma.busOperatorRequest.update({
    where: { id: requestId },
    data: { userId },
  });
};

// Create a new BusOperator linked to a user
export const createBusOperator = async ({ userId, nic, address }) => {
  return await prisma.busOperator.create({ data: { userId, nic, address } });
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
          requestedRouteName: bus.routeName,
          requestedRouteNumber: bus.routeNumber,
          requestedBusType: bus.busType,
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
export const getApprovedRequestUser = async (requestId) => {
  return await prisma.busOperatorRequest.findFirst({
    where: { id: requestId, status: 'APPROVED' },
    include: {
      user: {
        select: { id: true, isAccountVerified: true, email: true, name: true },
      },
    },
  });
};

// Delete existing activation token
export const deleteActivationToken = async ({ userId }) => {
  return await prisma.accountActivationToken.deleteMany({
    where: { userId },
  });
};
