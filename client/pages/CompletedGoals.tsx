import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Trophy,
  Target,
  Calendar,
  Flame,
  Medal,
  Crown,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CompletedGoal {
  id: string;
  title: string;
  description: string;
  category: "health" | "career" | "personal" | "fitness" | "addiction";
  completedCount: number;
  totalDaysCompleted: number;
  longestStreak: number;
  completionDates: Date[];
  currentLevel: number;
  color: string;
}

// Mock data for completed goals
const mockCompletedGoals: CompletedGoal[] = [
  {
    id: "1",
    title: "Daily Exercise",
    description: "Complete 30 minutes of physical activity",
    category: "fitness",
    completedCount: 3,
    totalDaysCompleted: 95,
    longestStreak: 35,
    completionDates: [
      new Date("2024-01-15"),
      new Date("2024-02-20"),
      new Date("2024-03-25"),
    ],
    currentLevel: 4,
    color: "bg-green-500",
  },
  {
    id: "2",
    title: "Meditation Practice",
    description: "10 minutes of mindfulness meditation",
    category: "health",
    completedCount: 2,
    totalDaysCompleted: 63,
    longestStreak: 28,
    completionDates: [new Date("2024-02-10"), new Date("2024-03-15")],
    currentLevel: 3,
    color: "bg-purple-500",
  },
  {
    id: "3",
    title: "Read for 1 Hour",
    description: "Read personal development books daily",
    category: "personal",
    completedCount: 1,
    totalDaysCompleted: 21,
    longestStreak: 21,
    completionDates: [new Date("2024-01-20")],
    currentLevel: 2,
    color: "bg-blue-500",
  },
];

export default function CompletedGoals() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [completedGoals, setCompletedGoals] = useState<CompletedGoal[]>([]);

  useEffect(() => {
    if (userData?.completedGoals) {
      setCompletedGoals(userData.completedGoals);
    } else {
      // Use mock data for demo
      setCompletedGoals(mockCompletedGoals);
    }
  }, [userData]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fitness":
        return "🏃‍♂️";
      case "health":
        return "🧘‍♀️";
      case "personal":
        return "📚";
      case "career":
        return "💼";
      case "addiction":
        return "🎯";
      default:
        return "⭐";
    }
  };

  const getLevelBadge = (level: number) => {
    if (level >= 5)
      return { icon: Crown, color: "text-yellow-500", label: "Master" };
    if (level >= 4)
      return { icon: Medal, color: "text-purple-500", label: "Expert" };
    if (level >= 3)
      return { icon: Star, color: "text-blue-500", label: "Advanced" };
    if (level >= 2)
      return { icon: Trophy, color: "text-green-500", label: "Intermediate" };
    return { icon: Target, color: "text-gray-500", label: "Beginner" };
  };

  const totalCompletions = completedGoals.reduce(
    (sum, goal) => sum + goal.completedCount,
    0,
  );
  const totalDaysAchieved = completedGoals.reduce(
    (sum, goal) => sum + goal.totalDaysCompleted,
    0,
  );
  const longestOverallStreak = Math.max(
    ...completedGoals.map((goal) => goal.longestStreak),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="rounded-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-bold flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-warning" />
                <span>Completed Goals</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Celebrate your achievements and track your progress
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="rounded-xl bg-gradient-to-r from-warning/10 to-warning/5 border-warning/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCompletions}</p>
                  <p className="text-sm text-muted-foreground">
                    Goals Completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl bg-gradient-to-r from-success/10 to-success/5 border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalDaysAchieved}</p>
                  <p className="text-sm text-muted-foreground">
                    Total Days Achieved
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl bg-gradient-to-r from-streak/10 to-streak/5 border-streak/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-streak/20 flex items-center justify-center">
                  <Flame className="h-6 w-6 text-streak" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{longestOverallStreak}</p>
                  <p className="text-sm text-muted-foreground">
                    Longest Streak
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Completed Goals List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Achievement History</h2>
            <Badge variant="secondary">
              {completedGoals.length} goals mastered
            </Badge>
          </div>

          {completedGoals.length === 0 ? (
            <Card className="rounded-xl border-dashed border-2">
              <CardContent className="p-12 text-center">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">
                  No completed goals yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Complete your first goal to see it appear here and start
                  building your achievement history!
                </p>
                <Button onClick={() => navigate("/")}>
                  Start Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedGoals.map((goal) => {
                const levelInfo = getLevelBadge(goal.currentLevel);
                const LevelIcon = levelInfo.icon;

                return (
                  <Card
                    key={goal.id}
                    className="rounded-xl border-l-4 hover:shadow-md transition-all duration-200"
                    style={{ borderLeftColor: goal.color.replace("bg-", "#") }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {getCategoryIcon(goal.category)}
                          </span>
                          <CardTitle className="text-lg">
                            {goal.title}
                          </CardTitle>
                        </div>
                        <div className="flex items-center space-x-1">
                          <LevelIcon className={`h-4 w-4 ${levelInfo.color}`} />
                          <Badge variant="outline" className="text-xs">
                            Level {goal.currentLevel}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>{goal.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Completion Stats */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-warning">
                            {goal.completedCount}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Completions
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-success">
                            {goal.totalDaysCompleted}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Total Days
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-streak">
                            {goal.longestStreak}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Best Streak
                          </p>
                        </div>
                      </div>

                      {/* Level Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={levelInfo.color}>
                            {levelInfo.label}
                          </span>
                          <span>Level {goal.currentLevel}</span>
                        </div>
                        <Progress
                          value={Math.min(
                            100,
                            (goal.completedCount * 20) % 100,
                          )}
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {5 - (goal.completedCount % 5)} more completions to
                          next level
                        </p>
                      </div>

                      {/* Recent Completions */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Recent Completions:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {goal.completionDates.slice(-3).map((date, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {date.toLocaleDateString()}
                            </Badge>
                          ))}
                          {goal.completionDates.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{goal.completionDates.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Motivational Section */}
        {completedGoals.length > 0 && (
          <Card className="rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Incredible Progress!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You've completed {totalCompletions} goals and built{" "}
                    {totalDaysAchieved} days of positive habits. Keep up the
                    amazing work!
                  </p>
                  <Button onClick={() => navigate("/create-goal")}>
                    Create New Challenge
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
