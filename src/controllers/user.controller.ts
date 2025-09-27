import type { NextFunction, Request, Response } from "express";
import * as UserService from "@services/user.service.js";
import * as ErrorClasses from "@helpers/error/classes.js";

export const getAdminUsers = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await UserService.getUsers("admin");
    res.sendSuccessResponse("success", data);
  } catch (err) {
    next(err);
  }
};

export const getStudentUsers = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await UserService.getUsers("student");
    res.sendSuccessResponse("success", data);
  } catch (err) {
    next(err);
  }
};

export const getTeacherUsers = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await UserService.getUsers("teacher");
    res.sendSuccessResponse("success", data);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(Number(id));
    res.sendSuccessResponse("success", user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await UserService.createUser(name, email, password, role);
    res.sendContentCreatedResponse("User created", result);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const result = await UserService.updateUser(
      Number(id),
      name,
      email,
      password,
      role,
    );
    res.sendSuccessResponse("User updated", result);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await UserService.deleteUser(Number(id));
    res.sendSuccessResponse("User deleted", { id });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      const errors: Record<string, string> = {};
      if (!email) errors.email = "Email is required";
      if (!password) errors.password = "Password is required";
      if (!role) errors.role = "Role is required";

      throw new ErrorClasses.ValidationError(errors);
    }
    const result = await UserService.loginUser(email, password, role);
    res.sendSuccessResponse("Login successful", result);
  } catch (err) {
    next(err);
  }
};
