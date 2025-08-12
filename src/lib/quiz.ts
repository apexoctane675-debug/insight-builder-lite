import { Quiz, QuizResult, CreateQuizData } from '@/types/quiz';
import { AuthService } from './auth';

const QUIZZES_STORAGE_KEY = 'smartstudy_quizzes';
const QUIZ_RESULTS_STORAGE_KEY = 'smartstudy_quiz_results';

export class QuizService {
  static getQuizzes(): Quiz[] {
    const user = AuthService.getCurrentUser();
    if (!user) return [];
    
    const quizzesData = localStorage.getItem(QUIZZES_STORAGE_KEY);
    try {
      const allQuizzes = quizzesData ? JSON.parse(quizzesData) : [];
      return allQuizzes.filter((quiz: Quiz) => quiz.userId === user.id);
    } catch {
      return [];
    }
  }

  static getQuiz(id: string): Quiz | null {
    const quizzes = this.getQuizzes();
    return quizzes.find(quiz => quiz.id === id) || null;
  }

  static createQuiz(data: CreateQuizData): Quiz {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    
    const quiz: Quiz = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      questions: data.questions.map((q, index) => ({
        ...q,
        id: `${Date.now()}_${index}`,
      })),
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const allQuizzes = this.getAllQuizzes();
    allQuizzes.push(quiz);
    localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(allQuizzes));
    
    return quiz;
  }

  static deleteQuiz(id: string): void {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    
    const allQuizzes = this.getAllQuizzes();
    const filteredQuizzes = allQuizzes.filter(quiz => !(quiz.id === id && quiz.userId === user.id));
    
    localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(filteredQuizzes));
  }

  static submitQuizResult(quizId: string, answers: number[]): QuizResult {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    
    const quiz = this.getQuiz(quizId);
    if (!quiz) throw new Error('Quiz not found');
    
    let score = 0;
    answers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        score++;
      }
    });
    
    const result: QuizResult = {
      quizId,
      score,
      totalQuestions: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100),
      answers,
      completedAt: new Date().toISOString(),
    };
    
    const allResults = this.getAllResults();
    allResults.push(result);
    localStorage.setItem(QUIZ_RESULTS_STORAGE_KEY, JSON.stringify(allResults));
    
    return result;
  }

  static getQuizResults(quizId?: string): QuizResult[] {
    const user = AuthService.getCurrentUser();
    if (!user) return [];
    
    const resultsData = localStorage.getItem(QUIZ_RESULTS_STORAGE_KEY);
    try {
      const allResults = resultsData ? JSON.parse(resultsData) : [];
      let userResults = allResults.filter((result: QuizResult) => {
        const quiz = this.getQuiz(result.quizId);
        return quiz && quiz.userId === user.id;
      });
      
      if (quizId) {
        userResults = userResults.filter((result: QuizResult) => result.quizId === quizId);
      }
      
      return userResults;
    } catch {
      return [];
    }
  }

  private static getAllQuizzes(): Quiz[] {
    const quizzesData = localStorage.getItem(QUIZZES_STORAGE_KEY);
    try {
      return quizzesData ? JSON.parse(quizzesData) : [];
    } catch {
      return [];
    }
  }

  private static getAllResults(): QuizResult[] {
    const resultsData = localStorage.getItem(QUIZ_RESULTS_STORAGE_KEY);
    try {
      return resultsData ? JSON.parse(resultsData) : [];
    } catch {
      return [];
    }
  }
}

// Initialize with sample quizzes for demo
export const initializeSampleQuizzes = () => {
  const user = AuthService.getCurrentUser();
  if (!user) return;
  
  const existingQuizzes = QuizService.getQuizzes();
  if (existingQuizzes.length > 0) return;
  
  const sampleQuiz: CreateQuizData = {
    title: "Basic Mathematics",
    description: "Test your basic math skills",
    questions: [
      {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
      },
      {
        question: "What is 10 × 5?",
        options: ["45", "50", "55", "60"],
        correctAnswer: 1,
      },
      {
        question: "What is 15 ÷ 3?",
        options: ["4", "5", "6", "7"],
        correctAnswer: 1,
      },
    ],
  };
  
  QuizService.createQuiz(sampleQuiz);
};