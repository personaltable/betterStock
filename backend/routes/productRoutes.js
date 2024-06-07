import express from "express";
const router = express.Router();
import {
  getProducts,
  createProduct,
  getCategories,
  getCategoryById,
  deleteProduct,
  changeStock,
  changeStockTable
} from "../controllers/productControllers.js";

router.get("/", getProducts);
router.post("/", createProduct);
router.delete("/", deleteProduct);
router.put("/:id", changeStockTable);


router.put("/store/:id", changeStock);
router.get("/categories/:categoryId", getCategoryById);
router.get("/categories", getCategories);

export default router;
