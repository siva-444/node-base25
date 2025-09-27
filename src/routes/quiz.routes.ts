import { Router } from "express";
import {
  getAllQuizzes,
  createQuiz,
  getQuizById,
  assignQuiz,
  assignQuizAdvanced,
  updateQuiz,
  deleteQuiz,
  unassignQuiz,
} from "@controllers/quiz.controller.js";
import { authenticate, authorize } from "@middlewares/auth.middleware.js";

const router = Router();

// Quiz (Teacher/Admin)
router.get("/", getAllQuizzes);
router.post("/", createQuiz);
router.get("/:id", getQuizById);
router.post(
  "/:id/assign",
  authenticate,
  authorize(["admin", "teacher"]),
  assignQuiz,
);
router.post(
  "/:id/assign-advanced",
  authenticate,
  authorize(["admin", "teacher"]),
  assignQuizAdvanced,
);
router.put("/:id", updateQuiz);
router.delete(
  "/:id",
  authenticate,
  authorize(["admin", "teacher"]),
  deleteQuiz,
);
router.post(
  "/:id/unassign",
  authenticate,
  authorize(["admin", "teacher"]),
  unassignQuiz,
);

export default router;
