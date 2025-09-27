import type { Request, Response, NextFunction } from "express";
import type { Role, User } from "@src/types/index.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // keep in .env

// Verify JWT middleware
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")?.[1];
  if (!token) return res.sendUnauthorizeResponse("Invalid token");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {
      return res.sendUnauthorizeResponse("Invalid token");
    }
    req.tokenPayload = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Role-based middleware
export const authorize = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.tokenPayload;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};
