import express from "express";
import { registerUser, loginUser, getUser } from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";
import admin from "../middlewares/adminMiddleware.js";
const userRouter = express.Router();    



userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

//route for admin only
userRouter.get("/users",protect, admin, getUser);

export default userRouter;