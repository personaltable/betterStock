import express from "express";
const router = express.Router();
import { getProducts, createProduct, getCategories } from "../controllers/productControllers.js";

router.get('/', getProducts);
router.post('/', createProduct);
router.get('/categories', getCategories);


export default router;