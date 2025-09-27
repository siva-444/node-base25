import { get, post, put, del } from "@services/api";
import { API_PATHS } from "@services/constants";
export interface UserModel {
  id: number;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
}
export type LoginResponse = UserModel & { token: string };
export type LoginRequest = Pick<UserModel, "email" | "role"> & {
  password: string;
};

export const userLogin = (data: LoginRequest) => {
  return post<LoginResponse, LoginRequest>({
    url: API_PATHS.USER_LOGIN,
    data,
  });
};

export const getAdminUsers = () => {
  return get<UserModel[]>({ url: "/user" });
};

type UserCreationData = Partial<Omit<UserModel, "id">> & {
  password?: string;
};
export const createUser = (data: UserCreationData) => {
  return post<UserModel, UserCreationData>({
    url: "/user",
    data,
  });
};
type UpdateUserData = Partial<Pick<UserModel, "name" | "email">> & {
  password?: string;
};
export const updateUser = (id: number, data: UpdateUserData) => {
  return put<UserModel, UpdateUserData>({ url: `/user/${id}`, data });
};

export const deleteUser = (id: number) => {
  return del<{ message: string }>({ url: `/user/${id}` });
};
