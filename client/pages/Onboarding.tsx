import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Target, ArrowRight, ArrowLeft, CheckCircle2, Plus, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DISCIPLINE_ASSESSMENT, calculateDisciplineRank, getDisciplineRankInfo } from "@/lib/disciplineRanking";

interface PresetGoal {
  id: string;
  title: string;
  description: string;
  category: "health" | "career" | "personal" | "fitness";
  icon: string;
  color: string;
}

interface PresetAddiction {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const presetGoals: PresetGoal[] = [
  {
    id: "workout",
    title: "Work out more",
    description: "Build a consistent exercise routine",
    category: "fitness",
    icon: "🏃‍♂️",
    color: "bg-green-500"
  },
  {
    id: "read",
    title: "Read more",
    description: "Develop a daily reading habit",
    category: "personal",
    icon: "📚",
    color: "bg-blue-500"
  },
  {
    id: "study",
    title: "Study more",
    description: "Enhance learning and skill development",
    category: "career",
    icon: "📖",
    color: "bg-purple-500"
  },
  {
    id: "productive",
    title: "Be more productive",
    description: "Improve focus and time management",
    category: "career",
    icon: "⚡",
    color: "bg-orange-500"
  },
  {
    id: "relationships",
    title: "Strengthen bonds",
    description: "Build deeper connections with others",
    category: "personal",
    icon: "❤️",
    color: "bg-pink-500"
  }
];

const presetAddictions: PresetAddiction[] = [
  {
    id: "smoking",
    name: "Smoking/Vaping",
    icon: "🚭",
    description: "Quit smoking and vaping habits"
  },
  {
    id: "social_media",
    name: "Social Media",
    icon: "📱",
    description: "Reduce excessive social media usage"
  },
  {
    id: "masturbation",
    name: "Masturbation",
    icon: "🎯",
    description: "Overcome compulsive behaviors"
  },
  {
    id: "drugs",
    name: "Drugs",
    icon: "💊",
    description: "Break free from substance use"
  },
  {
    id: "alcohol",
    name: "Alcohol",
    icon: "🍺",
    description: "Reduce or quit alcohol consumption"
  },
  {
    id: "other",
    name: "Other",
    icon: "❓",
    description: "Custom addiction or habit"
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, updateUserData } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedAddictions, setSelectedAddictions] = useState<string[]>([]);
  const [disciplineAnswers, setDisciplineAnswers] = useState<Record<string, number>>({});

