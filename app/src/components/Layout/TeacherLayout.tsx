import { Outlet, useNavigate } from "react-router-dom";
import { Box, Sheet, Typography, Avatar, IconButton } from "@mui/joy";
import Sidebar from "../UI/Sidebar";
import { useAppDispatch } from "@app/store/hooks";
import { logout } from "@app/store/authSlice";

export default function TeacherLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // You may want to fetch user profile info from API or localStorage
  const name = localStorage.getItem("name") || "Teacher";
  const email = localStorage.getItem("email") || "teacher@example.com";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        maxHeight: "100vh",
      }}
    >
      {/* Sidebar */}
      <Sidebar role="teacher" />

      {/* Main Content */}
      <Sheet
        variant="plain"
        sx={{
          flex: 1,
          p: 3,
          maxHeight: "100vh",
          overflowY: "auto",
          bgcolor: "neutral.100",
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography level="h4">Teacher Dashboard</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar variant="solid" size="md" />
            <Box>
              <Typography level="body-md" fontWeight={600}>
                {name}
              </Typography>
              <Typography level="body-sm" color="neutral">
                {email}
              </Typography>
            </Box>
            <IconButton
              color="danger"
              variant="soft"
              onClick={handleLogout}
              title="Logout"
              sx={{ borderRadius: "50%" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 13v-2H7V8l-5 4 5 4v-3h9z" fill="currentColor" />
                <path
                  d="M20 3H12v2h8v14h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                  fill="currentColor"
                />
              </svg>
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Outlet />
        </Box>
      </Sheet>
    </Box>
  );
}
