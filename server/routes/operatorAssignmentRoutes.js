import express from 'express';
import userAuth from '../middleware/userAuth.js';
import requireRole from '../middleware/requireRole.js';
import {
  activateOperatorAccount,
  assignRoute,
  deactivateOperatorAccount,
  fetchRoutesDropdown,
  reassignRoute,
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
operatorAssignmentRouter.get(
  '/assignable-routes',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY']),
  fetchRoutesDropdown,
);
operatorAssignmentRouter.post(
  '/assign-route',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY']),
  assignRoute,
);
operatorAssignmentRouter.post(
  '/reassign-route',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY']),
  reassignRoute,
);

export default operatorAssignmentRouter;
