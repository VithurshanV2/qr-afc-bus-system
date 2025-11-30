import express from 'express';
import { submitOperatorRequest } from '../controllers/operatorRequestController.js';
import operatorDocsUpload from '../middleware/operatorDocsUpload.js';

const operatorRequestRouter = express.Router();

operatorRequestRouter.post(
  '/',
  operatorDocsUpload.fields([
    { name: 'permit', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
  ]),
  submitOperatorRequest,
);

export default operatorRequestRouter;
