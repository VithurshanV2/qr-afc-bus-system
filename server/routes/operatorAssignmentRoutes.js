import express from 'express';
import userAuth from '../middleware/userAuth.js';
import requireRole from '../middleware/requireRole.js';
import {
  activateOperatorAccount,
  deactivateOperatorAccount,
  searchOperator,
} from '../controllers/operatorAssignmentController.js';

const operatorAssignmentRouter = express.Router();

operatorAssignmentRouter.get(
  '/list',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY']),
  searchOperator,
);
operatorAssignmentRouter.post(
  '/activate/:operatorId',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY']),
  activateOperatorAccount,
);
operatorAssignmentRouter.post(
  '/deactivate/:operatorId',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY']),
  deactivateOperatorAccount,
);

export default operatorAssignmentRouter;
