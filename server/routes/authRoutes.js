import express from 'express';
import { login, logout, register, sendVerifyOtp } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/sendVerifyOtp', sendVerifyOtp)

export default authRouter;