import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import CreateGoal from "./pages/CreateGoal";
import CompletedGoals from "./pages/CompletedGoals";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirect to dashboard if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth" element={
        <PublicRoute>
          <Auth />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      <Route path="/create-goal" element={
        <ProtectedRoute>
          <CreateGoal />
        </ProtectedRoute>
      } />
      <Route path="/completed-goals" element={
        <ProtectedRoute>
          <CompletedGoals />
        </ProtectedRoute>
      } />
      <Route path="/goals" element={
        <ProtectedRoute>
          <Placeholder
            title="Goal Management"
            description="Manage and edit your existing goals"
            suggestion="I can add features like goal editing, deletion, and detailed progress tracking here!"
          />
        </ProtectedRoute>
      } />
      <Route path="/habits" element={
        <ProtectedRoute>
          <Placeholder
            title="Habit Tracker"
            description="Track your daily habits and routines"
            suggestion="I can build a comprehensive habit tracking system with calendars and analytics!"
          />
        </ProtectedRoute>
      } />
      <Route path="/recovery" element={
        <ProtectedRoute>
          <Placeholder
            title="Addiction Recovery"
            description="Detailed addiction recovery tools and support"
            suggestion="I can add features like trigger tracking, support groups, and recovery milestones!"
          />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Placeholder
            title="Analytics & Insights"
            description="Detailed progress analytics and insights"
            suggestion="I can create charts, graphs, and detailed analytics to track your progress over time!"
          />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Placeholder
            title="Settings"
            description="Customize your LockIn experience"
            suggestion="I can add user preferences, notification settings, and theme customization!"
          />
        </ProtectedRoute>
      } />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
