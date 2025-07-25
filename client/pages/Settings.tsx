import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, User, Shield, Bell, Palette, LogOut, RotateCcw, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Settings() {
  const navigate = useNavigate();
  const { user, userData, updateUserData, signOut } = useAuth();
  const { theme } = useTheme();
  
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [profileImage, setProfileImage] = useState(user?.photoURL || "");
  const [showGoals, setShowGoals] = useState(userData?.privacy?.showGoals ?? true);
  const [showRecoveries, setShowRecoveries] = useState(userData?.privacy?.showRecoveries ?? false);
  const [profileVisibility, setProfileVisibility] = useState(userData?.privacy?.profileVisibility || "private");
  const [notifications, setNotifications] = useState(userData?.preferences?.notifications ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`;
  };

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserData({
        ...userData,
        privacy: {
          showGoals,
          showRecoveries,
          profileVisibility: profileVisibility as 'public' | 'private'
        },
        preferences: {
          ...userData?.preferences,
          notifications
        }
      });
      
      // Note: In a real app, you would also update the user's profile information
      // This would require backend API calls to update name and profile picture
      
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className={`border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
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
                <h1 className="text-xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground">Customize your Target experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-lg"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        {/* Profile Settings */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
            <CardDescription>
              Update your display name and profile picture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileImage} alt={displayName} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <Label htmlFor="picture">Profile Picture</Label>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('picture')?.click()}
                    className="rounded-lg"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setProfileImage(generateAvatarUrl(displayName))}
                    className="rounded-lg"
                  >
                    Generate Avatar
                  </Button>
                </div>
                <input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  Upload a custom image or generate an avatar from your name
                </p>
              </div>
            </div>
            
            <Separator />
            
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="rounded-lg"
              />
              <p className="text-xs text-muted-foreground">
                This name will be visible to others if your profile is public
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Privacy Settings</span>
            </CardTitle>
            <CardDescription>
              Control what information is visible to others
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Visibility */}
            <div className="space-y-2">
              <Label htmlFor="profileVisibility">Profile Visibility</Label>
              <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private - Only visible to you</SelectItem>
                  <SelectItem value="public">Public - Visible to others when shared</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Private profiles can still be shared manually via the share button
              </p>
            </div>
            
            <Separator />
            
            {/* Goals Visibility */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showGoals">Show Goals</Label>
                <p className="text-xs text-muted-foreground">
                  Display your current goals on your profile
                </p>
              </div>
              <Switch
                id="showGoals"
                checked={showGoals}
                onCheckedChange={setShowGoals}
              />
            </div>
            
            {/* Recovery Visibility */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showRecoveries">Show Recovery Progress</Label>
                <p className="text-xs text-muted-foreground">
                  Display your addiction recovery tracking (sensitive information)
                </p>
              </div>
              <Switch
                id="showRecoveries"
                checked={showRecoveries}
                onCheckedChange={setShowRecoveries}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive reminders and encouragement messages
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Appearance</span>
            </CardTitle>
            <CardDescription>
              Customize the look and feel of Target
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-xs text-muted-foreground">
                  Choose your preferred color scheme
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="rounded-xl border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Dangerous Actions</CardTitle>
            <CardDescription>
              These actions cannot be undone. Please proceed with caution.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <GoalResetDialog />
            <DeleteAccountDialog />
            <Button
              variant="outline"
              onClick={signOut}
              className="w-full rounded-lg border-muted text-muted-foreground hover:bg-muted/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
