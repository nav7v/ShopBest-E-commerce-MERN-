import express from 'express';  
import {createdOrder,verifyPayment} from '../controllers/paymentController.js';
const paymentRouter = express.Router()

paymentRouter.post('/orders', createdOrder);
paymentRouter.post('/verify', verifyPayment);

export default paymentRouter;
