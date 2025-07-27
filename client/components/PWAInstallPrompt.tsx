import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { X, Plus, Share, Home, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if app is already installed (standalone mode)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://");
    setIsStandalone(standalone);

    // Handle the beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show iOS instructions after a delay if on iOS and not installed
    if (iOS && !standalone) {
      const timer = setTimeout(() => {
        const hasSeenIOSPrompt = localStorage.getItem(
          "ios-install-prompt-seen",
        );
        if (!hasSeenIOSPrompt) {
          setShowIOSInstructions(true);
        }
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleIOSInstructionsSeen = () => {
    localStorage.setItem("ios-install-prompt-seen", "true");
    setShowIOSInstructions(false);
  };

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  // Don't show anything if app is already installed
  if (isStandalone) return null;

  return (
    <>
      {/* Android/Desktop Install Prompt */}
      {showInstallPrompt && deferredPrompt && (
        <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm border-primary shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Home className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Install Target</h3>
                  <p className="text-xs text-muted-foreground">
                    Add to home screen
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={dismissInstallPrompt}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleInstallClick} size="sm" className="flex-1">
                Install App
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={dismissInstallPrompt}
              >
                Not Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* iOS Install Instructions */}
      <Dialog open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <span>Install Target App</span>
            </DialogTitle>
            <DialogDescription>
              Add Target to your home screen for the best experience!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center mb-3">
                <Home className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">
                Follow these steps to install Target on your iPhone:
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">1</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Tap the</span>
                  <Share className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">share button below</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">2</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Tap</span>
                  <div className="flex items-center space-x-1 px-2 py-1 bg-blue-500/10 rounded">
                    <Plus className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-blue-500">
                      Add to Home Screen
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">3</span>
                </div>
                <div>
                  <span className="text-sm">Tap "Add" to install</span>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              Once installed, Target will work just like a native app!
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleIOSInstructionsSeen} className="w-full">
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
