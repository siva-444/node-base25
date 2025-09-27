import { Router } from "express";
import {
  createUser,
  loginUser,
  getAdminUsers,
  updateUser,
  deleteUser,
  getUserById,
} from "@controllers/user.controller.js";
import { authenticate, authorize } from "@middlewares/auth.middleware.js";
const router = Router();

router.post("/login", loginUser);
// Admin only → create Teacher/Student
router.get("/", authenticate, authorize(["admin"]), getAdminUsers);
router.get("/:id", authenticate, authorize(["admin"]), getUserById);
router.post("/", authenticate, authorize(["admin"]), createUser);
router.put("/:id", authenticate, authorize(["admin"]), updateUser);
router.delete("/:id", authenticate, authorize(["admin"]), deleteUser);

export default router;
