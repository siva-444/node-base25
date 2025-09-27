import type { Request, Response, NextFunction } from "express";
import * as DepartmentService from "@services/department.service.js";
import * as ErrorClasses from "@helpers/error/classes.js";

export const createDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;
    const result = await DepartmentService.createDepartment(name);
    res.sendContentCreatedResponse("Department created", result);
  } catch (err) {
    next(err);
  }
};

export const getDepartmentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await DepartmentService.getDepartmentById(Number(id));
    res.sendSuccessResponse("success", result);
  } catch (err) {
    next(err);
  }
};

export const getAllDepartments = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await DepartmentService.getAllDepartments();
    res.sendSuccessResponse("success", result);
  } catch (err) {
    next(err);
  }
};

export const updateDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const result = await DepartmentService.updateDepartment(Number(id), name);
    res.sendSuccessResponse("Department updated", result);
  } catch (err) {
    next(err);
  }
};

export const deleteDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await DepartmentService.deleteDepartment(Number(id));
    res.sendSuccessResponse("Department deleted", { id });
  } catch (err) {
    next(err);
  }
};
