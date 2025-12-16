import {
  countRoutes,
  findRouteByNumberBusType,
  getRouteById,
  getRoutesList,
  insertRoute,
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

    const route = await getRouteById(routeId);

    if (!route) {
      return req
        .status(404)
        .json({ success: false, message: 'Route not found' });
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

    // Prepare data object for partial update
    const updateData = {};

    if (number !== undefined) updateData.number = number;
    if (busType !== undefined) updateData.busType = busType;
    if (name !== undefined) updateData.name = name;
    if (haltsA !== undefined) updateData.haltsA = haltsA;
    if (haltsB !== undefined) updateData.haltsB = haltsB;
    if (status !== undefined) updateData.status = status;
    updateData.updatedById = userId;

    if (
      status === 'ACTIVE' &&
      (!haltsA || haltsA.length === 0) &&
      (!haltsB || haltsB.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Cannot active route without halt data for both direction',
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
