import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { QuestEngine } from "@/lib/questEngine";
import { checkQuestAchievements, getEarnedQuestAchievements, getRarityColor, getRarityBorder } from "@/lib/questAchievements";
import { DailyQuest, QuestDifficulty } from '@shared/quest-types';
import { getRandomQuest } from '@/lib/questLib';
import { getRandomQuestTemplate } from '@shared/quest-templates';
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
  RotateCcw,
  AlertTriangle,
  Trophy,
  LogOut,
  User,
  Settings,
  Star,
  RefreshCw,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";

const motivationalQuotes = [
  "Every quest begins with a single step.",
  "Level up your life, one quest at a time.",
  "Your next achievement is just one quest away.",
  "Today's quests are tomorrow's victories.",
  "Progress, not perfection.",
];

const getDifficultyColor = (difficulty: QuestDifficulty): string => {
  switch (difficulty) {
    case 'easy':
      return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
    case 'moderate':
      return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
    case 'hard':
      return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20';
    case 'very_hard':
      return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

const getDifficultyBorder = (difficulty: QuestDifficulty): string => {
  switch (difficulty) {
    case 'easy':
      return 'border-green-200 dark:border-green-700';
    case 'moderate':
      return 'border-blue-200 dark:border-blue-700';
    case 'hard':
      return 'border-orange-200 dark:border-orange-700';
    case 'very_hard':
      return 'border-red-200 dark:border-red-700';
    default:
      return 'border-gray-200 dark:border-gray-700';
  }
};

export default function QuestDashboard() {
  const navigate = useNavigate();
  const { user, userData, updateUserData, signOut } = useAuth();
  const [currentQuote, setCurrentQuote] = useState("");
  const [levelUpDialog, setLevelUpDialog] = useState<{ isOpen: boolean; newLevel?: number }>({ isOpen: false });
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [timeUntilMidnight, setTimeUntilMidnight] = useState<string>("");
  const [localQuestData, setLocalQuestData] = useState(userData?.questSystemData);

  // Dev mode detection from settings
  const isDevMode = user?.email === "raghav.gkavi@gmail.com" && userData?.preferences?.devModeEnabled === true;

  // Update local quest data when userData changes
  useEffect(() => {
    if (userData?.questSystemData) {
      setLocalQuestData(userData.questSystemData);
    }
  }, [userData?.questSystemData]);

  // Get quest system data from local state
  const questSystemData = localQuestData;
  const currentQuests = questSystemData?.currentQuests || [];
  const userLevel = questSystemData?.userLevel || { currentLevel: 1, currentXP: 0, xpToNextLevel: 50, totalXP: 0 };
  const weeklyStats = questSystemData?.weeklyStats || { questsCompleted: 0, totalXPEarned: 0, streak: 0 };



  const completedToday = currentQuests.filter(q => q.status === 'completed').length;
  const activeQuests = currentQuests.filter(q => q.status === 'active').length;

  useEffect(() => {
    setCurrentQuote(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)],
    );
  }, []);

  // Countdown timer to midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // Next midnight

      const timeDiff = midnight.getTime() - now.getTime();
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeUntilMidnight(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-generate quests if none available
  useEffect(() => {
    if (questSystemData && userData) {
      const wasGenerated = QuestEngine.autoGenerateQuestsIfNeeded(questSystemData);
      if (wasGenerated) {
        console.log('🎯 Auto-generated quests for empty quest list');
        updateUserData({
          ...userData,
          questSystemData,
        });
      }
    }
  }, [questSystemData, userData, updateUserData]);

  // Handle scroll for header hiding
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);



  const completeQuest = async (questId: string) => {
    console.log('🎯 Complete quest function called for:', questId);

    if (!questSystemData || !userData) {
      console.error('❌ Missing data:', { questSystemData: !!questSystemData, userData: !!userData });
      alert('Missing quest data or user data');
      return;
    }

    // Check if quest exists and is active
    const questToComplete = questSystemData.currentQuests.find(q => q.id === questId);
    if (!questToComplete) {
      console.error('❌ Quest not found:', questId);
      alert('Quest not found');
      return;
    }

    if (questToComplete.status !== 'active') {
      console.log('❌ Quest not active:', questToComplete.status);
      alert('Quest is not active');
      return;
    }

    console.log('✅ Quest found and active, proceeding with completion');

    // Create a deep copy of questSystemData to avoid mutations
    const questSystemDataCopy = JSON.parse(JSON.stringify(questSystemData));

    const result = QuestEngine.completeQuest(questId, questSystemDataCopy);
    if (!result) {
      console.error('❌ QuestEngine.completeQuest failed');
      alert('Failed to complete quest');
      return;
    }

    const { updatedQuest, newLevel, xpGained } = result;
    console.log('✅ Quest completed successfully:', { xpGained, newLevel });

    // Check for new achievements
    const newAchievements = checkQuestAchievements(questSystemDataCopy, userData.achievements || []);
    const updatedAchievements = [
      ...(userData.achievements || []),
      ...newAchievements.map(a => ({ id: a.id, earnedAt: a.earnedAt! })),
    ];

    // Update local state immediately for instant UI feedback
    setLocalQuestData(questSystemDataCopy);

    try {
      // Update user data with proper error handling
      await updateUserData({
        ...userData,
        questSystemData: questSystemDataCopy,
        achievements: updatedAchievements,
      });
      console.log('✅ Quest completion saved to storage');
    } catch (error) {
      console.error('❌ Failed to save quest completion:', error);
      // Revert local state if save failed
      setLocalQuestData(questSystemData);
      alert('Failed to save quest completion');
      return;
    }

    // Show level up dialog if applicable
    if (newLevel) {
      setLevelUpDialog({ isOpen: true, newLevel });
    }

    console.log(`🎉 Quest completed! Gained ${xpGained} XP${newLevel ? `, leveled up to ${newLevel}!` : ''}`);
    if (newAchievements.length > 0) {
      console.log('🏆 New achievements earned:', newAchievements.map(a => a.title));
    }
  };

  const regenerateQuest = async (questId: string) => {
    if (!questSystemData || !userData) return;

    const questToRegenerate = currentQuests.find(q => q.id === questId);
    if (!questToRegenerate) return;

    const newQuest = QuestEngine.regenerateQuest(questToRegenerate, questSystemData, isDevMode);
    if (!newQuest) {
      console.log('Cannot regenerate quest - maximum regenerations reached or no alternatives available');
      return;
    }

    // Replace the quest in the current quests array
    const questIndex = questSystemData.currentQuests.findIndex(q => q.id === questId);
    if (questIndex !== -1) {
      questSystemData.currentQuests[questIndex] = newQuest;
    }

    // Update local state immediately
    setLocalQuestData({...questSystemData});

    // Update user data
    await updateUserData({
      ...userData,
      questSystemData,
    });

    console.log('Quest regenerated successfully');
  };

  const regenerateAllQuests = async () => {
    if (!questSystemData || !userData) return;

    console.log('🔄 Regenerating all active quests with randomized difficulty...');

    // Get active and completed quests separately
    const activeQuests = questSystemData.currentQuests.filter(q => q.status === 'active');
    const completedQuests = questSystemData.currentQuests.filter(q => q.status === 'completed');

    if (activeQuests.length === 0) {
      console.log('No active quests to regenerate');
      return;
    }

    // Increment regeneration count for each active quest that's being replaced
    // (this represents the cost of using "regenerate all")
    activeQuests.forEach(quest => {
      if (!isDevMode) {
        quest.regenerationsUsed = Math.min(quest.regenerationsUsed + 1, 3);
      }
    });

    // Archive the active quests to history
    questSystemData.questHistory.push(...activeQuests);

    // Generate new quests to replace only the active ones
    const numQuestsToGenerate = activeQuests.length;
    const preferences = questSystemData.questPreferences;
    const today = new Date();

    // Get recent template IDs to avoid repetition
    const recentTemplateIds = questSystemData.questHistory
      .filter(quest => {
        const questDate = new Date(quest.dateAssigned);
        const daysDiff = Math.floor((today.getTime() - questDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff <= 7;
      })
      .map(quest => quest.templateId);

    // Generate difficulties with constraints
    const difficulties: QuestDifficulty[] = [];
    if (numQuestsToGenerate >= 2) {
      // Ensure at least one hard/very hard quest
      const hardQuests: QuestDifficulty[] = ['hard', 'very_hard'];
      difficulties.push(hardQuests[Math.floor(Math.random() * hardQuests.length)]);

      // Ensure at least one easy/moderate quest
      const easyQuests: QuestDifficulty[] = ['easy', 'moderate'];
      difficulties.push(easyQuests[Math.floor(Math.random() * easyQuests.length)]);

      // Fill remaining with random difficulties
      const allDifficulties: QuestDifficulty[] = ['easy', 'moderate', 'hard', 'very_hard'];
      for (let i = 2; i < numQuestsToGenerate; i++) {
        difficulties.push(allDifficulties[Math.floor(Math.random() * allDifficulties.length)]);
      }
    } else {
      // If only one quest, make it random
      const allDifficulties: QuestDifficulty[] = ['easy', 'moderate', 'hard', 'very_hard'];
      difficulties.push(allDifficulties[Math.floor(Math.random() * allDifficulties.length)]);
    }

    const newQuests: DailyQuest[] = [];
    const usedTemplateIds: string[] = [];

    for (let i = 0; i < numQuestsToGenerate; i++) {
      const difficulty = difficulties[i];
      const excludeIds = [...recentTemplateIds, ...usedTemplateIds];

      // Try quest library first
      let template = getRandomQuest(
        difficulty,
        excludeIds,
        preferences.preferredCategories
      );

      // Fallback to original templates if needed
      if (!template) {
        template = getRandomQuestTemplate(
          difficulty,
          excludeIds,
          preferences.preferredCategories
        );
      }

      if (template) {
        const quest: DailyQuest = {
          id: `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          templateId: template.id,
          title: template.title,
          description: template.description,
          category: template.category,
          difficulty: template.difficulty,
          xpReward: template.xpReward,
          icon: template.icon,
          estimatedTime: template.estimatedTime,
          status: 'active',
          dateAssigned: today,
          regenerationsUsed: 0,
          isRegenerated: true,
        };

        newQuests.push(quest);
        usedTemplateIds.push(template.id);
      }
    }

    // Combine completed quests with newly generated active quests
    questSystemData.currentQuests = [...completedQuests, ...newQuests];
    questSystemData.lastQuestGeneration = new Date();

    // Update local state immediately
    setLocalQuestData({...questSystemData});

    await updateUserData({
      ...userData,
      questSystemData,
    });

    console.log(`✅ ${numQuestsToGenerate} active quests regenerated successfully`);
  };

  const skipQuest = async (questId: string) => {
    if (!questSystemData || !userData) return;

    const questIndex = questSystemData.currentQuests.findIndex(q => q.id === questId);
    if (questIndex === -1) return;

    questSystemData.currentQuests[questIndex].status = 'skipped';

    // Update local state immediately
    setLocalQuestData({...questSystemData});

    await updateUserData({
      ...userData,
      questSystemData,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-x-hidden">
      {/* Header */}
      <header
        className={`border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 transition-transform duration-300 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-2 sm:px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Quest Mode
                </h1>
                <p className="text-sm text-muted-foreground">
                  Level up your life through daily quests
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Quest Mode
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Countdown Timer */}
              <div className="flex items-center space-x-2 bg-destructive/10 rounded-xl px-3 py-2">
                <Clock className="h-4 w-4 text-destructive" />
                <div className="text-center">
                  <div className="text-sm font-mono font-bold text-destructive">{timeUntilMidnight}</div>
                  <div className="text-xs text-muted-foreground">until new quests</div>
                </div>
              </div>

              {/* Level Display */}
              <div className="hidden sm:flex items-center space-x-2 bg-primary/10 rounded-xl px-3 py-2">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Level {userLevel.currentLevel}</span>
              </div>


              
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.photoURL}
                        alt={user?.displayName}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.displayName?.charAt(0)?.toUpperCase() ||
                          user?.email?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.displayName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        Level {userLevel.currentLevel} • {userLevel.totalXP} XP
                      </p>
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
                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-destructive focus:text-destructive"
                  >
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

        {/* Level Progress */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Star className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Level {userLevel.currentLevel}</h3>
                  <p className="text-sm text-muted-foreground">
                    {userLevel.currentXP} / {userLevel.currentXP + userLevel.xpToNextLevel} XP
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">
                {userLevel.totalXP} Total XP
              </Badge>
            </div>
            <Progress 
              value={(userLevel.currentXP / (userLevel.currentXP + userLevel.xpToNextLevel)) * 100} 
              className="h-3" 
            />
            <p className="text-xs text-muted-foreground mt-2">
              {userLevel.xpToNextLevel} XP to next level
            </p>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{activeQuests}</p>
                  <p className="text-xs text-muted-foreground">Active Quests</p>
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
                  <p className="text-2xl font-bold">{weeklyStats.streak}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-2xl font-bold">{weeklyStats.questsCompleted}</p>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="quests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 rounded-xl">
            <TabsTrigger value="quests" className="rounded-lg">
              Daily Quests
            </TabsTrigger>
            <TabsTrigger value="achievements" className="rounded-lg">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="progress" className="rounded-lg">
              Progress
            </TabsTrigger>
          </TabsList>

          {/* Daily Quests Tab */}
          <TabsContent value="quests" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Today's Quests</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{completedToday}/3 completed</Badge>
                {(isDevMode || currentQuests.every(q => q.status !== 'active')) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={regenerateAllQuests}
                    className="rounded-lg"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Regenerate All
                  </Button>
                )}
              </div>
            </div>

            {/* Active Quests */}
            <div className="grid gap-4">
              {currentQuests.filter(q => q.status === 'active').map((quest) => (
                <Card
                  key={quest.id}
                  className={`rounded-xl border-l-4 transition-all duration-200 ${getDifficultyBorder(quest.difficulty)} ${
                    quest.status === 'completed' ? 'opacity-75 bg-muted/50' : 'hover:shadow-md'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{quest.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{quest.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className={getDifficultyColor(quest.difficulty)}>
                              {quest.difficulty.replace('_', ' ')} • {quest.xpReward} XP
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {quest.estimatedTime}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {quest.status === 'completed' && (
                        <CheckCircle2 className="h-6 w-6 text-success" />
                      )}
                    </div>
                    <CardDescription>{quest.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {quest.status === 'active' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="flex-1 rounded-lg"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('🎯 Button clicked for quest:', quest.id);
                            completeQuest(quest.id);
                          }}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Complete Quest
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => regenerateQuest(quest.id)}
                          disabled={!isDevMode && quest.regenerationsUsed >= 3}
                          className="rounded-lg"
                          title={isDevMode ? "Infinite regenerations (Dev Mode)" : `${3 - quest.regenerationsUsed} regenerations left`}
                        >
                          <RefreshCw className="h-4 w-4" />
                          {isDevMode && <span className="ml-1 text-xs">∞</span>}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-lg text-muted-foreground hover:text-destructive"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Skip Quest</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to skip "{quest.title}"? You won't earn any XP for skipped quests.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => skipQuest(quest.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Skip Quest
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                    {quest.status === 'completed' && quest.dateCompleted && (
                      <div className="text-sm text-muted-foreground">
                        Completed at {new Date(quest.dateCompleted).toLocaleTimeString()}
                      </div>
                    )}
                    {quest.regenerationsUsed > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Regenerated {quest.regenerationsUsed}{isDevMode ? '' : '/3'} times{isDevMode ? ' (∞ available)' : ''}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Completed Quests (shown below active ones) */}
            {currentQuests.filter(q => q.status === 'completed').length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-muted-foreground">Completed Today</h3>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    {currentQuests.filter(q => q.status === 'completed').length} completed
                  </Badge>
                </div>
                <div className="grid gap-4">
                  {currentQuests.filter(q => q.status === 'completed').map((quest) => (
                    <Card
                      key={quest.id}
                      className={`rounded-xl border-l-4 transition-all duration-200 ${getDifficultyBorder(quest.difficulty)} opacity-75 bg-success/5`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{quest.icon}</span>
                            <div>
                              <CardTitle className="text-lg line-through text-muted-foreground">{quest.title}</CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className={getDifficultyColor(quest.difficulty)}>
                                  {quest.difficulty.replace('_', ' ')} • {quest.xpReward} XP
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {quest.estimatedTime}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <CheckCircle2 className="h-6 w-6 text-success" />
                        </div>
                        <CardDescription className="text-muted-foreground">{quest.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {quest.dateCompleted && (
                          <div className="text-sm text-success font-medium">
                            ✅ Completed at {new Date(quest.dateCompleted).toLocaleTimeString()}
                          </div>
                        )}
                        {quest.regenerationsUsed > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Regenerated {quest.regenerationsUsed}{isDevMode ? '' : '/3'} times{isDevMode ? ' (∞ available)' : ''}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {currentQuests.length === 0 && (
              <Card className="rounded-xl border-dashed border-2">
                <CardContent className="p-12 text-center">
                  <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">
                    No quests available
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    New quests will be generated daily. Check back tomorrow!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Achievements</h2>
              <Badge variant="secondary">
                {getEarnedQuestAchievements(userData?.achievements || []).length} earned
              </Badge>
            </div>

            {(() => {
              const earnedAchievements = getEarnedQuestAchievements(userData?.achievements || []);

              if (earnedAchievements.length === 0) {
                return (
                  <Card className="rounded-xl border-dashed border-2">
                    <CardContent className="p-12 text-center">
                      <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-semibold mb-2">
                        No achievements yet
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Complete quests, level up, and build streaks to earn achievements!
                      </p>
                    </CardContent>
                  </Card>
                );
              }

              return (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {earnedAchievements.map((achievement) => (
                    <Card
                      key={achievement.id}
                      className={`rounded-xl border-2 ${getRarityBorder(achievement.rarity)}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h3
                              className={`font-semibold ${getRarityColor(achievement.rarity)}`}
                            >
                              {achievement.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <Badge
                            variant="outline"
                            className={`capitalize ${getRarityColor(achievement.rarity)}`}
                          >
                            {achievement.rarity}
                          </Badge>
                          <span>
                            {achievement.earnedAt
                              ? new Date(achievement.earnedAt).toLocaleDateString()
                              : "Recently earned"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              );
            })()}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-4">
            <h2 className="text-xl font-semibold">Your Progress</h2>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Weekly Summary */}
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-info" />
                    <span>This Week</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Quests completed</span>
                      <span className="text-sm font-medium">{weeklyStats.questsCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">XP earned</span>
                      <span className="text-sm font-medium">{weeklyStats.totalXPEarned}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Current streak</span>
                      <span className="text-sm font-medium">{weeklyStats.streak} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Level Progress Detail */}
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-primary" />
                    <span>Level Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {userLevel.currentLevel}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {userLevel.totalXP} Total XP
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Level {userLevel.currentLevel + 1}</span>
                      <span>{userLevel.currentXP} / {userLevel.currentXP + userLevel.xpToNextLevel}</span>
                    </div>
                    <Progress 
                      value={(userLevel.currentXP / (userLevel.currentXP + userLevel.xpToNextLevel)) * 100} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Level Up Dialog */}
      <Dialog
        open={levelUpDialog.isOpen}
        onOpenChange={(open) => !open && setLevelUpDialog({ isOpen: false })}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">🎉 Level Up!</DialogTitle>
            <DialogDescription className="text-center">
              Congratulations! You've reached level {levelUpDialog.newLevel}!
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="text-6xl font-bold text-primary mb-4">
              {levelUpDialog.newLevel}
            </div>
            <p className="text-lg font-semibold mb-2">
              You're getting stronger!
            </p>
            <p className="text-sm text-muted-foreground">
              Keep completing quests to unlock more achievements and reach even higher levels.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setLevelUpDialog({ isOpen: false })}
              className="w-full"
            >
              Continue Your Journey
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
