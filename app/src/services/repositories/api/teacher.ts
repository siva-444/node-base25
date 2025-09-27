import { get, post, put, del } from "@services/api";

export interface TeacherModel {
  id: number;
  name: string;
  email: string;
  role: string;
  department_id: number;
  department: string;
  phone: string;
}

export interface CreateTeacherRequest {
  name: string;
  email: string;
  password?: string;
  department_id: number;
  department?: string;
  phone: string;
}

export interface UpdateTeacherRequest {
  name: string;
  email: string;
  password?: string;
  department_id: number;
  department?: string;
  phone: string;
}

export type GetAllTeachersResponse = TeacherModel[];
export type GetTeacherByIdResponse = TeacherModel;
export type CreateTeacherResponse = TeacherModel;
export type UpdateTeacherResponse = TeacherModel;
export type DeleteTeacherResponse = { id: number };

export const getAllTeachers = () => {
  return get<GetAllTeachersResponse>({ url: "/teacher" });
};

export const getTeacherById = (id: number) => {
  return get<GetTeacherByIdResponse>({ url: `/teacher/${id}` });
};

export const createTeacher = (data: CreateTeacherRequest) => {
  return post<CreateTeacherResponse, CreateTeacherRequest>({
    url: "/teacher",
    data,
  });
};

export const updateTeacher = (id: number, data: UpdateTeacherRequest) => {
  return put<UpdateTeacherResponse, UpdateTeacherRequest>({
    url: `/teacher/${id}`,
    data,
  });
};

export const deleteTeacher = (id: number) => {
  return del<DeleteTeacherResponse>({ url: `/teacher/${id}` });
};
