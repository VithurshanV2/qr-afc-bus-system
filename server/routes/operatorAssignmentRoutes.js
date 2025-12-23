import express from 'express';
import userAuth from '../middleware/userAuth.js';
import requireRole from '../middleware/requireRole.js';
import { searchOperator } from '../controllers/operatorAssignmentController.js';

const operatorAssignmentRouter = express.Router();

operatorAssignmentRouter.get(
  '/list',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY']),
  searchOperator,
);
