import { countOperator, getOperatorList } from '../models/userModel.js';

// Search operators
export const searchOperator = async (req, res) => {
  try {
    const { search = '', isActive, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const operators = await getOperatorList({
      search,
      isActive,
      skip,
      take,
    });
    const total = await countOperator({ search, isActive });

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      operators,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
