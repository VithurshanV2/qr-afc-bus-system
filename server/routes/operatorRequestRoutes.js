import express from 'express';
import { submitOperatorRequest } from '../controllers/operatorRequestController.js';

const operatorRequestRouter = express.Router();

operatorRequestRouter.post('/', submitOperatorRequest);

export default operatorRequestRouter;
