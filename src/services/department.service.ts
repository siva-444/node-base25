import pool from "@config/db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import * as ErrorClasses from "@helpers/error/classes.js";

export const createDepartment = async (name: string) => {
  if (!name) throw new ErrorClasses.ValidationError({ name: "Name required" });
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO departments (name) VALUES (?)",
    [name],
  );
  return { id: result.insertId, name };
};

export const getDepartmentById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, name FROM departments WHERE id = ?",
    [id],
  );
  if (!rows || rows.length === 0)
    throw new ErrorClasses.NotFoundError("Department not found", String(id));
  return rows[0];
};

export const getAllDepartments = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, name FROM departments ORDER BY id ASC",
  );
  return rows;
};

export const updateDepartment = async (id: number, name: string) => {
  if (!name) throw new ErrorClasses.ValidationError({ name: "Name required" });
  await pool.execute("UPDATE departments SET name = ? WHERE id = ?", [
    name,
    id,
  ]);
  return { id, name };
};

export const deleteDepartment = async (id: number) => {
  await pool.execute("DELETE FROM departments WHERE id = ?", [id]);
  return id;
};
