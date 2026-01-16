import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  createUser,
  deleteActivationTokens,
  getUserByActivationToken,
  getUserByEmail,
  setUserPassword,
  updateIsFirstLogin,
} from '../models/userModel.js';
import { sendVerifyOtp } from './otpController.js';

// Email validation
const isEmailValid = (email) => {
  const regex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;
  return regex.test(email);
};

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

  if (!isEmailValid(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email address',
    });
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

    // Generate JWT token with user's ID and role
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );

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
        isAccountVerified: user.isAccountVerified,
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
  const { email, password, role } = req.body;

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

    if (role && user.role !== role) {
      return res
        .status(403)
        .json({ success: false, message: 'Invalid email or password' });
    }

    if (user.role === 'BUSOPERATOR' && !user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          'Your account has been deactivated. Please contact the transport authority for further clarification',
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

    // Generate JWT token with user's ID and role
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );

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

// Login for commuters
export const loginCommuter = async (req, res) => {
  try {
    req.body.role = 'COMMUTER';
    await login(req, res);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Login for bus operator
export const loginOperator = async (req, res) => {
  try {
    req.body.role = 'BUSOPERATOR';
    await login(req, res);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Login for Transport Authority (admin)
export const loginTransportAuthority = async (req, res) => {
  try {
    const { email } = req.body;

    if (email) {
      const user = await getUserByEmail(req.body.email);

      if (
        user &&
        user.role !== 'TRANSPORTAUTHORITY' &&
        user.role !== 'SUPERADMIN'
      ) {
        return res.status(403).json({
          success: false,
          message: 'Invalid email or password',
        });
      }
    }

    await login(req, res);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Activate account for bus operators and admins
export const activateAccount = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Token and password required' });
    }

    if (!isPasswordValid(password)) {
      return res.status(400).json({
        success: false,
        message:
          'Password must be at least 8 characters and include uppercase, lowercase, and a number',
      });
    }

    const tokenRecord = await getUserByActivationToken(token);

    if (!tokenRecord) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    if (tokenRecord.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'Expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await setUserPassword(tokenRecord.userId, hashedPassword);
    await deleteActivationTokens(tokenRecord.userId);

    return res.status(200).json({
      success: true,
      message: 'Account activated successfully',
      user: { role: tokenRecord.user.role },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
