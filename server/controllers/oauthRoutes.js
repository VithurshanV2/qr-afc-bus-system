import jwt from 'jsonwebtoken';
import { updateIsFirstLogin } from '../models/userModel.js';

export const googleAuthCallback = async (req, res) => {
  const user = req.user;

  try {
    // Generate JWT token with user's ID
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Set the JWT token as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Check isFirstLogin
    if (user.isFirstLogin) {
      await updateIsFirstLogin(user.id, false);
      res.redirect(`${process.env.CLIENT_URL}/`);
    }

    return res.redirect(`${process.env.CLIENT_URL}/commuter/scan`);
  } catch (error) {
    console.error(error);
    return res.redirect(`${process.env.CLIENT_URL}/login`);
  }
};
