import {
  activateRoute,
  countRoutes,
  findRouteByNumberBusType,
  getRouteById,
  getRouteHalts,
  getRoutesList,
  inactivateRoute,
  insertRoute,
  softDeleteRoute,
  updateRoute,
} from '../models/routeModel.js';
import { requireFields } from '../utils/validateRequest.js';

// Create a new route as draft
export const createRoute = async (req, res) => {
  try {
    const userId = req.userId;
    const { number, name, busType, haltsA, haltsB } = req.body;

    if (
      !requireFields(res, { number, name, busType }, [
        'number',
        'name',
        'busType',
      ])
    ) {
      return;
    }

    const existingRoute = await findRouteByNumberBusType(number, busType);

    if (existingRoute) {
      return res.status(400).json({
        success: false,
        message: 'Route already exists for this route number and bus type',
      });
    }

    const route = await insertRoute({
      number,
      name,
      busType,
      haltsA: haltsA || [],
      haltsB: haltsB || [],
      createdById: userId,
    });

    return res
      .status(200)
      .json({ success: true, message: 'Route created as draft', route });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Update existing route
export const updateRouteController = async (req, res) => {
  try {
    const userId = req.userId;
    const { routeId } = req.params;
    const { number, busType, name, haltsA, haltsB, status } = req.body;

    if (!requireFields(res, { routeId }, ['routeId'])) {
      return;
    }

    const route = await getRouteById(Number(routeId));

    if (!route) {
      return req
        .status(404)
        .json({ success: false, message: 'Route not found' });
    }

    if (route.status === 'DELETED') {
      return req
        .status(400)
        .json({ success: false, message: 'Cannot modify a deleted route' });
    }

    // Check duplicate if route number or bus type is changed
    if (
      (number && number !== route.number) ||
      (busType && busType !== route.busType)
    ) {
      const existingRoute = await findRouteByNumberBusType(number, busType);

      if (existingRoute && existingRoute.id !== route.id) {
        return res.status(400).json({
          success: false,
          message: 'Route already exists for this route number and bus type',
        });
      }
    }

    if (
      route.status === 'ACTIVE' &&
      (number !== undefined || busType !== undefined)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change route number or bus type after activation',
      });
    }

    if (
      route.status === 'ACTIVE' &&
      (haltsA !== undefined || haltsB !== undefined)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify halts after activation',
      });
    }

    // Prepare data object for partial update
    const updateData = {};

    if (number !== undefined) updateData.number = number;
    if (busType !== undefined) updateData.busType = busType;
    if (name !== undefined) updateData.name = name;
    if (haltsA !== undefined) updateData.haltsA = haltsA;
    if (haltsB !== undefined) updateData.haltsB = haltsB;
    if (status !== undefined) updateData.status = status;
    updateData.updatedById = userId;

    if (status === 'ACTIVE') {
      if (route.status !== 'DRAFT') {
        return res.status(400).json({
          success: false,
          message: 'Only draft routes can be activated',
        });
      }
    }

    if (!haltsA || haltsA.length === 0 || !haltsB || haltsB.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot active route without halt data for both directions',
      });
    }

    const updatedRoute = await updateRoute({
      routeId: Number(routeId),
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: 'Route updated successfully',
      route: updatedRoute,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Search routes
export const searchRoutes = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const routes = await getRoutesList({ search, skip, take });
    const total = await countRoutes({ search });

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      routes,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Soft delete route
export const deleteRoute = async (req, res) => {
  try {
    const userId = req.userId;
    const { routeId } = req.params;

    const route = await getRouteById(Number(routeId));

    if (!route) {
      return res
        .status(404)
        .json({ success: false, message: 'Route not found' });
    }

    if (route.status === 'DELETED') {
      return res
        .status(400)
        .json({ success: false, message: 'Route already deleted' });
    }

    await softDeleteRoute({ routeId, userId });

    return res
      .status(200)
      .json({ success: true, message: 'Route deleted successfully' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Get halts of a route
export const fetchRouteHalts = async (req, res) => {
  try {
    const { routeId } = req.params;

    const route = await getRouteHalts(Number(routeId));

    if (!route) {
      return res
        .status(404)
        .json({ success: false, message: 'Route not found' });
    }

    return res.status(200).json({ success: true, route });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Set route to inactive
export const inactivateRouteController = async (req, res) => {
  try {
    const { routeId } = req.params;
    const userId = req.userId;

    const route = await getRouteById(Number(routeId));

    if (!route) {
      return res
        .status(404)
        .json({ success: false, message: 'Route not found' });
    }

    if (route.status !== 'ACTIVE') {
      return res.status(404).json({
        success: false,
        message: 'Only active routes can be set to inactive',
      });
    }

    const updatedRoute = await inactivateRoute({
      routeId: Number(routeId),
      userId,
    });

    return res.status(200).json({
      success: true,
      message: 'Route set to inactive successfully',
      route: updatedRoute,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Set route to active
export const activateRouteController = async (req, res) => {
  try {
    const { routeId } = req.params;
    const userId = req.userId;

    const route = await getRouteById(Number(routeId));

    if (!route) {
      return res
        .status(404)
        .json({ success: false, message: 'Route not found' });
    }

    if (route.status === 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'Route is already active',
      });
    }

    if (route.status === 'DELETED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot activate a deleted route',
      });
    }

    if (
      !route.haltsA ||
      route.haltsA.length === 0 ||
      !route.haltsB ||
      route.haltsB.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Cannot active route without halt data for both directions',
      });
    }

    const updatedRoute = await activateRoute({
      routeId: Number(routeId),
      userId,
    });

    return res.status(200).json({
      success: true,
      message: 'Route activated successfully',
      route: updatedRoute,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
