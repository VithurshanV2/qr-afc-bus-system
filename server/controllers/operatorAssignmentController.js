import { sendOperatorAccountActivation } from '../emails/index.js';
import {
  countOperator,
  getLinkedOperatorAccount,
  getOperatorList,
  setOperatorActiveStatus,
} from '../models/userModel.js';

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

// Operator account activation
export const activateOperatorAccount = async (req, res) => {
  try {
    const { operatorId } = req.params;

    const operator = await getLinkedOperatorAccount(Number(operatorId));

    if (!operator || !operator.user) {
      return res
        .status(404)
        .json({ success: false, message: 'Operator not found' });
    }

    if (operator.user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Operator account is already active',
      });
    }

    await setOperatorActiveStatus(operator.user.id, true);

    await sendOperatorAccountActivation({
      to: operator.user.email,
      name: operator.user.name,
    });

    return res.status(200).json({
      success: true,
      message: 'Operator account activated',
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
