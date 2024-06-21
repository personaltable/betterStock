import express from "express";
const router = express.Router();
import {
  getClients,
  registerClient,
} from "../controllers/clientControllers.js";

router.get("/", getClients);
router.post("/", registerClient);

export default router;
