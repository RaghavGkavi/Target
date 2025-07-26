import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Cloud, 
  CloudOff, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle, 
  Wifi,
  WifiOff
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SyncStatus() {
  const { syncState, forceSync } = useAuth();

  const getStatusIcon = () => {
    switch (syncState.status) {
      case "syncing":
        return <RotateCw className="h-4 w-4 animate-spin" />;
      case "synced":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "offline":
        return <WifiOff className="h-4 w-4 text-gray-500" />;
      default:
        return <Cloud className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    switch (syncState.status) {
      case "syncing":
        return "Syncing...";
      case "synced":
        return syncState.lastSync 
          ? `Synced ${syncState.lastSync.toLocaleTimeString()}`
          : "Synced";
      case "error":
        return syncState.error || "Sync error";
      case "offline":
        return syncState.pendingChanges ? "Offline - Changes pending" : "Offline";
      default:
        return "Unknown status";
    }
  };

  const getStatusVariant = () => {
    switch (syncState.status) {
      case "syncing":
        return "secondary";
      case "synced":
        return "default";
      case "error":
        return "destructive";
      case "offline":
        return syncState.pendingChanges ? "secondary" : "outline";
      default:
        return "outline";
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={getStatusVariant()} 
              className={cn(
                "flex items-center gap-1 text-xs",
                syncState.status === "syncing" && "animate-pulse"
              )}
            >
              {getStatusIcon()}
              <span className="hidden sm:inline">{getStatusText()}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">{getStatusText()}</div>
              {syncState.error && (
                <div className="text-red-400 mt-1">{syncState.error}</div>
              )}
              {syncState.pendingChanges && (
                <div className="text-yellow-400 mt-1">
                  Changes will sync when online
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>

        {(syncState.status === "error" || syncState.pendingChanges) && (
          <Button
            size="sm"
            variant="ghost"
            onClick={forceSync}
            disabled={syncState.status === "syncing"}
            className="h-6 px-2"
          >
            <RotateCw className={cn(
              "h-3 w-3", 
              syncState.status === "syncing" && "animate-spin"
            )} />
            <span className="sr-only">Retry sync</span>
          </Button>
        )}
      </div>
    </TooltipProvider>
  );
}
