import express from 'express';
import {
  approveOperatorRequest,
  rejectOperatorRequest,
  resendActivationLink,
  searchOperatorRequests,
  submitOperatorRequest,
} from '../controllers/operatorRequestController.js';
import operatorDocsUpload from '../middleware/operatorDocsUpload.js';
import userAuth from '../middleware/userAuth.js';
import requireRole from '../middleware/requireRole.js';

const operatorRequestRouter = express.Router();

operatorRequestRouter.post(
  '/',
  operatorDocsUpload.fields([
    { name: 'permit', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
  ]),
  submitOperatorRequest,
);
operatorRequestRouter.get(
  '/list',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  searchOperatorRequests,
);
operatorRequestRouter.post(
  '/approve',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  approveOperatorRequest,
);
operatorRequestRouter.post(
  '/reject',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  rejectOperatorRequest,
);
operatorRequestRouter.post(
  '/resend-activation',
  userAuth,
  requireRole(['TRANSPORTAUTHORITY', 'SUPERADMIN']),
  resendActivationLink,
);

export default operatorRequestRouter;
