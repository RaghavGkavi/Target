import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Zap,
  Heart,
  Star,
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { QuestEngine, DEFAULT_QUEST_PREFERENCES } from "@/lib/questEngine";
import { QuestCategory, QuestPreferences, DEFAULT_DIFFICULTY_DISTRIBUTION } from "@shared/quest-types";

interface QuestCategoryOption {
  id: QuestCategory;
  name: string;
  description: string;
  icon: string;
  examples: string[];
}

const questCategories: QuestCategoryOption[] = [
  {
    id: "health",
    name: "Health & Wellness",
    description: "Focus on physical and mental well-being",
    icon: "🧘‍♀️",
    examples: ["Drink water", "Healthy meals", "Track nutrients"],
  },
  {
    id: "fitness",
    name: "Fitness",
    description: "Physical exercise and activity goals",
    icon: "💪",
    examples: ["Workout sessions", "Running", "Strength training"],
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    description: "Mental clarity and spiritual growth",
    icon: "🧠",
    examples: ["Meditation", "Gratitude practice", "Mindful breathing"],
  },
  {
    id: "learning",
    name: "Learning",
    description: "Skill development and education",
    icon: "📚",
    examples: ["Read books", "Online courses", "Language learning"],
  },
  {
    id: "productivity",
    name: "Productivity",
    description: "Efficiency and organization",
    icon: "⚡",
    examples: ["Deep work", "Organization", "Time management"],
  },
  {
    id: "career",
    name: "Career",
    description: "Professional development",
    icon: "💼",
    examples: ["Networking", "Skill building", "Project work"],
  },
  {
    id: "creativity",
    name: "Creativity",
    description: "Artistic and creative pursuits",
    icon: "🎨",
    examples: ["Drawing", "Writing", "Music creation"],
  },
  {
    id: "social",
    name: "Social",
    description: "Relationships and connections",
    icon: "👥",
    examples: ["Call friends", "Social events", "Community involvement"],
  },
  {
    id: "recovery",
    name: "Recovery",
    description: "Breaking habits and addictions",
    icon: "🎯",
    examples: ["Digital detox", "Avoiding triggers", "Healthy alternatives"],
  },
];

