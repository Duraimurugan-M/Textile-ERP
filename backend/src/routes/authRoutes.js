import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkPermission from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  authMiddleware,
  checkPermission("settings", "manageUsers"),
  registerUser
);

router.post("/login", loginUser);



export default router;
