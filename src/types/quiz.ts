export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: number[];
  completedAt: string;
}

export interface CreateQuizData {
  title: string;
  description: string;
  questions: Omit<QuizQuestion, 'id'>[];
}