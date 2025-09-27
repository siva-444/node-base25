import type { Request, Response, NextFunction } from "express";
import * as TeacherService from "@services/teacher.service.js";
import * as ErrorClasses from "@helpers/error/classes.js";

export const createTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password, department_id, phone } = req.body;
    const result = await TeacherService.createTeacher(
      name,
      email,
      password,
      department_id,
      phone,
    );
    res.sendContentCreatedResponse("Teacher created", result);
  } catch (err) {
    next(err);
  }
};

export const getTeacherById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await TeacherService.getTeacherById(Number(id));
    res.sendSuccessResponse("success", result);
  } catch (err) {
    next(err);
  }
};

export const getAllTeachers = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await TeacherService.getAllTeachers();
    res.sendSuccessResponse("success", result);
  } catch (err) {
    next(err);
  }
};

export const updateTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name, email, password, department_id, phone } = req.body;
    const result = await TeacherService.updateTeacher(
      Number(id),
      name,
      email,
      password,
      department_id,
      phone,
    );
    res.sendSuccessResponse("Teacher updated", result);
  } catch (err) {
    next(err);
  }
};

export const deleteTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await TeacherService.deleteTeacher(Number(id));
    res.sendSuccessResponse("Teacher deleted", { id });
  } catch (err) {
    next(err);
  }
};
