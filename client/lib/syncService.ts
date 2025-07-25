import { UserData } from "@/contexts/AuthContext";
import { UserDataResponse, UserDataExistsResponse } from "@shared/api";
import { ConflictResolver } from "./conflictResolver";
import { safeStorage } from "./storage";

export type SyncStatus = "syncing" | "synced" | "error" | "offline";

export interface SyncState {
  status: SyncStatus;
  lastSync?: Date;
  pendingChanges: boolean;
  error?: string;
}

export class SyncService {
  private static listeners: Array<(state: SyncState) => void> = [];
  private static currentState: SyncState = {
    status: "offline",
    pendingChanges: false,
  };

  static subscribe(listener: (state: SyncState) => void) {
    this.listeners.push(listener);
    listener(this.currentState);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private static notifyListeners() {
    this.listeners.forEach((listener) => listener(this.currentState));
  }

  static updateState(updates: Partial<SyncState>) {
    this.currentState = { ...this.currentState, ...updates };
    this.notifyListeners();
  }

  static async isOnline(): Promise<boolean> {
    if (!navigator.onLine) return false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch("/api/ping", {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      // Handle timeout and network errors gracefully
      return false;
    }
  }

  static async syncUserData(
    userId: string,
    localData: UserData,
  ): Promise<UserData> {
    this.updateState({ status: "syncing" });

    try {
      const online = await this.isOnline();

      if (!online) {
        this.updateState({
          status: "offline",
          pendingChanges: this.hasLocalChanges(userId),
        });
        return localData;
      }

      // Check if cloud data exists
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const existsResponse = await fetch(`/api/users/${userId}/exists`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!existsResponse.ok) {
        throw new Error(
          `Failed to check user data: ${existsResponse.status} ${existsResponse.statusText}`,
        );
      }

      const existsData: UserDataExistsResponse = await existsResponse.json();

      if (!existsData.success) {
        throw new Error(existsData.error || "Failed to check user data");
      }

      let finalData: UserData;

      if (!existsData.exists) {
        // No cloud data exists, upload local data
        await this.uploadUserData(userId, localData);
        finalData = localData;
      } else {
        // Cloud data exists, download and merge
        const cloudData = await this.downloadUserData(userId);

        if (cloudData) {
          // Merge local and cloud data
          const mergeResult = await this.mergeUserData(localData, cloudData);

          if (mergeResult.hasConflicts) {
            // Conflicts detected - will need manual resolution
            this.updateState({
              status: "error",
              error: "Data conflicts detected. Manual resolution required.",
              pendingChanges: true,
            });
            return localData; // Return local data for now
          }

          finalData = mergeResult.data;

          // Upload merged data back to cloud
          await this.uploadUserData(userId, finalData);
        } else {
          finalData = localData;
        }
      }

      // Clear pending changes flag
      this.clearLocalChanges(userId);

      this.updateState({
        status: "synced",
        lastSync: new Date(),
        pendingChanges: false,
      });

      return finalData;
    } catch (error) {
      console.error("Sync error:", error);
      this.updateState({
        status: "error",
        error: error instanceof Error ? error.message : "Unknown sync error",
      });
      return localData;
    }
  }

  static async uploadUserData(
    userId: string,
    userData: UserData,
  ): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`/api/users/${userId}/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userData }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const result: UserDataResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to upload user data");
    }
  }

  static async downloadUserData(userId: string): Promise<UserData | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`/api/users/${userId}/data`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 404) {
      return null; // No data exists
    }

    const result: UserDataResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to download user data");
    }

    return result.data;
  }

  static async mergeUserData(
    localData: UserData,
    cloudData: UserData,
  ): Promise<{ data: UserData; hasConflicts: boolean }> {
    const resolution = ConflictResolver.detectConflicts(localData, cloudData);

    if (resolution.autoResolved && resolution.resolvedData) {
      return { data: resolution.resolvedData, hasConflicts: false };
    }

    if (resolution.hasConflict) {
      // Return indication that manual resolution is needed
      return { data: localData, hasConflicts: true };
    }

    // Fallback to simple merge
    return {
      data: this.performSimpleMerge(localData, cloudData),
      hasConflicts: false,
    };
  }

  private static performSimpleMerge(
    localData: UserData,
    cloudData: UserData,
  ): UserData {
    return {
      ...cloudData,
      goals: this.mergeArraysByLastUpdated(
        localData.goals || [],
        cloudData.goals || [],
      ),
      completedGoals: this.mergeArraysById(
        localData.completedGoals || [],
        cloudData.completedGoals || [],
      ),
      addictions: this.mergeArraysById(
        localData.addictions || [],
        cloudData.addictions || [],
      ),
      achievements: this.mergeArraysById(
        localData.achievements || [],
        cloudData.achievements || [],
      ),
      preferences: {
        ...cloudData.preferences,
        ...localData.preferences,
        onboardingCompleted:
          cloudData.preferences?.onboardingCompleted ||
          localData.preferences?.onboardingCompleted ||
          false,
      },
      questSystemData: this.getMostRecentQuestData(
        localData.questSystemData,
        cloudData.questSystemData,
      ),
    };
  }

  private static mergeArraysByLastUpdated(
    localArray: any[],
    cloudArray: any[],
  ): any[] {
    const merged = [...cloudArray];

    localArray.forEach((localItem) => {
      const existingIndex = merged.findIndex(
        (item) => item.id === localItem.id,
      );

      if (existingIndex >= 0) {
        // Compare lastUpdated dates
        const localDate = new Date(localItem.lastUpdated || 0);
        const cloudDate = new Date(merged[existingIndex].lastUpdated || 0);

        if (localDate > cloudDate) {
          merged[existingIndex] = localItem;
        }
      } else {
        // Item only exists locally, add it
        merged.push(localItem);
      }
    });

    return merged;
  }

  private static mergeArraysById(localArray: any[], cloudArray: any[]): any[] {
    const merged = [...cloudArray];

    localArray.forEach((localItem) => {
      if (!merged.find((item) => item.id === localItem.id)) {
        merged.push(localItem);
      }
    });

    return merged;
  }

  private static getMostRecentQuestData(localData: any, cloudData: any): any {
    if (!localData && !cloudData) return undefined;
    if (!localData) return cloudData;
    if (!cloudData) return localData;

    // Compare lastQuestGeneration dates
    const localDate = new Date(localData.lastQuestGeneration || 0);
    const cloudDate = new Date(cloudData.lastQuestGeneration || 0);

    return localDate > cloudDate ? localData : cloudData;
  }

  // Background sync for when user makes changes
  static async backgroundSync(
    userId: string,
    userData: UserData,
  ): Promise<void> {
    this.markLocalChanges(userId);

    const online = await this.isOnline();
    if (online) {
      try {
        await this.uploadUserData(userId, userData);
        this.clearLocalChanges(userId);
        this.updateState({
          status: "synced",
          lastSync: new Date(),
          pendingChanges: false,
        });
      } catch (error) {
        console.error("Background sync failed:", error);
        this.updateState({
          status: "error",
          error:
            error instanceof Error ? error.message : "Background sync failed",
          pendingChanges: true,
        });
      }
    } else {
      this.updateState({
        status: "offline",
        pendingChanges: true,
      });
    }
  }

  private static markLocalChanges(userId: string) {
    safeStorage.setItem(`pending_sync_${userId}`, "true");
  }

  private static clearLocalChanges(userId: string) {
    safeStorage.removeItem(`pending_sync_${userId}`);
  }

  private static hasLocalChanges(userId: string): boolean {
    return safeStorage.getItem(`pending_sync_${userId}`) === "true";
  }

  static getCurrentState(): SyncState {
    return this.currentState;
  }

  // Force sync - useful for manual sync triggers
  static async forceSync(
    userId: string,
    userData: UserData,
  ): Promise<UserData> {
    this.updateState({ status: "syncing" });
    return this.syncUserData(userId, userData);
  }
}

// Listen for online/offline events
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    // When coming back online, update status
    const currentState = SyncService.getCurrentState();
    if (currentState.pendingChanges) {
      SyncService.updateState({ status: "offline" }); // Will be updated by next sync attempt
    }
  });

  window.addEventListener("offline", () => {
    SyncService.updateState({ status: "offline" });
  });
}
