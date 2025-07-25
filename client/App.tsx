import "./global.css";
import React, { useEffect } from "react";

// Firebase is initialized in client/lib/firebase.ts

// Import sync test helpers in development
if (import.meta.env.DEV) {
  import("@/lib/syncTestHelpers");
}

// Import mobile utilities
import { MobileUtils } from "@/lib/mobile-utils";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MainLayout } from "@/components/MainLayout";
import Index from "./pages/Index";
import CreateGoal from "./pages/CreateGoal";
import CompletedGoals from "./pages/CompletedGoals";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import QuestOnboarding from "./pages/QuestOnboarding";
import QuestDashboard from "./pages/QuestDashboard";
import DashboardRouter from "./pages/DashboardRouter";
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
    try {
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

      // If userData is not loaded yet, show loading
      if (!userData) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        );
      }

      // Check if user needs onboarding
      if (!userData.preferences?.onboardingCompleted) {
        return <Navigate to="/onboarding" replace />;
      }

      return <>{children}</>;
    } catch (error) {
      // If AuthProvider is not available, redirect to auth
      console.warn(
        "AuthProvider not available in ProtectedRoute, redirecting to auth",
      );
      return <Navigate to="/auth" replace />;
    }
  }

  // Public Route Component (redirect to dashboard if authenticated)
  function PublicRoute({ children }: { children: React.ReactNode }) {
    try {
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
    } catch (error) {
      // If AuthProvider is not available, assume public route and render children
      console.warn(
        "AuthProvider not available in PublicRoute, rendering children",
      );
      return <>{children}</>;
    }
  }

  // Onboarding Route Component (requires auth but redirects if already onboarded)
  function OnboardingRoute({ children }: { children: React.ReactNode }) {
    try {
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
    } catch (error) {
      // If AuthProvider is not available, redirect to auth
      console.warn(
        "AuthProvider not available in OnboardingRoute, redirecting to auth",
      );
      return <Navigate to="/auth" replace />;
    }
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

        {/* Onboarding Routes - requires auth but not full onboarding */}
        <Route
          path="/onboarding"
          element={
            <OnboardingRoute>
              <Onboarding />
            </OnboardingRoute>
          }
        />
        <Route
          path="/quest-onboarding"
          element={
            <OnboardingRoute>
              <QuestOnboarding />
            </OnboardingRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardRouter />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-goal"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CreateGoal />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/completed-goals"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CompletedGoals />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Settings />
              </MainLayout>
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

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration);
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }

    // Initialize mobile app features
    MobileUtils.initializeMobileApp();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system">
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <PWAInstallPrompt />
              <div className="mobile-app">
                <AppContent />
              </div>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

// Handle hot reloading properly for React 18
const container = document.getElementById("root")!;

// Create root once and reuse it
let root = container._reactRoot;
if (!root) {
  root = createRoot(container);
  container._reactRoot = root;
}

root.render(<App />);

// Handle hot module replacement
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    // Force a full refresh on hot reload to ensure context providers reset properly
    window.location.reload();
  });
}
