import { supabase } from '@/integrations/supabase/client';
import { Quiz, QuizResult, CreateQuizData } from '@/types/quiz';

export class QuizService {
  static async getQuizzes(): Promise<Quiz[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching quizzes:', error);
      return [];
    }

    return data.map(quiz => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description || '',
      questions: quiz.questions as any[], // Cast to handle JSON type
      userId: quiz.user_id,
      createdAt: quiz.created_at,
      updatedAt: quiz.updated_at,
    }));
  }

  static async getQuiz(id: string): Promise<Quiz | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      questions: data.questions as any[], // Cast to handle JSON type
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  static async createQuiz(quizData: CreateQuizData): Promise<Quiz> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const questionsWithIds = quizData.questions.map((q, index) => ({
      ...q,
      id: `${Date.now()}_${index}`,
    }));

    const { data, error } = await supabase
      .from('quizzes')
      .insert({
        title: quizData.title,
        description: quizData.description,
        questions: questionsWithIds,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      questions: data.questions as any[], // Cast to handle JSON type
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  static async deleteQuiz(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async submitQuizResult(quizId: string, answers: number[]): Promise<QuizResult> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const quiz = await this.getQuiz(quizId);
    if (!quiz) throw new Error('Quiz not found');

    let score = 0;
    answers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        score++;
      }
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);

    const { data, error } = await supabase
      .from('quiz_results')
      .insert({
        quiz_id: quizId,
        user_id: user.id,
        score,
        answers,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      quizId: data.quiz_id,
      score: data.score,
      totalQuestions: quiz.questions.length,
      percentage,
      answers: data.answers as number[],
      completedAt: data.completed_at,
    };
  }

  static async getQuizResults(quizId?: string): Promise<QuizResult[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (quizId) {
      query = query.eq('quiz_id', quizId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching quiz results:', error);
      return [];
    }

    return data.map(result => {
      // We'll need to calculate these from the quiz data
      const totalQuestions = 0; // Will be calculated if needed
      const percentage = 0; // Will be calculated if needed
      
      return {
        quizId: result.quiz_id,
        score: result.score,
        totalQuestions,
        percentage,
        answers: result.answers as number[],
        completedAt: result.completed_at,
      };
    });
  }
}

// Initialize with sample quizzes for demo
export const initializeSampleQuizzes = async () => {
  try {
    const existingQuizzes = await QuizService.getQuizzes();
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

    await QuizService.createQuiz(sampleQuiz);
  } catch (error) {
    console.error('Error initializing sample quizzes:', error);
  }
};