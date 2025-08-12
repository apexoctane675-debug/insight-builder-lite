import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Plus, Clock, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuizzesPage: React.FC = () => {
  const navigate = useNavigate();

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
          <h1 className="text-4xl font-bold mb-2">Quizzes</h1>
          <p className="text-muted-foreground text-lg">
            Test your knowledge and track your progress
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-soft bg-gradient-card text-center p-8">
            <CardHeader>
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center">
                <Brain className="h-12 w-12 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl mb-4">Quizzes Coming Soon!</CardTitle>
              <CardDescription className="text-lg leading-relaxed">
                We're working hard to bring you an amazing quiz experience. Soon you'll be able to:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6 my-8">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Create Quizzes</h3>
                  <p className="text-sm text-muted-foreground">Build custom quizzes from your notes</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Timed Tests</h3>
                  <p className="text-sm text-muted-foreground">Challenge yourself with time limits</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold mb-2">Track Progress</h3>
                  <p className="text-sm text-muted-foreground">Monitor your performance over time</p>
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/home')}
                  className="w-full md:w-auto"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuizzesPage;