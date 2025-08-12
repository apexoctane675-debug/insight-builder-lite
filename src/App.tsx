
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Index from '@/pages/Index';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import NotesPage from '@/pages/NotesPage';
import CreateNotePage from '@/pages/CreateNotePage';
import DictionaryPage from '@/pages/DictionaryPage';
import QuizzesPage from '@/pages/QuizzesPage';
import ProfilePage from '@/pages/ProfilePage';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/notes/create" element={<CreateNotePage />} />
                <Route path="/quizzes" element={<QuizzesPage />} />
                <Route path="/dictionary" element={<DictionaryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
