import Order from "../models/orderSchema.js";
import sendEmail from "../utils/sendEmail.js";

//TODOS:
//getOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder

//createOrder

const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;
    if (!items || items.length === 0 || !totalAmount || !address) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const normalizedItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity ?? item.qty,
      price: item.price,
    }));

    const normalizedAddress = {
      fullname: address.fullname || address.fullName,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
    };

    const order = new Order({
      user: req.user._id,
      items: normalizedItems,
      totalAmount,
      address: normalizedAddress,
      paymentId,
    });

    await order.save();
    const message = `Dear ${req.user.name},\n\nThanks for your order!\nOrder created successfully. Order ID: ${order._id}`;
    await sendEmail(req.user.email, "Order Confirmation", message);
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Error creating order", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "items.productId",
      "name price",
    );
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log(error);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const normalizedStatus = String(status || "").toLowerCase();
    const validStatuses = ["pending", "shipped", "delivered"];

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = normalizedStatus;
      await order.save();
      res
        .status(200)
        .json({ message: "Order status updated successfully", order });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { createOrder, getOrderById, getOrders, updateOrderStatus };
