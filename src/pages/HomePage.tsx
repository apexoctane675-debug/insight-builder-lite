import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, User, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import heroImage from '@/assets/hero-education.jpg';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "My Notes",
      description: "Create, edit, and organize your study notes",
      icon: BookOpen,
      path: "/notes",
      color: "from-primary to-primary-glow",
    },
    {
      title: "Quizzes", 
      description: "Test your knowledge with interactive quizzes",
      icon: Brain,
      path: "/quizzes",
      color: "from-accent to-purple-400",
    },
    {
      title: "Word Lookup",
      description: "Search and learn new words with definitions",
      icon: Search,
      path: "/dictionary",
      color: "from-secondary to-green-400",
    },
    {
      title: "Profile",
      description: "Manage your account and preferences",
      icon: User,
      path: "/profile",
      color: "from-orange-400 to-red-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Welcome back,{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {user?.name}!
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Continue your learning journey with SmartStudy Lite. 
                  Access your notes, take quizzes, and expand your knowledge.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="hero"
                  size="lg"
                  onClick={() => navigate('/notes')}
                  className="text-lg"
                >
                  Start Studying
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/quizzes')}
                  className="text-lg"
                >
                  Take a Quiz
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-strong">
                <img 
                  src={heroImage} 
                  alt="Education and learning"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What would you like to do today?</h2>
          <p className="text-muted-foreground text-lg">Choose from your learning tools below</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card 
                key={item.path}
                className="group cursor-pointer transition-all duration-300 hover:shadow-medium hover:scale-105 border-0 shadow-soft bg-gradient-card"
                onClick={() => navigate(item.path)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-medium`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">0</div>
              <div className="text-muted-foreground">Notes Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">0</div>
              <div className="text-muted-foreground">Quizzes Taken</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">0%</div>
              <div className="text-muted-foreground">Average Score</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;