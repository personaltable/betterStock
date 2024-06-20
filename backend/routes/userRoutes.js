import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

router.get("/", getUsers);
router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.put("/update", updateUser);
router.delete("/:id", deleteUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
