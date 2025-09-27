import type { Request, Response, NextFunction } from "express";
import * as StudentService from "@services/student.service.js";
import * as ErrorClasses from "@helpers/error/classes.js";

export const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password, roll_number, department_id, batch_year } =
      req.body;
    const result = await StudentService.createStudent(
      name,
      email,
      password,
      roll_number,
      department_id,
      batch_year,
    );
    res.sendContentCreatedResponse("Student created", result);
  } catch (err) {
    next(err);
  }
};

export const getStudentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await StudentService.getStudentById(Number(id));
    res.sendSuccessResponse("success", result);
  } catch (err) {
    next(err);
  }
};

export const getAllStudents = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentService.getAllStudents();
    res.sendSuccessResponse("success", result);
  } catch (err) {
    next(err);
  }
};

export const updateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name, email, password, roll_number, department_id, batch_year } =
      req.body;
    const result = await StudentService.updateStudent(
      Number(id),
      name,
      email,
      password,
      roll_number,
      department_id,
      batch_year,
    );
    res.sendSuccessResponse("Student updated", result);
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await StudentService.deleteStudent(Number(id));
    res.sendSuccessResponse("Student deleted", { id });
  } catch (err) {
    next(err);
  }
};

export const getQuizDetailById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { quizId } = req.params;
    const result = await StudentService.getQuizDetailById(Number(quizId));
    res.sendSuccessResponse("success", result);
  } catch (err) {
    next(err);
  }
};
export const getStudentsQuizzes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.tokenPayload.user_id;
    const student = await StudentService.getStudentById(studentId);
    console.log({
      studentId: student.id,
      departmentId: student.department_id,
      batchYear: student.batch_year,
    });
    const result = await StudentService.getStudentsQuizzes({
      studentId: student.id,
      departmentId: student.department_id,
      batchYear: student.batch_year,
    });
    res.sendSuccessResponse("success", result);
  } catch (err) {
    next(err);
  }
};

export const submitStudentQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { quizId } = req.params;
    const { answers = [] } = req.body;
    const studentId = req.tokenPayload.user_id;
    if (answers?.length === 0)
      throw new ErrorClasses.ValidationError({
        answers: "Answers cannot be empty",
      });
    const result = await StudentService.submitStudentQuiz(
      studentId,
      Number(quizId),
      answers,
    );
    res.sendSuccessResponse("Quiz submitted successfully", result);
  } catch (err) {
    next(err);
  }
};

export const getStudentQuizResult = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { quizId } = req.params;
    const studentId = req.tokenPayload.user_id;
    const result = await StudentService.getStudentQuizResult(
      studentId,
      Number(quizId),
    );
    res.sendSuccessResponse("success", result);
  } catch (err) {
    next(err);
  }
};
