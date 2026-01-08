import { getUserById } from '../models/userModel.js';

// Check if operator account is active or not
const checkOperatorActive = async (req, res, next) => {
  try {
    if (req.user.role !== 'BUSOPERATOR') {
      return next();
    }

    const user = await getUserById(req.userId);

    if (!user || !user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          'Your account has been deactivated. Please contact the transport authority for further clarification',
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export default checkOperatorActive;
