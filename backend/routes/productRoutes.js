import express from "express";
const router = express.Router();
import { getProducts, createProduct } from "../controllers/productControllers.js";

router.get('/', getProducts);
router.post('/', createProduct);



export default router;