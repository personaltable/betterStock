import express from "express";
const router = express.Router();
import {
  getClients,
  registerClient,
  deleteClients,
} from "../controllers/clientControllers.js";

router.get("/", getClients);
router.post("/", registerClient);
router.delete("/:id", deleteClients); // Rota para deletar cliente por ID

export default router;
