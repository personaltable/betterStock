import express from "express";
const router = express.Router();
import { getProducts, createProduct, getCategories, deleteProduct } from "../controllers/productControllers.js";

router.get('/', getProducts);
router.post('/', createProduct);
router.delete('/', deleteProduct)
router.get('/categories', getCategories);


export default router;