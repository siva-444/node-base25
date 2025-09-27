import systemRoutes from "./system.routes.js";
import quizRoutes from "./quiz.routes.js";
import userRoutes from "./user.routes.js";
import teacherRoutes from "./teacher.routes.js";
import studentRoutes from "./student.routes.js";
import departmentRoutes from "./department.routes.js";
import { authenticate, authorize } from "@middlewares/auth.middleware.js";
import type { Express } from "express";

export default (app: Express) => {
  app.use("/system", systemRoutes);
  app.use(
    "/quiz",
    authenticate,
    authorize(["admin", "teacher", "student"]),
    quizRoutes,
  );
  app.use("/user", userRoutes);
  app.use(
    "/teacher",
    authenticate,
    authorize(["admin", "teacher"]),
    teacherRoutes,
  );
  app.use(
    "/student",
    authenticate,
    authorize(["admin", "teacher", "student"]),
    studentRoutes,
  );
  app.use(
    "/department",
    authenticate,
    authorize(["admin", "teacher"]),
    departmentRoutes,
  );
};
