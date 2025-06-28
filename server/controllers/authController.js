import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  createUser,
  getUserByEmail,
  getUserById,
  resetPasswordUserAccount,
  updateResetOtp,
  updateVerifyOtp,
  verifyUserAccount,
} from '../models/userModel.js';
import {
  sendPasswordResetOtp,
  sendVerificationOtp,
  sendWelcomeEmail,
} from '../emails/index.js';

// Password policy
const isPasswordValid = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

// User registration
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing required fields' });
  }

  if (!isPasswordValid(password)) {
    return res.status(400).json({
      success: false,
      message:
        'Password must be at least 8 characters and include uppercase, lowercase, and a number',
    });
  }

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({ name, email, password: hashedPassword });

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

    // Sending welcome email
    await sendWelcomeEmail({ to: email, name, email });

    return res.status(201).json({
      success: true,
      message: 'User registered',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// User login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password fields required',
    });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

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

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// User logout
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged Out',
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Send verification OTP to the user's email
export const sendVerifyOtp = async (req, res) => {
  try {
    const id = req.userId;

    const user = await getUserById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: 'Account already verified' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day later

    await updateVerifyOtp(user.id, otp, expiry);

    await sendVerificationOtp({
      to: user.email,
      name: user.name,
      otp,
    });

    return res
      .status(200)
      .json({ success: true, message: 'Verification OTP sent to email' });
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

// Check if the user is authenticated
export const isAuthenticated = async (req, res) => {
  return res.status(200).json({ success: true });
};

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
