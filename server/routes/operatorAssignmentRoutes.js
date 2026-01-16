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
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  searchOperator,
);
operatorAssignmentRouter.post(
  '/activate/:operatorId',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  activateOperatorAccount,
);
operatorAssignmentRouter.post(
  '/deactivate/:operatorId',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  deactivateOperatorAccount,
);
operatorAssignmentRouter.get(
  '/assignable-routes',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  fetchRoutesDropdown,
);
operatorAssignmentRouter.post(
  '/assign-route',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  assignRoute,
);
operatorAssignmentRouter.post(
  '/reassign-route',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  reassignRoute,
);

export default operatorAssignmentRouter;
