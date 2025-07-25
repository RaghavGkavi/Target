import "./global.css";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8O4q7UTgepZinpcoJwP4IA-keyVxXPTY",
  authDomain: "target-4c91b.firebaseapp.com",
  projectId: "target-4c91b",
  storageBucket: "target-4c91b.firebasestorage.app",
  messagingSenderId: "966058326327",
  appId: "1:966058326327:web:5e27730503ce6b6e7042b2",
  measurementId: "G-QLD5NNECH6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import CreateGoal from "./pages/CreateGoal";
import CompletedGoals from "./pages/CompletedGoals";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

// Extend HTMLElement type to include our custom property
declare global {
  interface HTMLElement {
    _reactRoot?: ReturnType<typeof createRoot>;
  }
}

const queryClient = new QueryClient();

function AppContent() {
  // Protected Route Component
  function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, userData, loading } = useAuth();

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

    // Check if user needs onboarding
    if (userData && !userData.preferences?.onboardingCompleted) {
      return <Navigate to="/onboarding" replace />;
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

  // Onboarding Route Component (requires auth but redirects if already onboarded)
  function OnboardingRoute({ children }: { children: React.ReactNode }) {
    const { user, userData, loading } = useAuth();

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

    if (userData?.preferences?.onboardingCompleted) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />

        {/* Onboarding Route - requires auth but not full onboarding */}
        <Route
          path="/onboarding"
          element={
            <OnboardingRoute>
              <Onboarding />
            </OnboardingRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-goal"
          element={
            <ProtectedRoute>
              <CreateGoal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/completed-goals"
          element={
            <ProtectedRoute>
              <CompletedGoals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <Placeholder
                title="Goal Management"
                description="Manage and edit your existing goals"
                suggestion="I can add features like goal editing, deletion, and detailed progress tracking here!"
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits"
          element={
            <ProtectedRoute>
              <Placeholder
                title="Habit Tracker"
                description="Track your daily habits and routines"
                suggestion="I can build a comprehensive habit tracking system with calendars and analytics!"
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recovery"
          element={
            <ProtectedRoute>
              <Placeholder
                title="Addiction Recovery"
                description="Detailed addiction recovery tools and support"
                suggestion="I can add features like trigger tracking, support groups, and recovery milestones!"
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Placeholder
                title="Analytics & Insights"
                description="Detailed progress analytics and insights"
                suggestion="I can create charts, graphs, and detailed analytics to track your progress over time!"
              />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

// Handle hot reloading properly
const container = document.getElementById("root")!;
let root: ReturnType<typeof createRoot>;

if (!container._reactRoot) {
  root = createRoot(container);
  container._reactRoot = root;
} else {
  root = container._reactRoot;
}

root.render(<App />);
