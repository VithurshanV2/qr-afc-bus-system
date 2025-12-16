import { findRouteByNumberBusType, insertRoute } from '../models/routeModel';
import { requireFields } from '../utils/validateRequest';

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
