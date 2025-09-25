import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  createUser,
  getUserByEmail,
  resetPasswordUserAccount,
  updateIsFirstLogin,
  updateResetOtp,
} from '../models/userModel.js';
import { sendPasswordResetOtp } from '../emails/index.js';
import { sendVerifyOtp } from './otpController.js';

// Password policy
const isPasswordValid = (password) => {
  // Password must be at least 8 characters and include uppercase, lowercase, and a number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

// Phone number validation
const isPhoneNumberValid = (number) => {
  const regex = /^(?:0|94|\+94)?(7[0-8][0-9]{7})$/;
  return regex.test(number);
};

// User registration
export const register = async (req, res) => {
  const { name, email, number, password } = req.body;

  if (!name || !email || !number || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing required fields' });
  }

  if (!isPhoneNumberValid(number)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number',
    });
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

    const user = await createUser({
      name,
      email,
      number,
      password: hashedPassword,
    });

    let updateUser = user;

    if (user.isFirstLogin) {
      updateUser = await updateIsFirstLogin(user.id, false);
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

    await sendVerifyOtp({ userId: user.id });

    return res.status(201).json({
      success: true,
      message: 'User registered. Verification OTP sent to email',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isFirstLogin: updateUser.isFirstLogin,
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

    let updateUser = user;

    if (user.isFirstLogin) {
      updateUser = await updateIsFirstLogin(user.id, false);
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
        isFirstLogin: updateUser.isFirstLogin,
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
