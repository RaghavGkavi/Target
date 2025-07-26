import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target, Calendar, Flag, Zap, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  {
    id: "health",
    name: "Health & Wellness",
    icon: "🧘‍♀️",
    color: "bg-green-500",
  },
  { id: "fitness", name: "Fitness", icon: "🏃‍♂️", color: "bg-blue-500" },
  {
    id: "personal",
    name: "Personal Growth",
    icon: "📚",
    color: "bg-purple-500",
  },
  { id: "career", name: "Career", icon: "💼", color: "bg-orange-500" },
  { id: "addiction", name: "Break Addiction", icon: "🎯", color: "bg-red-500" },
  { id: "creativity", name: "Creativity", icon: "🎨", color: "bg-pink-500" },
];

const durations = [
  { value: "7", label: "1 Week Challenge" },
  { value: "21", label: "21 Days (Habit Formation)" },
  { value: "30", label: "30 Days" },
  { value: "60", label: "60 Days" },
  { value: "90", label: "90 Days" },
  { value: "365", label: "1 Year Goal" },
];

export default function CreateGoal() {
  const navigate = useNavigate();
  const { userData, updateUserData } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    reminderTime: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build new goal object
    const categoryObj = categories.find((c) => c.id === formData.category);
    const newGoal = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      progress: 0,
      streak: 0,
      targetDays: parseInt(formData.duration, 10),
      daysCompleted: 0,
      isCompleted: false,
      lastUpdated: new Date(),
      lastLoggedDate: undefined,
      color: categoryObj?.color || "bg-gray-500",
      // Optionally add reminderTime if you use it elsewhere
      reminderTime: formData.reminderTime || undefined,
    };

    // Add to userData.goals and update
    if (userData) {
      updateUserData({
        ...userData,
        goals: [...(userData.goals || []), newGoal],
      });
    }

    // Navigate back to main page
    navigate("/");
  };

  const handleCategorySelect = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    setSelectedCategory(category);
    setFormData({ ...formData, category: categoryId });
  };

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
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">Create New Quest</h1>
              <p className="text-sm text-muted-foreground">
                Build a new habit or break an old one
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal Details */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span>Goal Details</span>
              </CardTitle>
              <CardDescription>Define what you want to achieve</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Exercise for 30 minutes daily"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add more details about your goal..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="rounded-lg resize-none"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-primary" />
                <span>Category</span>
              </CardTitle>
              <CardDescription>
                Choose the area of life this goal belongs to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategorySelect(category.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:scale-105 ${
                      selectedCategory?.id === category.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="text-2xl">{category.icon}</div>
                      <div>
                        <p className="font-medium text-sm">{category.name}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Duration & Schedule */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Duration & Schedule</span>
              </CardTitle>
              <CardDescription>Set your timeline and reminders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Goal Duration</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) =>
                    setFormData({ ...formData, duration: value })
                  }
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Choose duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminderTime">Daily Reminder (Optional)</Label>
                <Input
                  id="reminderTime"
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) =>
                    setFormData({ ...formData, reminderTime: e.target.value })
                  }
                  className="rounded-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Get a daily notification to help you stay on track
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Goal Preview */}
          {formData.title && selectedCategory && formData.duration && (
            <Card className="rounded-xl border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Flag className="h-5 w-5 text-primary" />
                  <span>Goal Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{selectedCategory.icon}</span>
                    <div>
                      <h3 className="font-semibold">{formData.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.description || "No description"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <Badge variant="secondary">{selectedCategory.name}</Badge>
                    <span className="text-muted-foreground">
                      {
                        durations.find((d) => d.value === formData.duration)
                          ?.label
                      }
                    </span>
                    {formData.reminderTime && (
                      <span className="text-muted-foreground">
                        Reminder: {formData.reminderTime}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              className="flex-1 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-lg"
              disabled={
                !formData.title || !formData.category || !formData.duration
              }
            >
              <Zap className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
