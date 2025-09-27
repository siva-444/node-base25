import { get, post, del, put } from "@services/api";
export interface QuizModel {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  questions: QuizQuestion[];
}

export type GetAllQuizzesResponse = QuizModel[];
export type GetQuizByIdResponse = QuizModel;
export type DeleteQuizResponse = { id: number };

export const getAllQuizzes = () => {
  return get<GetAllQuizzesResponse>({ url: "/quiz" });
};

export const getQuizById = (id: number) => {
  return get<GetQuizByIdResponse>({ url: `/quiz/${id}` });
};

export const deleteQuiz = (id: number) => {
  return del<DeleteQuizResponse>({ url: `/quiz/${id}` });
};

export interface QuizOption {
  id: number;
  option_text: string;
}

export interface QuizQuestion {
  id: number;
  question_text: string;
  options: QuizOption[];
  explanation?: string;
}

export interface CreateQuizRequest {
  title: string;
  description: string;
  duration_minutes: number;
  questions: QuizQuestion[];
}

export interface CreateQuizResponse {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  questions: QuizQuestion[];
}

export const createQuiz = (data: CreateQuizRequest) => {
  return post<CreateQuizResponse, CreateQuizRequest>({
    url: "/quiz",
    data,
  });
};

export const updateQuiz = (id: number, data: CreateQuizRequest) => {
  return put<CreateQuizResponse, CreateQuizRequest>({
    url: `/quiz/${id}`,
    data,
  });
};
type AssignQuizRequest = {
  batch_year?: number;
  department_id?: number;
};
type AssignQuizResponse = {
  quiz_id: number;
  batch_year?: number;
  department_id?: number;
  assigned_by: number;
};
export const assignQuiz = (id: number, data: AssignQuizRequest) => {
  return post<AssignQuizResponse, AssignQuizRequest>({
    url: `/quiz/${id}/assign`,
    data,
  });
};
