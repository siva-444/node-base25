import jwt, { type JwtPayload } from "jsonwebtoken";
import * as argon from "argon2";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // keep in .env
const JWT_EXPIRES_IN = "12h"; // 1 hour tokens

// Generate JWT
export const generateToken = (jwtPayload: JwtPayload) => {
  return jwt.sign(jwtPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Hash password before saving
export const hashPassword = async (password: string) => {
  return argon.hash(password);
};

// Compare login password
export const comparePassword = async (password: string, hash: string) => {
  return argon.verify(hash, password);
};
