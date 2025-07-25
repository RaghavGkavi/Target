import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Copy, Check, Trophy, Target, Calendar, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { getDisciplineRankInfo } from "@/lib/disciplineRanking";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Profile() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = async () => {
    const shareText = `Check out my progress on Target! I'm currently rank ${userData?.disciplineData?.currentRank} with ${userData?.goals?.filter(g => !g.isCompleted).length} active goals. Join me in building better habits!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Target Progress',
          text: shareText,
          url: window.location.origin
        });
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const activeGoals = userData?.goals?.filter(g => !g.isCompleted) || [];
  const completedCycles = userData?.completedGoals?.reduce((sum, goal) => sum + (goal.completedCount || 0), 0) || 0;
  const totalStreak = activeGoals.reduce((sum, goal) => sum + (goal.streak || 0), 0);
  const avgProgress = activeGoals.length > 0 ? activeGoals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / activeGoals.length : 0;

  const rankInfo = userData?.disciplineData ? getDisciplineRankInfo(userData.disciplineData.currentRank) : null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fitness": return "🏃‍♂️";
      case "health": return "🧘‍♀️";
      case "personal": return "📚";
      case "career": return "💼";
      case "addiction": return "🎯";
      default: return "⭐";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/")}
                className="rounded-lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">Profile</h1>
                <p className="text-sm text-muted-foreground">Your progress and achievements</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button 
                onClick={handleShare}
                variant="outline"
                className="rounded-lg"
              >
                {copySuccess ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        {/* Profile Header */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.photoURL} alt={user?.displayName} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{user?.displayName}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Member since {new Date(user?.createdAt || '').toLocaleDateString()}
                </p>
              </div>

              {/* Discipline Rank Display */}
              {rankInfo && (
                <div className="text-center">
                  <div className={`text-4xl font-bold ${rankInfo.color} mb-2`}>
                    {userData?.disciplineData?.currentRank}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-lg">{rankInfo.emoji}</span>
                    <span className="font-medium text-sm">{rankInfo.description}</span>
                  </div>
                </div>
              )}
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
                  <p className="text-2xl font-bold">{activeGoals.length}</p>
                  <p className="text-xs text-muted-foreground">Active Goals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-2xl font-bold">{completedCycles}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
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
                <Calendar className="h-5 w-5 text-info" />
                <div>
                  <p className="text-2xl font-bold">{Math.round(avgProgress)}%</p>
                  <p className="text-xs text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Goals */}
        {userData?.privacy?.showGoals && activeGoals.length > 0 && (
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Current Goals</CardTitle>
              <CardDescription>
                My active goals and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {activeGoals.map((goal) => (
                  <Card key={goal.id} className="rounded-lg border-l-4" style={{ borderLeftColor: goal.color?.replace('bg-', '#') || '#6366f1' }}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getCategoryIcon(goal.category)}</span>
                          <h3 className="font-semibold">{goal.title}</h3>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Flame className="h-3 w-3 mr-1" />
                          {goal.streak}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{goal.daysCompleted}/{goal.targetDays} days</span>
                        </div>
                        <Progress value={goal.progress || 0} className="h-2" />
                        <p className="text-xs text-muted-foreground">{Math.round(goal.progress || 0)}% complete</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achievement Highlights */}
        {completedCycles > 0 && (
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Achievement Highlights</CardTitle>
              <CardDescription>
                Milestones and accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-warning/10 rounded-lg">
                  <Trophy className="h-8 w-8 text-warning mx-auto mb-2" />
                  <p className="font-semibold">{completedCycles}</p>
                  <p className="text-sm text-muted-foreground">Goals Completed</p>
                </div>
                
                <div className="text-center p-4 bg-streak/10 rounded-lg">
                  <Flame className="h-8 w-8 text-streak mx-auto mb-2" />
                  <p className="font-semibold">{totalStreak}</p>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                </div>
                
                {rankInfo && (
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl mb-2">{rankInfo.emoji}</div>
                    <p className="font-semibold">{userData?.disciplineData?.currentRank}</p>
                    <p className="text-sm text-muted-foreground">Discipline Rank</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Privacy Notice */}
        {userData?.privacy?.profileVisibility === 'private' && (
          <Card className="rounded-xl border-muted">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 bg-muted-foreground rounded-full"></div>
                <span>Your profile is set to private. Only you can see this information.</span>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
