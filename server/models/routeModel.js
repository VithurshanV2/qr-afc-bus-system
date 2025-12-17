import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

// Fetch route by ID
export const getRouteById = async (routeId) => {
  return await prisma.route.findUnique({
    where: { id: routeId },
  });
};

// Check if route already exists
export const findRouteByNumberBusType = async (number, busType) => {
  return await prisma.route.findUnique({
    where: {
      number_busType: {
        number,
        busType,
      },
    },
  });
};

// Create new route as draft
export const insertRoute = async ({
  number,
  name,
  busType,
  haltsA,
  haltsB,
  createdById,
}) => {
  return await prisma.route.create({
    data: {
      number,
      name,
      busType,
      haltsA,
      haltsB,
      createdById,
      status: 'DRAFT',
    },
  });
};

// Update existing route
export const updateRoute = async ({ routeId, data }) => {
  return await prisma.route.update({
    where: { id: routeId },
    data,
  });
};

// Fetch routes for search
export const getRoutesList = async ({ search = '', skip = 0, take = 10 }) => {
  return await prisma.route.findMany({
    where: {
      OR: [
        { number: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
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

export const countRoutes = async ({ search = '' }) => {
  return await prisma.route.count({
    where: {
      OR: [
        { number: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ],
    },
  });
};

// Soft delete route
export const softDeleteRoute = async ({ routeId, userId }) => {
  return await prisma.route.update({
    where: { id: routeId },
    data: {
      status: 'DELETED',
      updatedById: userId,
    },
  });
};

// Fetch halts of a route by ID
export const getRouteHalts = async (routeId) => {
  return await prisma.route.findUnique({
    where: { id: routeId },
    select: {
      id: true,
      number: true,
      name: true,
      haltsA: true,
      haltsB: true,
    },
  });
};

// Set route to inactive
export const inactivateRoute = async ({ routeId, userId }) => {
  return await prisma.route.update({
    where: { id: routeId },
    data: {
      status: 'INACTIVE',
      updatedById: userId,
    },
  });
};

// Activate route
export const activateRoute = async ({ routeId, userId }) => {
  return await prisma.route.update({
    where: { id: routeId },
    data: {
      status: 'ACTIVE',
      updatedById: userId,
    },
  });
};
