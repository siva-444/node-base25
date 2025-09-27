import { Router } from "express";
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "@controllers/teacher.controller.js";
import { authenticate, authorize } from "@middlewares/auth.middleware.js";
const router = Router();

router.post("/", createTeacher);
router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);

export default router;
