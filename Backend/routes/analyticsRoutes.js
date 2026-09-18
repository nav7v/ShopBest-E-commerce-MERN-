import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import admin from '../middlewares/adminMiddleware.js';
import { getAdminStats } from '../controllers/analyticsController.js';
const adminRouter = express.Router();


adminRouter.get('/', protect,admin,getAdminStats);



export default adminRouter;