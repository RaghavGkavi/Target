import { useState } from "react";
import { UserData } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Cloud,
  Smartphone,
  Calendar,
  Target,
  Trophy,
  Settings,
} from "lucide-react";

interface SyncConflictDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  localData: UserData;
  cloudData: UserData;
  onResolve: (
    resolvedData: UserData,
    strategy: "local" | "cloud" | "merge",
  ) => void;
}

export function SyncConflictDialog({
  open,
  onOpenChange,
  localData,
  cloudData,
  onResolve,
}: SyncConflictDialogProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<
    "local" | "cloud" | "merge"
  >("merge");

  const getDataSummary = (data: UserData) => ({
    goals: data.goals?.length || 0,
    completedGoals: data.completedGoals?.length || 0,
    achievements: data.achievements?.length || 0,
    questLevel: data.questSystemData?.level || 0,
    xp: data.questSystemData?.xp || 0,
  });

  const localSummary = getDataSummary(localData);
  const cloudSummary = getDataSummary(cloudData);

  const handleResolve = () => {
    let resolvedData: UserData;

    switch (selectedStrategy) {
      case "local":
        resolvedData = localData;
        break;
      case "cloud":
        resolvedData = cloudData;
        break;
      case "merge":
      default:
        resolvedData = {
          ...cloudData,
          goals: mergeArraysById(localData.goals || [], cloudData.goals || []),
          completedGoals: mergeArraysById(
            localData.completedGoals || [],
            cloudData.completedGoals || [],
          ),
          addictions: mergeArraysById(
            localData.addictions || [],
            cloudData.addictions || [],
          ),
          achievements: mergeArraysById(
            localData.achievements || [],
            cloudData.achievements || [],
          ),
          preferences: { ...cloudData.preferences, ...localData.preferences },
        };
        break;
    }

    onResolve(resolvedData, selectedStrategy);
    onOpenChange(false);
  };

  const mergeArraysById = (localArray: any[], cloudArray: any[]): any[] => {
    const merged = [...cloudArray];
    localArray.forEach((localItem) => {
      if (!merged.find((item) => item.id === localItem.id)) {
        merged.push(localItem);
      }
    });
    return merged;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Sync Conflict Detected
          </DialogTitle>
          <DialogDescription>
            Your data differs between this device and the cloud. Choose how to
            resolve the conflict.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={selectedStrategy}
          onValueChange={(value) => setSelectedStrategy(value as any)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="merge">Smart Merge</TabsTrigger>
            <TabsTrigger value="cloud">Use Cloud</TabsTrigger>
            <TabsTrigger value="local">Use Local</TabsTrigger>
          </TabsList>

          <TabsContent value="merge" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Recommended: Combines data from both sources intelligently,
              keeping the best of both.
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DataSummaryCard
                title="This Device"
                icon={<Smartphone className="h-4 w-4" />}
                summary={localSummary}
              />
              <DataSummaryCard
                title="Cloud"
                icon={<Cloud className="h-4 w-4" />}
                summary={cloudSummary}
              />
            </div>
          </TabsContent>

          <TabsContent value="cloud" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Replace local data with cloud data. Any local-only changes will be
              lost.
            </div>
            <DataSummaryCard
              title="Cloud Data"
              icon={<Cloud className="h-4 w-4" />}
              summary={cloudSummary}
            />
          </TabsContent>

          <TabsContent value="local" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Keep local data and overwrite cloud. Data from other devices will
              be lost.
            </div>
            <DataSummaryCard
              title="Local Data"
              icon={<Smartphone className="h-4 w-4" />}
              summary={localSummary}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleResolve}>
            {selectedStrategy === "merge"
              ? "Merge Data"
              : selectedStrategy === "cloud"
                ? "Use Cloud Data"
                : "Use Local Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DataSummaryCard({
  title,
  icon,
  summary,
}: {
  title: string;
  icon: React.ReactNode;
  summary: any;
}) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 font-medium">
        {icon}
        {title}
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            Active Goals
          </span>
          <Badge variant="secondary">{summary.goals}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            Completed Goals
          </span>
          <Badge variant="secondary">{summary.completedGoals}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Achievements
          </span>
          <Badge variant="secondary">{summary.achievements}</Badge>
        </div>
        {summary.questLevel > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs">Quest Level</span>
            <Badge variant="outline">
              Lv.{summary.questLevel} ({summary.xp} XP)
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
