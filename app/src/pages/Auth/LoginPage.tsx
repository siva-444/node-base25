import {
  Box,
  Card,
  Typography,
  Input,
  Button,
  ToggleButtonGroup,
} from "@mui/joy";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useAppDispatch } from "@app/store/hooks";
import { setAuth } from "@app/store/authSlice";
import { REPO, CONSTANTS } from "@services/index";

type LoginFormInputs = {
  email: string;
  password: string;
  role: "admin" | "teacher" | "student";
};

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    control,
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "admin@gmail.com",
      password: "pwd123",
      role: "admin",
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const req = await REPO.API.userLogin(data);
    const response = req.getResponse();
    const { status, data: responseData, message } = response;
    if (status === CONSTANTS.STATUS_CODES.OK) {
      const { token, role, email, id, name } = responseData.records;
      dispatch(setAuth({ token, role, email, id, name }));
      navigate(`/${role}`);
    } else if (status === 400) {
      const { errors } = responseData;
      if (errors.email)
        setError("email", {
          type: "manual",
          message: errors.email || "User does not exist",
        });
      if (errors.password)
        setError("password", {
          type: "manual",
          message: errors.password || "Incorrect password",
        });
    } else {
      setError("root", {
        type: "server",
        message: message ?? "Something went wrong",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "neutral.100",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          p: 4,
          width: 400,
          borderRadius: "xl",
          boxShadow: "sm",
          alignItems: "center",
        }}
      >
        <Typography level="h4" textAlign="center" mb={2}>
          Quiz System Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Role Selection */}

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                {...field}
                size="md"
                sx={{ my: 2, mx: "auto" }}
                value={field.value}
                onChange={(_, newValue) => {
                  field.onChange(newValue);
                }}
              >
                <Button value="admin">Admin</Button>
                <Button value="teacher">Teacher</Button>
                <Button value="student">Student</Button>
              </ToggleButtonGroup>
            )}
          />

          {/* Email */}
          <Input
            placeholder="Enter your email"
            type="email"
            sx={{ mb: 2 }}
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
          />
          {errors.email && (
            <Typography color="danger" level="body-sm" mb={1}>
              {errors.email.message}
            </Typography>
          )}

          {/* Password */}
          <Input
            placeholder="Enter your password"
            type="password"
            sx={{ mb: 3 }}
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
          />
          {errors.password && (
            <Typography color="danger" level="body-sm" mb={1}>
              {errors.password.message}
            </Typography>
          )}

          {/* Global Error */}
          {errors.root && (
            <Typography color="danger" level="body-sm" mb={2}>
              {errors.root.message}
            </Typography>
          )}
          {/* Login Button */}
          <Button type="submit" fullWidth variant="solid" sx={{ mb: 2 }}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Forgot Password */}
        <Typography
          level="body-md"
          textAlign="center"
          sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
        >
          Forgot password?
        </Typography>
      </Card>
    </Box>
  );
}
