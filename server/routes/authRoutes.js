import express from 'express';
import {
  activateOperatorAccount,
  isAuthenticated,
  loginCommuter,
  loginOperator,
  loginTransportAuthority,
  logout,
  register,
} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';
import {
  authLimiter,
  otpLimiter,
  resendOtpLimiter,
} from '../middleware/rateLimiter.js';
import {
  resendVerifyOtp,
  sendVerifyOtp,
  verifyEmail,
} from '../controllers/otpController.js';
import {
  resetPassword,
  sendResetOtp,
  verifyResetOtp,
} from '../controllers/passwordController.js';

const authRouter = express.Router();

authRouter.post('/register', authLimiter, register);

// Role specific logins
authRouter.post('/login', authLimiter, loginCommuter);
authRouter.post('/login-bus-operator', authLimiter, loginOperator);
authRouter.post('/login-admin', authLimiter, loginTransportAuthority);

authRouter.post('/logout', logout);

// Verification OTP
authRouter.post('/send-verify-otp', userAuth, otpLimiter, sendVerifyOtp);
authRouter.post(
  '/resend-verify-otp',
  userAuth,
  resendOtpLimiter,
  resendVerifyOtp,
);
authRouter.post('/verify-account', userAuth, otpLimiter, verifyEmail);

// Password reset OTP
authRouter.post('/send-reset-otp', otpLimiter, sendResetOtp);
authRouter.post('/verify-reset-otp', otpLimiter, verifyResetOtp);
authRouter.post('/reset-password', resetPassword);

authRouter.get('/is-auth', userAuth, isAuthenticated);

// Account activation bus operator
authRouter.post('/activate-operator', authLimiter, activateOperatorAccount);

export default authRouter;
