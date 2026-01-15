import express from 'express';
import userAuth from '../middleware/userAuth.js';
import requireRole from '../middleware/requireRole.js';
import { createAdminAccountController } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.post(
  '/create',
  userAuth,
  requireRole(['SUPERADMIN']),
  createAdminAccountController,
);

export default adminRouter;