  const toggleGoalSelection = (goalId: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else if (prev.length < 3) {
        return [...prev, goalId];
      }
      return prev;
    });
  };

  const toggleAddictionSelection = (addictionId: string) => {
    setSelectedAddictions(prev => {
      if (prev.includes(addictionId)) {
        return prev.filter(id => id !== addictionId);
      } else {
        return [...prev, addictionId];
      }
    });
  };

  const handleDisciplineAnswer = (questionId: string, points: number) => {
    setDisciplineAnswers(prev => ({
      ...prev,
      [questionId]: points
    }));
  };

  const completeOnboarding = async () => {
    // Calculate discipline base score
    const baseScore = Object.values(disciplineAnswers).reduce((sum, points) => sum + points, 0);

    // Create goals from selected presets
    const goals = selectedGoals.map(goalId => {
      const preset = presetGoals.find(g => g.id === goalId)!;
      return {
        id: `goal_${Date.now()}_${goalId}`,
        title: preset.title,
        description: preset.description,
        category: preset.category,
        progress: 0,
        streak: 0,
        targetDays: 21, // Default 21-day challenge
        daysCompleted: 0,
        isCompleted: false,
        lastUpdated: new Date(),
        color: preset.color
      };
    });

    // Create addictions from selected presets
    const addictions = selectedAddictions.map(addictionId => {
      const preset = presetAddictions.find(a => a.id === addictionId)!;
      return {
        id: `addiction_${Date.now()}_${addictionId}`,
        name: preset.name,
        cleanDays: 0,
        longestStreak: 0,
        triggers: [],
        lastLoggedDate: undefined
      };
    });

    // Calculate initial discipline rank
    const initialRank = calculateDisciplineRank(baseScore, 0, 0, goals, []);

    // Update user data
    await updateUserData({
      goals,
      addictions,
      completedGoals: [],
      disciplineData: {
        baseScore,
        currentRank: initialRank,
        totalCompletions: 0,
        consistencyScore: 0,
        lastUpdated: new Date()
      },
      preferences: {
        theme: 'system',
        notifications: true,
        onboardingCompleted: true
      }
    });

    navigate('/');
  };

  const renderGoalsStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="h-16 w-16 mx-auto rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
          <Target className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Choose Your Goals</h1>
          <p className="text-muted-foreground">
            Select up to 3 goals to get started. You can add more later.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {presetGoals.map((goal) => {
          const isSelected = selectedGoals.includes(goal.id);
          const canSelect = selectedGoals.length < 3 || isSelected;
          
          return (
            <button
              key={goal.id}
              onClick={() => toggleGoalSelection(goal.id)}
              disabled={!canSelect}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left w-full ${
                isSelected
                  ? "border-primary bg-primary/10 scale-[1.02]"
                  : canSelect
                  ? "border-border hover:border-primary/50 hover:bg-muted/50"
                  : "border-border bg-muted/30 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{goal.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
                {isSelected && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-sm">
          <Plus className="h-4 w-4 text-primary" />
          <span>Don't see what you're looking for? You can create custom goals later!</span>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Selected: {selectedGoals.length}/3 goals
      </div>
    </div>
  );

  const renderRecoveryStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="h-16 w-16 mx-auto rounded-xl bg-gradient-to-r from-destructive to-warning flex items-center justify-center">
          <Heart className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Recovery Tracking</h1>
          <p className="text-muted-foreground">
            Select any habits or addictions you want to overcome. This is optional and private.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {presetAddictions.map((addiction) => {
          const isSelected = selectedAddictions.includes(addiction.id);
          
          return (
            <button
              key={addiction.id}
              onClick={() => toggleAddictionSelection(addiction.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left w-full ${
                isSelected
                  ? "border-destructive bg-destructive/10 scale-[1.02]"
                  : "border-border hover:border-destructive/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{addiction.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold">{addiction.name}</h3>
                  <p className="text-sm text-muted-foreground">{addiction.description}</p>
                </div>
                {isSelected && (
                  <CheckCircle2 className="h-5 w-5 text-destructive" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-sm">
          <Plus className="h-4 w-4 text-primary" />
          <span>You can add more recovery trackers or custom ones later. Everything is private and secure.</span>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Selected: {selectedAddictions.length} recovery tracker{selectedAddictions.length !== 1 ? 's' : ''}
      </div>
    </div>
  );

  const renderDisciplineStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="h-16 w-16 mx-auto rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Discipline Assessment</h1>
          <p className="text-muted-foreground">
            Help us understand your current discipline level to provide personalized tracking.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {DISCIPLINE_ASSESSMENT.map((question) => {
          const selectedAnswer = disciplineAnswers[question.id];

          return (
            <Card key={question.id} className="rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg">{question.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === option.points;

                    return (
                      <button
                        key={index}
                        onClick={() => handleDisciplineAnswer(question.id, option.points)}
                        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? "border-primary bg-primary/10 scale-[1.01]"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.text}</span>
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-sm">
          <Zap className="h-4 w-4 text-primary" />
          <span>This assessment helps us calculate your discipline ranking from F- to A+. Your ranking will improve as you complete goals!</span>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Answered: {Object.keys(disciplineAnswers).length}/{DISCIPLINE_ASSESSMENT.length} questions
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
          <h1 className="text-2xl font-bold">You're All Set!</h1>
          <p className="text-muted-foreground">
            Welcome to Target! Let's start building better habits together.
          </p>
        </div>
      </div>

      {selectedGoals.length > 0 && (
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">Your Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedGoals.map(goalId => {
                const goal = presetGoals.find(g => g.id === goalId)!;
                return (
                  <div key={goalId} className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
                    <span className="text-lg">{goal.icon}</span>
                    <span className="font-medium">{goal.title}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedAddictions.length > 0 && (
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">Recovery Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedAddictions.map(addictionId => {
                const addiction = presetAddictions.find(a => a.id === addictionId)!;
                return (
                  <div key={addictionId} className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
                    <span className="text-lg">{addiction.icon}</span>
                    <span className="font-medium">{addiction.name}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-primary/10 rounded-lg p-4">
        <p className="text-sm">
          🎯 <strong>Pro Tip:</strong> Start small and build consistency. You can always add more goals and customize everything once you're in the app!
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
            <span>Step {currentStep} of 4</span>
            <span>{Math.round((currentStep / 4) * 100)}% complete</span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>

        {/* Content Card */}
        <Card className="rounded-xl border-0 shadow-lg">
          <CardContent className="p-6">
            {currentStep === 1 && renderGoalsStep()}
            {currentStep === 2 && renderRecoveryStep()}
            {currentStep === 3 && renderCompletionStep()}
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

          {currentStep < 3 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={currentStep === 1 && selectedGoals.length === 0}
              className="rounded-lg"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={completeOnboarding}
              className="rounded-lg"
            >
              <Zap className="h-4 w-4 mr-2" />
              Start Journey
            </Button>
          )}
        </div>

        {/* Skip Option */}
        {currentStep < 3 && (
          <div className="text-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setCurrentStep(3)}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip for now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
