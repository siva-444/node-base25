import pool from "@config/db.js";
import { hashPassword, comparePassword, generateToken } from "@utils/auth.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { User } from "@src/types/index.js";
import * as ErrorClasses from "@helpers/error/classes.js";

export const getUsers = async (role: User["role"]) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, name, email, role FROM users WHERE role = ?",
    [role],
  );
  if (!rows || rows.length === 0)
    throw new ErrorClasses.NotFoundError(`No users found for role: ${role}`);
  return rows;
};

export const getUserById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [id],
  );
  if (!rows || rows.length === 0)
    throw new ErrorClasses.NotFoundError(`User not found`, String(id));
  return rows[0];
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: User["role"],
) => {
  if (!name || !email || !password || !role)
    throw new ErrorClasses.ValidationError({
      fields: "Missing required fields",
    });
  const hashed = await hashPassword(password);
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashed, role],
  );
  return { id: result.insertId, email, role, name };
};

export const updateUser = async (
  id: number,
  name?: string,
  email?: string,
  password?: string,
  role?: User["role"],
) => {
  if (id === 1)
    throw new ErrorClasses.ValidationError({
      message: "Cannot delete admin user",
    });
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE id = ?",
    [id],
  );
  const user = rows[0];
  if (!user) throw new ErrorClasses.NotFoundError("User not found", String(id));
  let hashed = user.password;
  if (password) {
    hashed = await hashPassword(password);
  }
  await pool.execute(
    "UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?",
    [name || user.name, email || user.email, hashed, role || user.role, id],
  );
  return {
    id,
    name: name ?? user.name,
    email: email || user.email,
    role: role || user.role,
  };
};

export const deleteUser = async (id: number) => {
  if (id === 1)
    throw new ErrorClasses.ValidationError({
      message: "Cannot delete admin user",
    });
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM users WHERE id = ?",
    [id],
  );
  const user = rows[0];
  if (!user) throw new ErrorClasses.NotFoundError("User not found", String(id));
  await pool.execute("DELETE FROM users WHERE id = ?", [id]);
  return true;
};

export const loginUser = async (
  email: string,
  password: string,
  role: User["role"],
) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ? and role = ?",
    [email, role],
  );
  if (!rows || rows.length === 0)
    throw new ErrorClasses.ValidationError({
      email: "Could not find the account",
    });

  const user = rows[0];
  console.log(email, password, role, user);
  const isValid = await comparePassword(password, user.password);
  if (!isValid)
    throw new ErrorClasses.ValidationError({ password: "Invalid password" });
  const token = generateToken({ user_id: user.id, role: user.role });
  return {
    token,
    role: user.role,
    name: user.name,
    id: user.id,
    email: user.email,
  };
};
