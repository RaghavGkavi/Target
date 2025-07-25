import { useNavigate } from "react-router-dom";
import { ArrowLeft, Construction, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlaceholderProps {
  title: string;
  description: string;
  suggestion?: string;
}

export default function Placeholder({
  title,
  description,
  suggestion = "Let me know what you'd like to see on this page and I'll build it for you!",
}: PlaceholderProps) {
  const navigate = useNavigate();

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
              <h1 className="text-xl font-bold">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center space-y-6">
          <Card className="rounded-xl border-dashed border-2 border-muted-foreground/20">
            <CardContent className="p-12">
              <div className="space-y-4">
                <div className="h-16 w-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Construction className="h-8 w-8 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Coming Soon</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    This page is under construction. We're working hard to bring
                    you amazing features!
                  </p>
                </div>

                <div className="pt-4">
                  <div className="bg-muted/50 rounded-lg p-4 max-w-md mx-auto">
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                      <p className="text-sm text-left">{suggestion}</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => navigate("/")}
                  className="mt-6 rounded-lg"
                >
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
