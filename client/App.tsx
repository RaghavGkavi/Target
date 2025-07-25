import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateGoal from "./pages/CreateGoal";
import CompletedGoals from "./pages/CompletedGoals";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create-goal" element={<CreateGoal />} />
          <Route path="/completed-goals" element={<CompletedGoals />} />
          <Route
            path="/goals"
            element={
              <Placeholder
                title="Goal Management"
                description="Manage and edit your existing goals"
                suggestion="I can add features like goal editing, deletion, and detailed progress tracking here!"
              />
            }
          />
          <Route
            path="/habits"
            element={
              <Placeholder
                title="Habit Tracker"
                description="Track your daily habits and routines"
                suggestion="I can build a comprehensive habit tracking system with calendars and analytics!"
              />
            }
          />
          <Route
            path="/recovery"
            element={
              <Placeholder
                title="Addiction Recovery"
                description="Detailed addiction recovery tools and support"
                suggestion="I can add features like trigger tracking, support groups, and recovery milestones!"
              />
            }
          />
          <Route
            path="/analytics"
            element={
              <Placeholder
                title="Analytics & Insights"
                description="Detailed progress analytics and insights"
                suggestion="I can create charts, graphs, and detailed analytics to track your progress over time!"
              />
            }
          />
          <Route
            path="/settings"
            element={
              <Placeholder
                title="Settings"
                description="Customize your LockIn experience"
                suggestion="I can add user preferences, notification settings, and theme customization!"
              />
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
