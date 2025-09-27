import { get, post, put, del } from "@services/api";

export interface StudentModel {
  id: number;
  name: string;
  email: string;
  role: string;
  roll_number: string;
  department_id: number;
  department: string;
  batch_year: number;
}

export interface CreateStudentRequest {
  name: string;
  email: string;
  password?: string;
  roll_number: string;
  department_id: number;
  department?: string;
  batch_year: number;
}

export interface UpdateStudentRequest {
  name: string;
  email: string;
  password?: string;
  roll_number: string;
  department_id: number;
  department?: string;
  batch_year: number;
}
export interface QuizAssignment {
  assignment_id: number;
  answer_id: number;
  quiz_id: number;
  title: string;
  description: string;
  duration_minutes: number;
  assigned_at: string;
  is_answered: boolean;
  score: number;
  total_questions: number;
}

export interface QuizDetail {
  id: number;
  teacher_id: number;
  title: string;
  description: string;
  duration_minutes: number;
  created_at: string;
  teacher_name: string;
  teacher_email: string;
  questions: {
    id: number;
    question_text: string;
    explanation: string;
    options: {
      id: number;
      option_text: string;
    }[];
  }[];
}

export type GetAllStudentsResponse = StudentModel[];
export type GetStudentByIdResponse = StudentModel;
export type CreateStudentResponse = StudentModel;
export type UpdateStudentResponse = StudentModel;
export type DeleteStudentResponse = { id: number };

export const getAllStudents = () => {
  return get<GetAllStudentsResponse>({ url: "/student" });
};

export const getStudentById = (id: number) => {
  return get<GetStudentByIdResponse>({ url: `/student/${id}` });
};

export const createStudent = (data: CreateStudentRequest) => {
  return post<CreateStudentResponse, CreateStudentRequest>({
    url: "/student",
    data,
  });
};

export const updateStudent = (id: number, data: UpdateStudentRequest) => {
  return put<UpdateStudentResponse, UpdateStudentRequest>({
    url: `/student/${id}`,
    data,
  });
};

export const deleteStudent = (id: number) => {
  return del<DeleteStudentResponse>({ url: `/student/${id}` });
};

export const getAssignedQuizzes = () => {
  return get<QuizAssignment[]>({ url: "/student/quizzes" });
};

export const getQuizDetails = (quizId: number) => {
  return get<QuizDetail>({ url: `/student/quizzes/${quizId}` });
};

type SubmitQuizAnswersRequest = {
  answers: { question_id: number; option_id: number }[];
};
type SubmitQuizAnswersResponse = {
  answer_id: number;
  quiz_id: number;
  submitted_at: string;
};
export const submitQuizAnswers = (
  quizId: number,
  answers: SubmitQuizAnswersRequest["answers"],
) => {
  return post<SubmitQuizAnswersResponse, SubmitQuizAnswersRequest>({
    url: `/student/quizzes/${quizId}/submit`,
    data: { answers },
  });
};
