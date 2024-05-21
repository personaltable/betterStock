import express from "express";
const router = express.Router();
import { getProducts } from "../controllers/productControllers.js";

router.get('/', getProducts);



export default router;