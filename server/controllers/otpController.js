import { sendVerificationOtp, sendWelcomeEmail } from '../emails/index.js';
import {
  getUserById,
  updateVerifyOtp,
  verifyUserAccount,
} from '../models/userModel.js';

// Send verification OTP to the user's email
export const sendVerifyOtp = async ({ userId }) => {
  const user = await getUserById(userId);

  if (!user || user.isAccountVerified) {
    return;
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day later

  await updateVerifyOtp(user.id, otp, expiry);

  await sendVerificationOtp({
    to: user.email,
    name: user.name,
    otp,
  });
};

// Resend verification OTP to the user's email
export const resendVerifyOtp = async (req, res) => {
  const id = req.userId;

  try {
    const user = await getUserById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: 'Account is already verified' });
    }

    await sendVerifyOtp({ userId: id });

    return res
      .status(200)
      .json({ success: true, message: 'Verification OTP resent to email' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Verify email using OTP
export const verifyEmail = async (req, res) => {
  const id = req.userId;
  const { otp } = req.body;

  if (!id || !otp) {
    return res.status(400).json({ success: false, message: 'Missing details' });
  }

  try {
    const user = await getUserById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    if (user.verifyOtp === '' || user.verifyOtp !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    if (user.verifyOtpExpireAt < new Date()) {
      return res.status(403).json({ success: false, message: 'OTP expired' });
    }

    await verifyUserAccount(id);

    // Sending welcome email
    await sendWelcomeEmail({
      to: user.email,
      name: user.name,
      email: user.email,
    });

    return res
      .status(200)
      .json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
