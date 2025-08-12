import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotesPage from "./pages/NotesPage";
import CreateNotePage from "./pages/CreateNotePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route wrapper (redirects to home if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    {/* Protected Routes */}
    <Route path="/" element={
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    } />
    <Route path="/notes" element={
      <ProtectedRoute>
        <NotesPage />
      </ProtectedRoute>
    } />
    <Route path="/notes/new" element={
      <ProtectedRoute>
        <CreateNotePage />
      </ProtectedRoute>
    } />
    
    {/* Public Routes */}
    <Route path="/login" element={
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    } />
    <Route path="/signup" element={
      <PublicRoute>
        <SignupPage />
      </PublicRoute>
    } />
    
    {/* 404 Route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
