import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Brain, Play, Settings, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuizQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  type: string;
  difficulty: string;
  category: string;
}

interface QuizSettings {
  amount: number;
  category: string;
  difficulty: string;
  type: string;
}

const QuizzesPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'setup' | 'quiz' | 'results'>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    amount: 10,
    category: '',
    difficulty: '',
    type: ''
  });

  const categories = [
    { value: '', label: 'Any Category' },
    { value: '9', label: 'General Knowledge' },
    { value: '10', label: 'Entertainment: Books' },
    { value: '11', label: 'Entertainment: Film' },
    { value: '12', label: 'Entertainment: Music' },
    { value: '13', label: 'Entertainment: Musicals & Theatres' },
    { value: '14', label: 'Entertainment: Television' },
    { value: '15', label: 'Entertainment: Video Games' },
    { value: '16', label: 'Entertainment: Board Games' },
    { value: '17', label: 'Science & Nature' },
    { value: '18', label: 'Science: Computers' },
    { value: '19', label: 'Science: Mathematics' },
    { value: '20', label: 'Mythology' },
    { value: '21', label: 'Sports' },
    { value: '22', label: 'Geography' },
    { value: '23', label: 'History' },
    { value: '24', label: 'Politics' },
    { value: '25', label: 'Art' },
    { value: '26', label: 'Celebrities' },
    { value: '27', label: 'Animals' },
    { value: '28', label: 'Vehicles' }
  ];

  const difficulties = [
    { value: '', label: 'Any Difficulty' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const types = [
    { value: '', label: 'Any Type' },
    { value: 'multiple', label: 'Multiple Choice' },
    { value: 'boolean', label: 'True / False' }
  ];

  const amounts = [
    { value: 5, label: '5 Questions' },
    { value: 10, label: '10 Questions' },
    { value: 15, label: '15 Questions' },
    { value: 20, label: '20 Questions' }
  ];

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let url = `https://opentdb.com/api.php?amount=${quizSettings.amount}`;
      
      if (quizSettings.category) url += `&category=${quizSettings.category}`;
      if (quizSettings.difficulty) url += `&difficulty=${quizSettings.difficulty}`;
      if (quizSettings.type) url += `&type=${quizSettings.type}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.response_code === 0) {
        setQuestions(data.results);
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setScore(0);
        setCurrentView('quiz');
        
        toast({
          title: "Quiz loaded!",
          description: `${data.results.length} questions ready to go.`,
        });
      } else {
        throw new Error('Failed to fetch questions');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load quiz questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const decodeHtml = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setCurrentView('results');
  };

  const restartQuiz = () => {
    setCurrentView('setup');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setScore(0);
  };

  const getCurrentQuestion = () => questions[currentQuestionIndex];
  const currentQuestion = getCurrentQuestion();
  
  const getShuffledAnswers = (question: QuizQuestion) => {
    const answers = [...question.incorrect_answers, question.correct_answer];
    return answers.sort(() => Math.random() - 0.5);
  };

  if (currentView === 'setup') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-purple-400 flex items-center justify-center shadow-medium">
                <Brain className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Take a Quiz</h1>
            <p className="text-muted-foreground text-lg">
              Customize your quiz experience and test your knowledge
            </p>
          </div>

          {/* Quiz Setup */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-soft bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quiz Settings
                </CardTitle>
                <CardDescription>
                  Choose your preferences for the quiz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Number of Questions</Label>
                    <Select
                      value={quizSettings.amount.toString()}
                      onValueChange={(value) => setQuizSettings({...quizSettings, amount: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {amounts.map(amount => (
                          <SelectItem key={amount.value} value={amount.value.toString()}>
                            {amount.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={quizSettings.category}
                      onValueChange={(value) => setQuizSettings({...quizSettings, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select
                      value={quizSettings.difficulty}
                      onValueChange={(value) => setQuizSettings({...quizSettings, difficulty: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map(difficulty => (
                          <SelectItem key={difficulty.value} value={difficulty.value}>
                            {difficulty.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Question Type</Label>
                    <Select
                      value={quizSettings.type}
                      onValueChange={(value) => setQuizSettings({...quizSettings, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {types.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <Button
                    onClick={fetchQuestions}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    {loading ? 'Loading Questions...' : 'Start Quiz'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'quiz' && currentQuestion) {
    const shuffledAnswers = getShuffledAnswers(currentQuestion);
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Progress Header */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={restartQuiz}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Setup
              </Button>
              <div className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-soft bg-gradient-card mb-6">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                    {decodeHtml(currentQuestion.category)}
                  </span>
                  <span className="bg-accent/10 text-accent px-2 py-1 rounded text-xs font-medium capitalize">
                    {currentQuestion.difficulty}
                  </span>
                  <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs font-medium">
                    {currentQuestion.type === 'boolean' ? 'True/False' : 'Multiple Choice'}
                  </span>
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  {decodeHtml(currentQuestion.question)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {shuffledAnswers.map((answer, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswers[currentQuestionIndex] === answer ? "default" : "outline"}
                      className="w-full text-left justify-start h-auto p-4"
                      onClick={() => handleAnswerSelect(answer)}
                    >
                      <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3 flex-shrink-0">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {decodeHtml(answer)}
                    </Button>
                  ))}
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswers[currentQuestionIndex]}
                  >
                    {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'results') {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <Brain className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
              <p className="text-muted-foreground text-lg">
                Here's how you performed
              </p>
            </div>

            <Card className="border-0 shadow-soft bg-gradient-card mb-8">
              <CardContent className="p-8">
                <div className="text-6xl font-bold text-primary mb-4">
                  {percentage}%
                </div>
                <div className="text-xl mb-6">
                  You got <span className="font-bold text-primary">{score}</span> out of{' '}
                  <span className="font-bold">{questions.length}</span> questions correct
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-500">{score}</div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-500">{questions.length - score}</div>
                    <div className="text-sm text-muted-foreground">Incorrect</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{questions.length}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={restartQuiz}
                variant="outline"
                size="lg"
              >
                Take Another Quiz
              </Button>
              <Button
                onClick={() => setCurrentView('setup')}
                size="lg"
              >
                Change Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizzesPage;