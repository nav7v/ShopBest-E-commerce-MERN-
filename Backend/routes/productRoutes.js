import express from "express";
import protect from "../middlewares/authMiddleware.js";
import admin from "../middlewares/adminMiddleware.js";
import {getProducts, getProductById, createProduct, updateProduct, deleteProduct} from "../controllers/productController.js";
import multer from "multer";
const upload=multer({dest:'uploads/'});
  
const productRouter = express.Router(); 
//all products without sign up
productRouter.route('/').get(getProducts).post(protect, admin, upload.single('image'), createProduct);
//specific product
productRouter.route('/:id').get(getProductById).put(protect, admin, upload.single('image'), updateProduct).delete(protect, admin, deleteProduct);


export default productRouter;