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
