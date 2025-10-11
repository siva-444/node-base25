import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import type { JSX } from "react";
import LoginPage from "@pages/Auth/LoginPage";

// Layouts
import AdminLayout from "@components/Layout/AdminLayout";
import TeacherLayout from "@components/Layout/TeacherLayout";
import StudentLayout from "@components/Layout/StudentLayout";

// Pages
import Quizzes from "@pages/Modules/Quizzes";
import CreateQuiz from "@pages/Modules/CreateQuiz";
import AssignQuiz from "@pages/Modules/AssignQuiz";
import Students from "@pages/Modules/Students";
import Results from "@pages/Modules/Results";
import QuizResultDetail from "@pages/Admin/QuizResultDetail";

import Teachers from "@pages/Admin/Teachers";
import Users from "@pages/Admin/Users";

import QuizSelection from "@pages/Student/QuizSelection";
import QuizScreen from "@pages/Student/QuizScreen";
import QuizResult from "@pages/Student/QuizResult";

import { useAppSelector, useAppDispatch } from "./store/hooks";
import { useEffect, useState } from "react";
import { setAuth } from "./store/authSlice";
import { CircularProgress, Box } from "@mui/joy";

function ProtectedRoute({
  role,
  children,
}: {
  role: string;
  children: JSX.Element;
}) {
  const userRole = useAppSelector((state) => state.auth.role);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("email");
    const storedName = localStorage.getItem("name");
    const storedId = localStorage.getItem("id");
    if (token && storedRole && !userRole) {
      dispatch(
        setAuth({
          token,
          role: storedRole as "admin" | "teacher" | "student",
          email: storedEmail!,
          name: storedName!,
          id: Number(storedId),
        }),
      );
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading)
    return (
      <Box
        width={"100vw"}
        height={"100vh"}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  if (userRole !== role) return <Navigate to="/login" replace />;
  return children;
}

const router = createBrowserRouter([
  { path: "/", index: true, element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> },

  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="users" replace /> },
      { path: "users", element: <Users /> },
      { path: "teachers", element: <Teachers /> },
      { path: "students", element: <Students /> },
      { path: "quizzes", element: <Quizzes /> },
      { path: "quizzes/add", element: <CreateQuiz /> },
      { path: "quizzes/:id/edit", element: <CreateQuiz /> },
      { path: "quizzes/:id/assign", element: <AssignQuiz /> },
      { path: "results", element: <Results /> },
      { path: "quizzes/:id/results/:studentId", element: <QuizResultDetail /> },
    ],
  },

  {
    path: "/teacher",
    element: (
      <ProtectedRoute role="teacher">
        <TeacherLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="students" replace /> },
      { path: "students", element: <Students /> },
      { path: "quizzes", element: <Quizzes /> },
      { path: "quizzes/add", element: <CreateQuiz /> },
      { path: "quizzes/:id/edit", element: <CreateQuiz /> },
      { path: "quizzes/:id/assign", element: <AssignQuiz /> },
      { path: "quizzes/:id/results/:studentId", element: <QuizResultDetail /> },
      { path: "results", element: <Results /> },
    ],
  },

  {
    path: "/student",
    element: (
      <ProtectedRoute role="student">
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="quizzes" replace /> },
      { path: "quizzes", element: <QuizSelection /> },
      { path: "quizzes/:quizId/progress", element: <QuizScreen /> },
      { path: "quizzes/:quizId/result", element: <QuizResult /> },
      { path: "quizzes/:id/result/:studentId", element: <QuizResultDetail /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
