import express from 'express';
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
  verifyResetOtp,
} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';
import { authLimiter, otpLimiter } from '../middleware/rateLimiter.js';

const authRouter = express.Router();

authRouter.post('/register', authLimiter, register);
authRouter.post('/login', authLimiter, login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, otpLimiter, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, otpLimiter, verifyEmail);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', otpLimiter, sendResetOtp);
authRouter.post('/verify-reset-otp', otpLimiter, verifyResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;
