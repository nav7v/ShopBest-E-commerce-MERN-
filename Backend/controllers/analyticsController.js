import Order from "../models/orderSchema.js";
import User from "../models/userSchema.js";
import Product from '../models/productSchema.js';


const getAdminStats = async (req, res) => {
    try { 
        const totalUsers = await User.countDocuments({ userType: "user" });
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});

        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + (Number(order.totalAmount) || 0), 0);

        res.status(200).json({ totalUsers, totalOrders, totalProducts, totalRevenue });
           
    }catch(error) { 
        res.status(500).json({ message: "Server error" });
        console.log(error);
    }   
}

export {getAdminStats};