import { PrismaClient } from '../generated/prisma/index.js';

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
      createdBy: { select: { id: true, name: true, email: true } },
      updatedBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { updatedAt: 'desc' },
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
