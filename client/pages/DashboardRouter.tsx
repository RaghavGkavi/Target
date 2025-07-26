import { useAuth } from "@/contexts/AuthContext";
import Index from "./Index";
import QuestDashboard from "./QuestDashboard";

/**
 * Smart router that displays the appropriate dashboard based on user preferences
 */
export default function DashboardRouter() {
  const { userData } = useAuth();

  // Show quest dashboard if user has enabled quest system
  if (userData?.preferences?.useQuestSystem) {
    return <QuestDashboard />;
  }

  // Otherwise show traditional goal dashboard
  return <Index />;
}
