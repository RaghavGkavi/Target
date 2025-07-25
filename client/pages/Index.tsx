import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Target,
  Flame,
  TrendingUp,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Goal {
  id: string;
  title: string;
  description: string;
  category: "health" | "career" | "personal" | "fitness" | "addiction";
  progress: number;
  streak: number;
  targetDays: number;
  daysCompleted: number;
  isCompleted: boolean;
  lastUpdated: Date;
  color: string;
}

interface Addiction {
  id: string;
  name: string;
  cleanDays: number;
  longestStreak: number;
  triggers: string[];
  lastRelapse?: Date;
}

const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Daily Exercise",
    description: "Complete 30 minutes of physical activity",
    category: "fitness",
    progress: 85,
    streak: 12,
    targetDays: 30,
    daysCompleted: 25,
    isCompleted: false,
    lastUpdated: new Date(),
    color: "bg-green-500",
  },
  {
    id: "2",
    title: "Read for 1 Hour",
    description: "Read personal development books daily",
    category: "personal",
    progress: 60,
    streak: 8,
    targetDays: 21,
    daysCompleted: 13,
    isCompleted: false,
    lastUpdated: new Date(),
    color: "bg-blue-500",
  },
  {
    id: "3",
    title: "Meditation Practice",
    description: "10 minutes of mindfulness meditation",
    category: "health",
    progress: 95,
    streak: 18,
    targetDays: 21,
    daysCompleted: 20,
    isCompleted: false,
    lastUpdated: new Date(),
    color: "bg-purple-500",
  },
];

const mockAddictions: Addiction[] = [
  {
    id: "1",
    name: "Social Media",
    cleanDays: 15,
    longestStreak: 23,
    triggers: ["Boredom", "Stress", "Morning routine"],
  },
  {
    id: "2",
    name: "Smoking",
    cleanDays: 45,
    longestStreak: 67,
    triggers: ["Work stress", "Social situations"],
  },
];

const motivationalQuotes = [
  "The only impossible journey is the one you never begin.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Don't watch the clock; do what it does. Keep going.",
  "You are stronger than your excuses.",
  "Progress, not perfection.",
];

export default function Index() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [addictions, setAddictions] = useState<Addiction[]>(mockAddictions);
  const [currentQuote, setCurrentQuote] = useState("");

  useEffect(() => {
    setCurrentQuote(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)],
    );
  }, []);

  const totalActiveGoals = goals.filter((g) => !g.isCompleted).length;
  const completedToday = goals.filter(
    (g) => g.lastUpdated.toDateString() === new Date().toDateString(),
  ).length;
  const totalStreak = goals.reduce((sum, goal) => sum + goal.streak, 0);
  const avgProgress =
    goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length;

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

  const markGoalComplete = (goalId: string) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              daysCompleted: goal.daysCompleted + 1,
              progress: Math.min(100, goal.progress + 100 / goal.targetDays),
              streak: goal.streak + 1,
              lastUpdated: new Date(),
            }
          : goal,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  LockIn
                </h1>
                <p className="text-sm text-muted-foreground">
                  Master your goals, break your chains
                </p>
              </div>
            </div>
            <Link to="/create-goal">
              <Button className="rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                New Goal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Motivational Quote */}
        <Card className="border-0 bg-gradient-to-r from-primary to-accent text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8" />
              <div>
                <p className="text-lg font-medium">{currentQuote}</p>
                <p className="text-primary-foreground/80 text-sm">
                  Your daily motivation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalActiveGoals}</p>
                  <p className="text-xs text-muted-foreground">Active Goals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <div>
                  <p className="text-2xl font-bold">{completedToday}</p>
                  <p className="text-xs text-muted-foreground">Done Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-streak" />
                <div>
                  <p className="text-2xl font-bold">{totalStreak}</p>
                  <p className="text-xs text-muted-foreground">Total Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-info" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(avgProgress)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 rounded-xl">
            <TabsTrigger value="goals" className="rounded-lg">
              Goals
            </TabsTrigger>
            <TabsTrigger value="addictions" className="rounded-lg">
              Recovery
            </TabsTrigger>
            <TabsTrigger value="insights" className="rounded-lg">
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Goals</h2>
              <Badge variant="secondary">{goals.length} total</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal) => (
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
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <Flame className="h-3 w-3 mr-1" />
                        {goal.streak}
                      </Badge>
                    </div>
                    <CardDescription>{goal.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {goal.daysCompleted}/{goal.targetDays} days
                        </span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {Math.round(goal.progress)}% complete
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1 rounded-lg"
                        onClick={() => markGoalComplete(goal.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg"
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Addictions Recovery Tab */}
          <TabsContent value="addictions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recovery Tracker</h2>
              <Badge variant="secondary">{addictions.length} tracked</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {addictions.map((addiction) => (
                <Card key={addiction.id} className="rounded-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <span>🎯</span>
                        <span>{addiction.name}</span>
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="bg-success/10 text-success border-success/20"
                      >
                        {addiction.cleanDays} days clean
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-success">
                          {addiction.cleanDays}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Days Clean
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-warning">
                          {addiction.longestStreak}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Best Streak
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Common Triggers:</p>
                      <div className="flex flex-wrap gap-1">
                        {addiction.triggers.map((trigger, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Progress
                      value={
                        (addiction.cleanDays / addiction.longestStreak) * 100
                      }
                      className="h-2"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <h2 className="text-xl font-semibold">Your Progress Insights</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-warning" />
                    <span>Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg">
                    <div className="h-10 w-10 bg-success rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">First Week Complete</p>
                      <p className="text-sm text-muted-foreground">
                        Completed 7 days in a row
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-warning/10 rounded-lg">
                    <div className="h-10 w-10 bg-warning rounded-full flex items-center justify-center">
                      <Flame className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Streak Master</p>
                      <p className="text-sm text-muted-foreground">
                        Maintained 10+ day streak
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-info" />
                    <span>Weekly Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Goals completed this week</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Consistency score</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <p className="text-lg font-bold text-success">12</p>
                      <p className="text-xs text-muted-foreground">
                        Days Active
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">3</p>
                      <p className="text-xs text-muted-foreground">
                        New Records
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
