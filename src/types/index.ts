export type Role = "admin" | "teacher" | "student";

export interface User {
  id: number;
  username: string;
  password: string;
  role: Role;
}

export type QuizOption = {
  option_text: string;
  is_correct: boolean;
};

export type QuizQuestion = {
  question_text: string;
  options: QuizOption[];
  explanation?: string;
};

export interface QuizFormData {
  teacher_id: number;
  title: string;
  description?: string;
  duration_minutes: number;
  questions?: QuizQuestion[];
}

export interface Quiz {
  id: number;
  teacher_id: number;
  title: string;
  description?: string;
  duration_minutes: number;
  questions?: Question[];
}

export interface Question {
  id: number;
  quiz_id: number;
  question_text: string;
  explanation?: string;
  options?: Option[];
}

export interface Option {
  id: number;
  question_id: number;
  option_text: string;
  is_correct: boolean;
}
