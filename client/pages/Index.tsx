import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { calculateDisciplineRank, calculateConsistencyScore, getDisciplineRankInfo, DISCIPLINE_RANKS } from "@/lib/disciplineRanking";
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
  Edit,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Trophy,
  LogOut,
  User,
  Settings,
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  lastLoggedDate?: string; // Track last date when goal was completed
  color: string;
}

interface Addiction {
  id: string;
  name: string;
  cleanDays: number;
  longestStreak: number;
  triggers: string[];
  lastRelapse?: Date;
  lastLoggedDate?: string; // Track last date when clean day was added
}

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
  const navigate = useNavigate();
  const { user, userData, updateUserData, signOut } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [addictions, setAddictions] = useState<Addiction[]>([]);
  const [completedGoals, setCompletedGoals] = useState<CompletedGoal[]>([]);
  const [currentQuote, setCurrentQuote] = useState("");
  const [editingAddiction, setEditingAddiction] = useState<Addiction | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAddiction, setNewAddiction] = useState({
    name: "",
    triggers: "",
  });
  const [affirmationDialog, setAffirmationDialog] = useState<{
    isOpen: boolean;
    addictionId: string;
    affirmationText: string;
  }>({ isOpen: false, addictionId: "", affirmationText: "" });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setCurrentQuote(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)],
    );
  }, []);

  // Handle scroll for header hiding
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        // Scrolling up or near top - show header
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold - hide header
        setIsHeaderVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Load user data when component mounts or userData changes
  useEffect(() => {
    if (userData) {
      setGoals(userData.goals || mockGoals);
      setAddictions(userData.addictions || mockAddictions);
      setCompletedGoals(userData.completedGoals || []);
    } else if (user) {
      // Use mock data for new users
      setGoals(mockGoals);
      setAddictions(mockAddictions);
      setCompletedGoals([]);
    }
    setIsInitialLoad(false);
  }, [userData, user]);

  // Function to update discipline ranking
  const updateDisciplineRanking = () => {
    if (!userData?.disciplineData) return;

    const totalCompletions = completedGoals.reduce((sum, goal) => sum + goal.completedCount, 0);
    const consistencyScore = calculateConsistencyScore(goals);

    const newRank = calculateDisciplineRank(
      userData.disciplineData.baseScore,
      totalCompletions,
      consistencyScore,
      goals,
      completedGoals
    );

    const updatedDisciplineData = {
      ...userData.disciplineData,
      currentRank: newRank,
      totalCompletions,
      consistencyScore,
      lastUpdated: new Date()
    };

    updateUserData({
      ...userData,
      disciplineData: updatedDisciplineData
    });
  };

  // Save user data whenever goals, addictions, or completed goals change (but not on initial load)
  useEffect(() => {
    if (!isInitialLoad && user && userData) {
      updateUserData({
        goals,
        addictions,
        completedGoals
      });

      // Update discipline ranking
      updateDisciplineRanking();
    }
  }, [goals, addictions, completedGoals, isInitialLoad, user]);

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

  const markGoalComplete = (goalId: string, forceAdd: boolean = false) => {
    const today = new Date().toDateString();

    setGoals(currentGoals => {
      const goal = currentGoals.find(g => g.id === goalId);
      if (!goal) return currentGoals;

      // Check if already logged today
      if (goal.lastLoggedDate === today && !forceAdd) {
        // Show affirmation dialog
        setAffirmationDialog({
          isOpen: true,
          addictionId: goalId, // Reuse the same dialog for goals
          affirmationText: ""
        });
        return currentGoals;
      }

      const newProgress = Math.min(100, goal.progress + 100 / goal.targetDays);

      if (newProgress >= 100) {
        // Goal completed - move to completed goals and restart with higher target
        const finalStreak = goal.streak + 1;
        const completedGoal: CompletedGoal = {
          id: goal.id,
          title: goal.title,
          description: goal.description,
          category: goal.category,
          completedCount: 1,
          totalDaysCompleted: goal.targetDays,
          longestStreak: finalStreak,
          completionDates: [new Date()],
          currentLevel: 1,
          color: goal.color
        };

        // Update completed goals
        setCompletedGoals(currentCompleted => {
          const existingCompleted = currentCompleted.find(cg => cg.title === goal.title);
          if (existingCompleted) {
            return currentCompleted.map(cg =>
              cg.title === goal.title
                ? {
                    ...cg,
                    completedCount: cg.completedCount + 1,
                    totalDaysCompleted: cg.totalDaysCompleted + goal.targetDays,
                    longestStreak: Math.max(cg.longestStreak, finalStreak),
                    completionDates: [...cg.completionDates, new Date()],
                    currentLevel: Math.floor((cg.completedCount + 1) / 5) + 1
                  }
                : cg
            );
          } else {
            return [...currentCompleted, completedGoal];
          }
        });

        // Restart goal with increased target (add 7 more days) BUT KEEP THE STREAK
        return currentGoals.map(g =>
          g.id === goalId
            ? {
                ...g,
                progress: 0,
                daysCompleted: 0,
                targetDays: g.targetDays + 7,
                streak: finalStreak, // CARRY OVER THE STREAK!
                lastUpdated: new Date(),
                lastLoggedDate: today
              }
            : g
        );
      } else {
        // Normal progress update
        return currentGoals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                daysCompleted: g.daysCompleted + 1,
                progress: newProgress,
                streak: g.streak + 1,
                lastUpdated: new Date(),
                lastLoggedDate: today,
              }
            : g,
        );
      }
    });
  };

  const addCleanDay = (addictionId: string, forceAdd: boolean = false) => {
    const today = new Date().toDateString();

    setAddictions(currentAddictions => {
      const addiction = currentAddictions.find(a => a.id === addictionId);
      if (!addiction) return currentAddictions;

      // Check if already logged today
      if (addiction.lastLoggedDate === today && !forceAdd) {
        // Show affirmation dialog
        setAffirmationDialog({
          isOpen: true,
          addictionId,
          affirmationText: ""
        });
        return currentAddictions;
      }

      return currentAddictions.map((a) =>
        a.id === addictionId
          ? {
              ...a,
              cleanDays: a.cleanDays + 1,
              longestStreak: Math.max(a.longestStreak, a.cleanDays + 1),
              lastLoggedDate: today,
            }
          : a,
      );
    });
  };

  const confirmAffirmation = () => {
    const requiredAffirmation = "I pledge that I was clean for the extra day I am logging.";

    if (affirmationDialog.affirmationText.trim() === requiredAffirmation) {
      // Check if this is for a goal or addiction based on ID format
      const isGoal = goals.some(g => g.id === affirmationDialog.addictionId);

      if (isGoal) {
        markGoalComplete(affirmationDialog.addictionId, true);
      } else {
        addCleanDay(affirmationDialog.addictionId, true);
      }

      setAffirmationDialog({ isOpen: false, addictionId: "", affirmationText: "" });
    }
  };

  const reportRelapse = (addictionId: string) => {
    setAddictions(currentAddictions =>
      currentAddictions.map((addiction) =>
        addiction.id === addictionId
          ? {
              ...addiction,
              cleanDays: 0,
              lastRelapse: new Date(),
            }
          : addiction,
      )
    );
  };

  const deleteAddiction = (addictionId: string) => {
    setAddictions(currentAddictions =>
      currentAddictions.filter((addiction) => addiction.id !== addictionId)
    );
  };

  const saveEditedAddiction = () => {
    if (!editingAddiction) return;

    setAddictions(currentAddictions =>
      currentAddictions.map((addiction) =>
        addiction.id === editingAddiction.id
          ? editingAddiction
          : addiction,
      )
    );
    setEditingAddiction(null);
  };

  const addNewAddiction = () => {
    if (!newAddiction.name.trim()) return;

    const addiction: Addiction = {
      id: Date.now().toString(),
      name: newAddiction.name,
      cleanDays: 0,
      longestStreak: 0,
      triggers: newAddiction.triggers.split(",").map(t => t.trim()).filter(t => t),
    };

    setAddictions(currentAddictions => [...currentAddictions, addiction]);
    setNewAddiction({ name: "", triggers: "" });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className={`border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Target
                </h1>
                <p className="text-sm text-muted-foreground">
                  Master your goals, break your chains
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/completed-goals">
                <Button variant="outline" className="rounded-xl">
                  <Trophy className="h-4 w-4 mr-2" />
                  Completed
                </Button>
              </Link>
              <Link to="/create-goal">
                <Button className="rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  New Goal
                </Button>
              </Link>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.photoURL} alt={user?.displayName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8 overflow-x-hidden max-w-full">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 overflow-hidden">
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

          {/* Discipline Ranking Card */}
          {userData?.disciplineData && (() => {
            const rankInfo = getDisciplineRankInfo(userData.disciplineData.currentRank);
            return (
              <Card className="rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-lg">{rankInfo.emoji}</div>
                    <div>
                      <p className={`text-2xl font-bold ${rankInfo.color}`}>
                        {userData.disciplineData.currentRank}
                      </p>
                      <p className="text-xs text-muted-foreground">Discipline</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })()}
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
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{addictions.length} tracked</Badge>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="rounded-lg">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Tracker
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Recovery Tracker</DialogTitle>
                      <DialogDescription>
                        Track a new addiction or habit you want to overcome.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Addiction/Habit Name</Label>
                        <Input
                          id="name"
                          placeholder="e.g., Social Media, Smoking, Gaming"
                          value={newAddiction.name}
                          onChange={(e) => setNewAddiction({ ...newAddiction, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="triggers">Common Triggers (optional)</Label>
                        <Input
                          id="triggers"
                          placeholder="e.g., Stress, Boredom, Social situations"
                          value={newAddiction.triggers}
                          onChange={(e) => setNewAddiction({ ...newAddiction, triggers: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Separate multiple triggers with commas
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addNewAddiction} disabled={!newAddiction.name.trim()}>
                        Add Tracker
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
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
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="bg-success/10 text-success border-success/20"
                        >
                          {addiction.cleanDays} days clean
                        </Badge>
                        <div className="flex space-x-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => setEditingAddiction(addiction)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Edit Recovery Tracker</DialogTitle>
                                <DialogDescription>
                                  Update your addiction tracking details.
                                </DialogDescription>
                              </DialogHeader>
                              {editingAddiction && (
                                <div className="grid gap-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-name">Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={editingAddiction.name}
                                      onChange={(e) => setEditingAddiction({
                                        ...editingAddiction,
                                        name: e.target.value
                                      })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-triggers">Triggers</Label>
                                    <Input
                                      id="edit-triggers"
                                      value={editingAddiction.triggers.join(", ")}
                                      onChange={(e) => setEditingAddiction({
                                        ...editingAddiction,
                                        triggers: e.target.value.split(",").map(t => t.trim()).filter(t => t)
                                      })}
                                      placeholder="Separate with commas"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-clean-days">Clean Days</Label>
                                      <Input
                                        id="edit-clean-days"
                                        type="number"
                                        min="0"
                                        value={editingAddiction.cleanDays}
                                        onChange={(e) => setEditingAddiction({
                                          ...editingAddiction,
                                          cleanDays: parseInt(e.target.value) || 0
                                        })}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-longest-streak">Best Streak</Label>
                                      <Input
                                        id="edit-longest-streak"
                                        type="number"
                                        min="0"
                                        value={editingAddiction.longestStreak}
                                        onChange={(e) => setEditingAddiction({
                                          ...editingAddiction,
                                          longestStreak: parseInt(e.target.value) || 0
                                        })}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setEditingAddiction(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={saveEditedAddiction}>
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Recovery Tracker</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the {addiction.name} tracker? This action cannot be undone and you'll lose all progress data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteAddiction(addiction.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
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
                        {addiction.triggers.length > 0 ? (
                          addiction.triggers.map((trigger, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {trigger}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground">No triggers specified</p>
                        )}
                      </div>
                    </div>

                    <Progress
                      value={
                        addiction.longestStreak > 0
                          ? (addiction.cleanDays / addiction.longestStreak) * 100
                          : addiction.cleanDays > 0 ? 100 : 0
                      }
                      className="h-2"
                    />

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1 rounded-lg"
                        onClick={() => addCleanDay(addiction.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Add Clean Day
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg border-destructive/20 text-destructive hover:bg-destructive/10"
                          >
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Relapse
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Report Relapse</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will reset your clean days counter to 0. Remember, setbacks are part of recovery. You can start again immediately.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => reportRelapse(addiction.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Report Relapse
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <h2 className="text-xl font-semibold">Your Progress Insights</h2>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Discipline Ranking Details */}
              {userData?.disciplineData && (() => {
                const rankInfo = getDisciplineRankInfo(userData.disciplineData.currentRank);
                const nextRankIndex = Math.min(14, DISCIPLINE_RANKS.indexOf(userData.disciplineData.currentRank) + 1);
                const nextRank = DISCIPLINE_RANKS[nextRankIndex];
                const progress = ((DISCIPLINE_RANKS.indexOf(userData.disciplineData.currentRank) + 1) / DISCIPLINE_RANKS.length) * 100;

                return (
                  <Card className="rounded-xl md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="text-lg">{rankInfo.emoji}</div>
                        <span>Discipline Ranking</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`text-4xl font-bold ${rankInfo.color}`}>
                            {userData.disciplineData.currentRank}
                          </div>
                          <div>
                            <p className="font-semibold">{rankInfo.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {userData.disciplineData.totalCompletions} total completions
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Consistency</p>
                          <p className="font-semibold">{userData.disciplineData.consistencyScore}%</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress to {nextRank}</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Keep completing goals and maintaining streaks to improve your ranking!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}
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

      {/* Affirmation Dialog */}
      <Dialog open={affirmationDialog.isOpen} onOpenChange={(open) => !open && setAffirmationDialog({ isOpen: false, addictionId: "", affirmationText: "" })}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span>Confirm Extra Clean Day</span>
            </DialogTitle>
            <DialogDescription>
              You've already logged a clean day today. To add another day (for missed logging),
              please type the affirmation below exactly as shown.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Required Affirmation:</p>
              <p className="text-sm italic">
                "I pledge that I was clean for the extra day I am logging."
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="affirmation">Type the affirmation:</Label>
              <Textarea
                id="affirmation"
                value={affirmationDialog.affirmationText}
                onChange={(e) => setAffirmationDialog({
                  ...affirmationDialog,
                  affirmationText: e.target.value
                })}
                placeholder="Type the exact affirmation here..."
                className="resize-none"
                rows={3}
              />
            </div>
            {affirmationDialog.affirmationText &&
             affirmationDialog.affirmationText.trim() !== "I pledge that I was clean for the extra day I am logging." && (
              <p className="text-sm text-destructive">
                The affirmation must match exactly as written above.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAffirmationDialog({ isOpen: false, addictionId: "", affirmationText: "" })}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAffirmation}
              disabled={affirmationDialog.affirmationText.trim() !== "I pledge that I was clean for the extra day I am logging."}
            >
              Confirm & Add Day
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
