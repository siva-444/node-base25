import pool from "@config/db.js";
import * as UserService from "@services/user.service.js";
import type { RowDataPacket } from "mysql2";
import * as ErrorClasses from "@helpers/error/classes.js";
import { hashPassword } from "@src/utils/auth.js";
import * as DepartmentService from "./department.service.js";

export const getTeacherById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT u.id, u.name, u.email, u.role, t.department_id, d.name as department, t.phone FROM users u JOIN teacher_info t ON u.id = t.user_id JOIN departments d ON t.department_id = d.id WHERE u.id = ? AND u.role = 'teacher'`,
    [id],
  );
  if (!rows || rows.length === 0)
    throw new ErrorClasses.NotFoundError("Teacher not found", String(id));
  return rows[0];
};

export const getAllTeachers = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT u.id, u.name, u.email, u.role, t.department_id, d.name as department, t.phone FROM users u JOIN teacher_info t ON u.id = t.user_id JOIN departments d ON t.department_id = d.id WHERE u.role = 'teacher'`,
  );
  return rows;
};

export const createTeacher = async (
  name: string,
  email: string,
  password: string,
  department_id: number,
  phone: string,
) => {
  if (!name || !email || !password || !department_id || !phone)
    throw new ErrorClasses.ValidationError({
      fields: "Missing required fields",
    });

  const department = await DepartmentService.getDepartmentById(department_id);
  if (!department) {
    throw new ErrorClasses.ValidationError({
      department_id: "Invalid department ID",
    });
  }

  // Use user.service.ts to create user
  const user = await UserService.createUser(name, email, password, "teacher");

  // Create teacher_info
  await pool.execute(
    "INSERT INTO teacher_info (user_id, department_id, phone) VALUES (?, ?, ?)",
    [user.id, department_id, phone],
  );
  return {
    id: user.id,
    name,
    email,
    role: user.role,
    department_id,
    department: department.name,
    phone,
  };
};

export const updateTeacher = async (
  id: number,
  name?: string,
  email?: string,
  password?: string,
  department_id?: number,
  phone?: string,
) => {
  const teacher = await getTeacherById(id); // Reuse getTeacherById to check existence

  const user = await UserService.updateUser(id, name, email, password);
  await pool.execute(
    "UPDATE teacher_info SET department_id = ?, phone = ? WHERE user_id = ?",
    [department_id || teacher.department_id, phone || teacher.phone, id],
  );
  return {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
    department_id: department_id ?? teacher.department_id,
    department: teacher.department,
    phone: phone ?? teacher.phone,
  };
};

export const deleteTeacher = async (id: number) => {
  const [teacherRows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM teacher_info WHERE user_id = ?",
    [id],
  );
  if (!teacherRows || teacherRows.length === 0)
    throw new ErrorClasses.NotFoundError("Teacher info not found", String(id));

  // Delete teacher_info first
  await pool.execute("DELETE FROM teacher_info WHERE user_id = ?", [id]);
  // Delete user
  await UserService.deleteUser(id);

  return id;
};
