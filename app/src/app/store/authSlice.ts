import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  token: string | null;
  role: "admin" | "teacher" | "student" | null;
  email: string | null;
  id: number | null;
  name: string | null;
}

const initialState: AuthState = {
  token: null,
  role: null,
  email: null,
  id: null,
  name: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        token: string;
        role: "admin" | "teacher" | "student";
        email: string;
        id: number;
        name: string;
      }>,
    ) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.name = action.payload.name;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role);
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("id", action.payload.id.toString());
      localStorage.setItem("name", action.payload.name);
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      localStorage.removeItem("id");
      localStorage.removeItem("name");
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
