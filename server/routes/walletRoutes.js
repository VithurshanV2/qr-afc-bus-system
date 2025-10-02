import express from 'express';
import { getWallet, topUpWallet } from '../controllers/walletController.js';
import userAuth from '../middleware/userAuth.js';

const walletRouter = express.Router();

walletRouter.get('/', userAuth, getWallet);
walletRouter.post('/top-up', userAuth, topUpWallet);

export default walletRouter;
