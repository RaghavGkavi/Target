import { UserData } from "@/contexts/AuthContext";
import { SyncService } from "./syncService";

// Test utilities for verifying sync functionality
export class SyncTestHelpers {
  
  static async testOnlineSync(userId: string, testData: UserData): Promise<boolean> {
    try {
      console.log("Testing online sync...");
      
      // Test upload
      await SyncService.uploadUserData(userId, testData);
      console.log("✓ Upload successful");
      
      // Test download
      const downloadedData = await SyncService.downloadUserData(userId);
      console.log("✓ Download successful", downloadedData ? "with data" : "no data found");
      
      // Test sync
      const syncedData = await SyncService.syncUserData(userId, testData);
      console.log("✓ Sync successful");
      
      return true;
    } catch (error) {
      console.error("✗ Sync test failed:", error);
      return false;
    }
  }
  
  static async testOfflineHandling(): Promise<boolean> {
    try {
      console.log("Testing offline handling...");
      
      // Test online detection
      const isOnline = await SyncService.isOnline();
      console.log(`✓ Online status: ${isOnline ? "online" : "offline"}`);
      
      return true;
    } catch (error) {
      console.error("✗ Offline test failed:", error);
      return false;
    }
  }
  
  static generateTestUserData(): UserData {
    return {
      goals: [
        {
          id: "test-goal-1",
          title: "Test Goal",
          description: "A test goal for sync verification",
          targetDays: 30,
          currentStreak: 5,
          lastUpdated: new Date(),
          completedDates: [],
          isActive: true
        }
      ],
      completedGoals: [],
      addictions: [],
      preferences: {
        theme: "system" as const,
        notifications: true,
        onboardingCompleted: true,
        useQuestSystem: true
      },
      achievements: [
        {
          id: "test-achievement",
          earnedAt: new Date()
        }
      ],
      questSystemData: {
        level: 1,
        xp: 100,
        currentQuests: [],
        questHistory: [],
        weeklyStats: {
          questsCompleted: 0,
          totalXp: 100,
          streak: 1,
          lastStreakDate: new Date()
        },
        dailyStats: {
          date: new Date(),
          questsCompleted: 0,
          lastUpdated: new Date()
        },
        preferences: {
          difficulty: "medium" as const,
          categories: ["health", "productivity"],
          questsPerDay: 3
        },
        lastQuestGeneration: new Date(),
        flaggedQuests: []
      }
    };
  }
  
  static async runFullSyncTest(userId: string): Promise<void> {
    console.log("=== Running Full Sync Test ===");
    
    const testData = this.generateTestUserData();
    
    // Test online sync
    const onlineSuccess = await this.testOnlineSync(userId, testData);
    
    // Test offline handling
    const offlineSuccess = await this.testOfflineHandling();
    
    console.log("=== Test Results ===");
    console.log(`Online sync: ${onlineSuccess ? "PASS" : "FAIL"}`);
    console.log(`Offline handling: ${offlineSuccess ? "PASS" : "FAIL"}`);
    
    if (onlineSuccess && offlineSuccess) {
      console.log("🎉 All sync tests passed!");
    } else {
      console.log("❌ Some sync tests failed");
    }
  }
}

// Make test helpers available globally for debugging
if (typeof window !== "undefined") {
  (window as any).syncTestHelpers = SyncTestHelpers;
}