export default function QuestOnboarding() {
  const navigate = useNavigate();
  const { user, updateUserData } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<QuestCategory[]>([]);
  const [difficultyBalance, setDifficultyBalance] = useState(DEFAULT_DIFFICULTY_DISTRIBUTION);
  const [timePreference, setTimePreference] = useState<'short' | 'medium' | 'long' | 'mixed'>('mixed');

  const totalSteps = 4;

  const toggleCategorySelection = (categoryId: QuestCategory) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else if (prev.length < 6) {
        return [...prev, categoryId];
      }
      return prev;
    });
  };

  const completeOnboarding = async () => {
    const questPreferences: QuestPreferences = {
      preferredCategories: selectedCategories.length > 0 ? selectedCategories : ['health', 'fitness', 'personal', 'productivity'],
      difficultyBalance,
      timePreference,
    };

    // Initialize quest system
    const questSystemData = QuestEngine.initializeQuestSystem(questPreferences);

    // Update user data to enable quest system
    await updateUserData({
      preferences: {
        theme: "system",
        notifications: true,
        onboardingCompleted: true,
        useQuestSystem: true, // Enable quest mode
      },
      questSystemData,
      goals: [], // Clear goals since we're using quest system
      addictions: [], // Clear addictions - recovery tracked through quests
      completedGoals: [],
    });

    navigate("/");
  };

  const renderCategorySelection = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="h-16 w-16 mx-auto rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
          <Target className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Choose Your Quest Categories</h1>
          <p className="text-muted-foreground">
            Select up to 6 categories that interest you most. This helps us generate personalized daily quests.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {questCategories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          const canSelect = selectedCategories.length < 6 || isSelected;

          return (
            <button
              key={category.id}
              onClick={() => toggleCategorySelection(category.id)}
              disabled={!canSelect}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left w-full ${
                isSelected
                  ? "border-primary bg-primary/10 scale-[1.02]"
                  : canSelect
                    ? "border-border hover:border-primary/50 hover:bg-muted/50"
                    : "border-border bg-muted/30 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl mt-1">{category.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{category.name}</h3>
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {category.examples.map((example, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Selected: {selectedCategories.length}/6 categories
      </div>
    </div>
  );

  const renderDifficultyBalance = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="h-16 w-16 mx-auto rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
          <Settings className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Difficulty Preferences</h1>
          <p className="text-muted-foreground">
            Customize how challenging you want your daily quests to be. You'll get 3 quests per day.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Easy Quests */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <h3 className="font-semibold">Easy Quests (5 XP)</h3>
                    <p className="text-sm text-muted-foreground">
                      Quick, simple tasks that build habits
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{Math.round(difficultyBalance.easy * 100)}%</Badge>
              </div>
              <Slider
                value={[difficultyBalance.easy * 100]}
                onValueChange={([value]) => {
                  const newEasy = value / 100;
                  setDifficultyBalance(prev => ({ ...prev, easy: newEasy }));
                }}
                max={80}
                min={10}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Examples: Drink 8 glasses of water, 10-minute walk, write 3 gratitudes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Moderate Quests */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h3 className="font-semibold">Moderate Quests (10 XP)</h3>
                    <p className="text-sm text-muted-foreground">
                      Balanced challenges for steady growth
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{Math.round(difficultyBalance.moderate * 100)}%</Badge>
              </div>
              <Slider
                value={[difficultyBalance.moderate * 100]}
                onValueChange={([value]) => {
                  const newModerate = value / 100;
                  setDifficultyBalance(prev => ({ ...prev, moderate: newModerate }));
                }}
                max={60}
                min={15}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Examples: 30-minute workout, 15-minute meditation, learn new skill
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Hard Quests */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">💪</span>
                  <div>
                    <h3 className="font-semibold">Hard Quests (20 XP)</h3>
                    <p className="text-sm text-muted-foreground">
                      Significant challenges for major progress
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{Math.round(difficultyBalance.hard * 100)}%</Badge>
              </div>
              <Slider
                value={[difficultyBalance.hard * 100]}
                onValueChange={([value]) => {
                  const newHard = value / 100;
                  setDifficultyBalance(prev => ({ ...prev, hard: newHard }));
                }}
                max={40}
                min={5}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Examples: 45-minute intense workout, complete course chapter, deep work session
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Very Hard Quests */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <h3 className="font-semibold">Very Hard Quests (30 XP)</h3>
                    <p className="text-sm text-muted-foreground">
                      Epic challenges for breakthrough moments
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{Math.round(difficultyBalance.very_hard * 100)}%</Badge>
              </div>
              <Slider
                value={[difficultyBalance.very_hard * 100]}
                onValueChange={([value]) => {
                  const newVeryHard = value / 100;
                  setDifficultyBalance(prev => ({ ...prev, very_hard: newVeryHard }));
                }}
                max={25}
                min={0}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Examples: Marathon training, master complex topic, complete major project
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm">
          💡 <strong>Tip:</strong> Start with more easy and moderate quests, then increase difficulty as you build consistency!
        </p>
      </div>
    </div>
  );

  const renderTimePreference = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="h-16 w-16 mx-auto rounded-xl bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
          <Star className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Time Preferences</h1>
          <p className="text-muted-foreground">
            How much time do you typically want to spend on quests?
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {[
          {
            id: 'short',
            title: 'Short & Sweet',
            description: 'Quick tasks under 30 minutes',
            icon: '⚡',
            examples: ['5-15 minute activities', 'Easy to fit in busy schedules'],
          },
          {
            id: 'medium',
            title: 'Balanced',
            description: 'Mix of quick and longer activities',
            icon: '⚖️',
            examples: ['15-60 minute activities', 'Balanced approach'],
          },
          {
            id: 'long',
            title: 'Deep Dive',
            description: 'Longer, more immersive challenges',
            icon: '🏊‍♂️',
            examples: ['1+ hour activities', 'Substantial commitments'],
          },
          {
            id: 'mixed',
            title: 'Variety Pack',
            description: 'All types for maximum flexibility',
            icon: '🎲',
            examples: ['Mix of all durations', 'Keeps things interesting'],
          },
        ].map((option) => {
          const isSelected = timePreference === option.id;

          return (
            <button
              key={option.id}
              onClick={() => setTimePreference(option.id as any)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left w-full ${
                isSelected
                  ? "border-primary bg-primary/10 scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{option.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{option.title}</h3>
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {option.description}
                  </p>
                  <div className="space-y-1">
                    {option.examples.map((example, index) => (
                      <p key={index} className="text-xs text-muted-foreground">
                        • {example}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderCompletionStep = () => (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="h-20 w-20 mx-auto rounded-xl bg-gradient-to-r from-success to-primary flex items-center justify-center">
          <Zap className="h-10 w-10 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Ready for Your Quest Adventure!</h1>
          <p className="text-muted-foreground">
            Your personalized quest system is ready. Let's start your journey to greatness!
          </p>
        </div>
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Your Quest Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedCategories.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Preferred Categories:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((categoryId) => {
                  const category = questCategories.find(c => c.id === categoryId);
                  return (
                    <Badge key={categoryId} variant="secondary">
                      {category?.icon} {category?.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">Difficulty Balance:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Easy:</span>
                <span>{Math.round(difficultyBalance.easy * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Moderate:</span>
                <span>{Math.round(difficultyBalance.moderate * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Hard:</span>
                <span>{Math.round(difficultyBalance.hard * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Very Hard:</span>
                <span>{Math.round(difficultyBalance.very_hard * 100)}%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Time Preference:</h4>
            <Badge variant="outline" className="capitalize">
              {timePreference.replace('_', ' ')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="bg-primary/10 rounded-lg p-4">
        <p className="text-sm">
          🎯 <strong>What's Next:</strong> You'll get 3 new quests every day. Complete them to earn XP, level up, and unlock achievements!
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        {/* Content Card */}
        <Card className="rounded-xl border-0 shadow-lg">
          <CardContent className="p-6">
            {currentStep === 1 && renderCategorySelection()}
            {currentStep === 2 && renderDifficultyBalance()}
            {currentStep === 3 && renderTimePreference()}
            {currentStep === 4 && renderCompletionStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="rounded-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="rounded-lg"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={completeOnboarding} className="rounded-lg">
              <Zap className="h-4 w-4 mr-2" />
              Start My Quest Journey
            </Button>
          )}
        </div>

        {/* Skip Option */}
        {currentStep < totalSteps && (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep(totalSteps)}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip to finish
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
