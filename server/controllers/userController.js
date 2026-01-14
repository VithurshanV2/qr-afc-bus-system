import { countConfirmedTickets, getUserById } from '../models/userModel.js';

export const getUserData = async (req, res) => {
  try {
    const id = req.userId;

    const user = await getUserById(id);

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        number: user.number,
        role: user.role,
        isAccountVerified: user.isAccountVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const getUserProfileStats = async (req, res) => {
  try {
    const id = req.userId;

    const user = await getUserById(id);

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const totalTrips = await countConfirmedTickets(id);

    return res.status(200).json({ success: true, user, totalTrips });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
