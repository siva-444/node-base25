import type { Request, Response, NextFunction } from "express";
import * as QuizService from "@services/quiz.service.js";
import * as StudentService from "@services/student.service.js";

export const createQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await QuizService.createQuiz(
      req.body,
      req.tokenPayload.user_id,
    );
    res.sendContentCreatedResponse("Quiz created", result);
  } catch (err) {
    next(err);
  }
};

export const getQuizById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await QuizService.getQuizById(Number(id));
    res.sendSuccessResponse("success", result);
  } catch (err) {
    next(err);
  }
};

export const getAllQuizzes = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await QuizService.getAllQuizzes();
    res.sendSuccessResponse("success", result);
  } catch (err) {
    next(err);
  }
};

export const assignQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const quizId = Number(req.params.id);
    const { batch_year, department_id } = req.body;
    const { user_id: assigned_by } = req.tokenPayload;
    const result = await QuizService.assignQuiz(quizId, {
      batch_year,
      department_id,
      assigned_by,
    });
    res.sendSuccessResponse("Quiz assigned successfully", result);
  } catch (err) {
    next(err);
  }
};

export const assignQuizAdvanced = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const quizId = Number(req.params.id);
    const assigned_by = req.tokenPayload.user_id;
    const payload = { ...req.body, assigned_by };
    const result = await QuizService.assignQuizAdvanced(quizId, payload);
    res.sendSuccessResponse("Quiz assigned successfully", result);
  } catch (err) {
    next(err);
  }
};

export const updateQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const quizId = Number(req.params.id);
    const result = await QuizService.updateQuiz(quizId, req.body);
    res.sendSuccessResponse("Quiz updated", result);
  } catch (err) {
    next(err);
  }
};

export const deleteQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const quizId = Number(req.params.id);
    const result = await QuizService.deleteQuiz(quizId);
    res.sendSuccessResponse("Quiz deleted", result);
  } catch (err) {
    next(err);
  }
};

export const unassignQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const quizId = Number(req.params.id);
    const { studentId } = req.body;
    await QuizService.unassignQuiz(quizId, studentId);
    res.sendSuccessResponse("Quiz unassigned");
  } catch (err) {
    next(err);
  }
};

export const getQuizResults = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log(req.params);
    const {
      department_id = null,
      quiz_id = null,
      teacher_id = null,
    } = req.query;
    const result = await QuizService.getQuizResults({
      department_id: Number(department_id) || null,
      quiz_id: Number(quiz_id) || null,
      teacher_id: Number(teacher_id) || null,
    });
    res.sendSuccessResponse("Quiz results fetched", result);
  } catch (err) {
    next(err);
  }
};
