import express from "express";
const router = express.Router();

import { getActions, createAction } from "../controllers/actionsControllers.js";

router.get("/", getActions);
router.post("/", createAction);


export default router;