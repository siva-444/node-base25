// src/components/UI/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { Box, List, ListItem, ListItemButton, Typography } from "@mui/joy";

interface SidebarProps {
  role: "admin" | "teacher" | "student";
}

export default function Sidebar({ role }: SidebarProps) {
  let links: { path: string; label: string }[] = [];

  if (role === "admin") {
    links = [
      { path: "/admin/users", label: "Users" },
      { path: "/admin/teachers", label: "Teachers" },
      { path: "/admin/students", label: "Students" },
      { path: "/admin/quizzes", label: "Quizzes" },
      { path: "/admin/results", label: "Student Results" },
    ];
  } else if (role === "teacher") {
    links = [
      { path: "/teacher/students", label: "Students" },
      { path: "/teacher/quizzes", label: "Quizzes" },
      { path: "/teacher/results", label: "Student Results" },
    ];
  } else if (role === "student") {
    links = [
      { path: "/student/quizzes", label: "Quizzes" },
      { path: "/student/quiz-results", label: "Quiz Results" },
    ];
  }

  return (
    <Box
      sx={{
        width: 240,
        bgcolor: "primary.600",
        color: "white",
        p: 2,
      }}
    >
      <Typography
        level="h4"
        sx={{ mb: 3, textTransform: "capitalize", color: "white" }}
      >
        {role} Panel
      </Typography>
      <List>
        {links.map((link) => (
          <ListItem key={link.path}>
            <NavLink to={link.path} style={{ width: "100%" }}>
              {({ isActive }) => (
                <ListItemButton
                  sx={{
                    borderRadius: "sm",
                    bgcolor: isActive ? "neutral.700" : "transparent",
                    color: "white",
                  }}
                >
                  {link.label}
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
