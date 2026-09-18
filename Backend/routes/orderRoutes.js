import express from "express";
import protect from "../middlewares/authMiddleware.js";
import admin from "../middlewares/adminMiddleware.js";
import { getOrders, getOrderById, createOrder, updateOrderStatus } from "../controllers/orderController.js";

const orderRouter = express.Router();

//if the user wants to order something they have to call the get method and if the admin wants to see all the orders in the dashboard they have to call the post method
orderRouter.route('/').get(protect, admin, getOrders).post(protect, createOrder);

//if the user wants to see the status of their order they have to call this route
orderRouter.route('/myOrders').get(protect, getOrderById);

//if the admin wants to update the status of the order they have to call this route
orderRouter.route('/:id/status').put(protect, admin, updateOrderStatus)

export default orderRouter;