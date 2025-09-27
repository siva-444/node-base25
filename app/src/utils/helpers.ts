function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type Option = {
  id: number;
  option_text: string;
};

type Question = {
  id: number;
  question_text: string;
  explanation: string;
  options: Option[];
};

type QuizDetail = {
  id: number;
  teacher_id: number;
  title: string;
  description: string;
  duration_minutes: number;
  created_at: string;
  teacher_name: string;
  teacher_email: string;
  questions: Question[];
};

export function shuffleQuizDetails(quiz: QuizDetail): QuizDetail {
  return {
    ...quiz,
    questions: shuffleArray(quiz.questions).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    })),
  };
}
