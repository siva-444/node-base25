import { get, post, put, del } from "@services/api";

export interface DepartmentModel {
  id: number;
  name: string;
}

export interface CreateDepartmentRequest {
  name: string;
}

export interface UpdateDepartmentRequest {
  name: string;
}

export type GetAllDepartmentsResponse = DepartmentModel[];
export type GetDepartmentByIdResponse = DepartmentModel;
export type CreateDepartmentResponse = DepartmentModel;
export type UpdateDepartmentResponse = DepartmentModel;
export type DeleteDepartmentResponse = { id: number };

export const getAllDepartments = () => {
  return get<GetAllDepartmentsResponse>({ url: "/department" });
};

export const getDepartmentById = (id: number) => {
  return get<GetDepartmentByIdResponse>({ url: `/department/${id}` });
};

export const createDepartment = (data: CreateDepartmentRequest) => {
  return post<CreateDepartmentResponse, CreateDepartmentRequest>({
    url: "/department",
    data,
  });
};

export const updateDepartment = (id: number, data: UpdateDepartmentRequest) => {
  return put<UpdateDepartmentResponse, UpdateDepartmentRequest>({
    url: `/department/${id}`,
    data,
  });
};

export const deleteDepartment = (id: number) => {
  return del<DeleteDepartmentResponse>({ url: `/department/${id}` });
};
