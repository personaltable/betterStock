import express from "express";
const router = express.Router();
import { getSales, registerSale } from "../controllers/saleCotrollers.js";

router.get("/", getSales);
router.post("/", registerSale);

export default router;
