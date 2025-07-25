import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Target, Plus, Trophy, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Target!',
    description: 'Your personal goal achievement companion',
    icon: Target,
    content: (
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">🎯</div>
        <p>
          Target helps you build lasting habits, break addictions, and track your discipline journey. 
          Let's take a quick tour to get you started!
        </p>
      </div>
    )
  },
  {
    id: 'goals',
    title: 'Managing Your Goals',
    description: 'Create, track, and complete your goals',
    icon: Plus,
    content: (
      <div className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">✨ How Goals Work:</h4>
          <ul className="text-sm space-y-1">
            <li>• Each goal has a target number of days to complete</li>
            <li>• Click "Complete" once per day when you finish the task</li>
            <li>• Build streaks by completing goals consistently</li>
            <li>• When completed, goals restart with a higher target</li>
          </ul>
        </div>
        <div className="bg-primary/10 p-4 rounded-lg">
          <p className="text-sm">
            <strong>💡 Pro Tip:</strong> Start with small, achievable goals to build momentum!
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'recovery',
    title: 'Recovery Tracking',
    description: 'Break habits and track your progress',
    icon: CheckCircle2,
    content: (
      <div className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">🌟 Recovery Features:</h4>
          <ul className="text-sm space-y-1">
            <li>• Track clean days for habits you want to break</li>
            <li>• Log one clean day per calendar day</li>
            <li>• View your triggers to understand patterns</li>
            <li>• Celebrate milestones and longest streaks</li>
          </ul>
        </div>
        <div className="bg-success/10 p-4 rounded-lg">
          <p className="text-sm">
            <strong>💚 Remember:</strong> Recovery is a journey. Every day counts, and setbacks are part of the process.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'discipline',
    title: 'Discipline Ranking',
    description: 'Track your overall discipline level',
    icon: Zap,
    content: (
      <div className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">📊 Your Discipline Rank:</h4>
          <ul className="text-sm space-y-1">
            <li>• Ranks from F- to A+ based on your habits</li>
            <li>• Improves with goal completions and consistency</li>
            <li>• Visible in your profile and stats</li>
            <li>• Shows your overall discipline development</li>
          </ul>
        </div>
        <div className="flex items-center justify-center space-x-2 p-4 bg-primary/10 rounded-lg">
          <span className="text-2xl">⚡</span>
          <span className="font-semibold">Keep completing goals to improve your rank!</span>
        </div>
      </div>
    )
  },
  {
    id: 'achievements',
    title: 'Achievements & Rewards',
    description: 'Unlock achievements as you progress',
    icon: Trophy,
    content: (
      <div className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">🏆 Achievement System:</h4>
          <ul className="text-sm space-y-1">
            <li>• Earn achievements for milestones and consistency</li>
            <li>• Four rarity levels: Common, Rare, Epic, Legendary</li>
            <li>• View all earned achievements in the Achievements tab</li>
            <li>• Share your progress with friends</li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-center">
            <span className="text-gray-600 dark:text-gray-400">Common</span>
          </div>
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded text-center">
            <span className="text-blue-600 dark:text-blue-400">Rare</span>
          </div>
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded text-center">
            <span className="text-purple-600 dark:text-purple-400">Epic</span>
          </div>
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded text-center">
            <span className="text-yellow-600 dark:text-yellow-400">Legendary</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'tips',
    title: 'Success Tips',
    description: 'Make the most of your Target journey',
    icon: Target,
    content: (
      <div className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">🚀 Tips for Success:</h4>
          <ul className="text-sm space-y-1">
            <li>• Start small and be consistent rather than ambitious</li>
            <li>• Check in daily to maintain your streaks</li>
            <li>• Use the motivational quotes for inspiration</li>
            <li>• Track your discipline rank improvement over time</li>
            <li>• Share your achievements to stay motivated</li>
          </ul>
        </div>
        <div className="text-center p-4 bg-primary/10 rounded-lg">
          <p className="font-semibold mb-2">🎯 Ready to start your journey?</p>
          <p className="text-sm text-muted-foreground">
            You're all set! Click "Get Started" to begin building better habits today.
          </p>
        </div>
      </div>
    )
  }
];

interface TutorialProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function Tutorial({ isOpen, onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;
  const step = tutorialSteps[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl rounded-xl shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">
              Step {currentStep + 1} of {tutorialSteps.length}
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Progress value={progress} className="h-2 mb-4" />
          
          <div className="h-16 w-16 mx-auto rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center mb-4">
            <StepIcon className="h-8 w-8 text-white" />
          </div>
          
          <CardTitle className="text-2xl">{step.title}</CardTitle>
          <CardDescription className="text-lg">{step.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="min-h-[200px]">
            {step.content}
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="rounded-lg"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex space-x-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            <Button onClick={handleNext} className="rounded-lg">
              {currentStep === tutorialSteps.length - 1 ? (
                <>
                  Get Started
                  <Target className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
