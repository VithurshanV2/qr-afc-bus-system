import bcrypt from 'bcryptjs';
import { sendPasswordResetOtp } from '../emails/index.js';
import {
  getUserByEmail,
  resetPasswordUserAccount,
  updateResetOtp,
} from '../models/userModel.js';

// Send OTP to user's email for password reset
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: 'Email is required' });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await updateResetOtp(email, otp, expiry);

    await sendPasswordResetOtp({
      to: user.email,
      name: user.name,
      otp,
    });

    return res
      .status(200)
      .json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Verify OTP for reset password
export const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Missing details',
    });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    if (user.resetOtp === '' || user.resetOtp !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    if (user.resetOtpExpireAt < new Date()) {
      return res.status(403).json({ success: false, message: 'OTP expired' });
    }

    return res.status(200).json({ success: true, message: 'OTP verified' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Password policy
const isPasswordValid = (password) => {
  // Password must be at least 8 characters and include uppercase, lowercase, and a number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

// Reset user password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required' });
  }

  if (!isPasswordValid(newPassword)) {
    return res.status(400).json({
      success: false,
      message:
        'Password must be at least 8 characters and include uppercase, lowercase, and a number',
    });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    if (user.resetOtp === '' || user.resetOtp !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    if (user.resetOtpExpireAt < new Date()) {
      return res.status(403).json({ success: false, message: 'OTP expired' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await resetPasswordUserAccount(email, hashedPassword);

    return res.status(200).json({
      success: true,
      message: 'Your password has been reset successfully',
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
