import { Router } from "express";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentsQuizzes,
  getQuizDetailById,
  submitStudentQuiz,
  getStudentQuizResult,
  getQuizResultDetail,
} from "@controllers/student.controller.js";
const router = Router();

router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

router.get("/:studentId/quiz/:quizId/result", getQuizResultDetail);

//Student quiz routes
router.get("/quizzes", getStudentsQuizzes);
router.get("/quizzes/:quizId", getQuizDetailById);
router.post("/quizzes/:quizId/submit", submitStudentQuiz);
router.get("/quizzes/:quizId/result", getStudentQuizResult);
router.get("/:id", getStudentById);
router.get("/", getAllStudents);

export default router;
