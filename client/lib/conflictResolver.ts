import { UserData } from "@/contexts/AuthContext";

export interface ConflictResolution {
  hasConflict: boolean;
  localData?: UserData;
  cloudData?: UserData;
  autoResolved?: boolean;
  resolvedData?: UserData;
}

export class ConflictResolver {
  static detectConflicts(localData: UserData, cloudData: UserData): ConflictResolution {
    // Check for significant differences that require user intervention
    const hasGoalConflicts = this.hasArrayConflicts(localData.goals || [], cloudData.goals || []);
    const hasCompletedGoalConflicts = this.hasArrayConflicts(
      localData.completedGoals || [], 
      cloudData.completedGoals || []
    );
    const hasPreferenceConflicts = this.hasPreferenceConflicts(
      localData.preferences || {}, 
      cloudData.preferences || {}
    );
    const hasQuestConflicts = this.hasQuestSystemConflicts(
      localData.questSystemData, 
      cloudData.questSystemData
    );

    const hasConflict = hasGoalConflicts || hasCompletedGoalConflicts || 
                       hasPreferenceConflicts || hasQuestConflicts;

    if (!hasConflict) {
      // No conflicts, can auto-merge
      return {
        hasConflict: false,
        autoResolved: true,
        resolvedData: this.performAutoMerge(localData, cloudData)
      };
    }

    return {
      hasConflict: true,
      localData,
      cloudData,
      autoResolved: false
    };
  }

  private static hasArrayConflicts(localArray: any[], cloudArray: any[]): boolean {
    // Check if arrays have conflicting items with same ID but different content
    const localIds = new Set(localArray.map(item => item.id).filter(Boolean));
    const cloudIds = new Set(cloudArray.map(item => item.id).filter(Boolean));
    
    // Find common IDs
    const commonIds = Array.from(localIds).filter(id => cloudIds.has(id));
    
    // Check if any common items have different lastUpdated dates
    return commonIds.some(id => {
      const localItem = localArray.find(item => item.id === id);
      const cloudItem = cloudArray.find(item => item.id === id);
      
      if (!localItem || !cloudItem) return false;
      
      const localDate = new Date(localItem.lastUpdated || 0);
      const cloudDate = new Date(cloudItem.lastUpdated || 0);
      const timeDiff = Math.abs(localDate.getTime() - cloudDate.getTime());
      
      // Consider conflict if timestamps differ by more than 1 minute
      // and items have other differences
      return timeDiff > 60000 && JSON.stringify(localItem) !== JSON.stringify(cloudItem);
    });
  }

  private static hasPreferenceConflicts(localPrefs: any, cloudPrefs: any): boolean {
    // Check for critical preference differences
    const criticalPrefs = ['useQuestSystem', 'onboardingCompleted'];
    
    return criticalPrefs.some(key => {
      return localPrefs[key] !== undefined && 
             cloudPrefs[key] !== undefined && 
             localPrefs[key] !== cloudPrefs[key];
    });
  }

  private static hasQuestSystemConflicts(localQuest: any, cloudQuest: any): boolean {
    if (!localQuest || !cloudQuest) return false;
    
    // Check for level/XP conflicts
    const levelDiff = Math.abs((localQuest.level || 0) - (cloudQuest.level || 0));
    const xpDiff = Math.abs((localQuest.xp || 0) - (cloudQuest.xp || 0));
    
    // Consider conflict if there's significant progression difference
    return levelDiff > 1 || xpDiff > 500;
  }

  private static performAutoMerge(localData: UserData, cloudData: UserData): UserData {
    return {
      ...cloudData,
      
      // Merge goals by taking the most recently updated
      goals: this.mergeArraysByLastUpdated(localData.goals || [], cloudData.goals || []),
      
      // Merge completed goals - always additive
      completedGoals: this.mergeArraysById(
        localData.completedGoals || [], 
        cloudData.completedGoals || []
      ),
      
      // Merge addictions - always additive
      addictions: this.mergeArraysById(
        localData.addictions || [], 
        cloudData.addictions || []
      ),
      
      // Merge achievements - always additive
      achievements: this.mergeArraysById(
        localData.achievements || [], 
        cloudData.achievements || []
      ),
      
      // Merge preferences - prefer local for user-specific settings
      preferences: {
        ...cloudData.preferences,
        theme: localData.preferences?.theme || cloudData.preferences?.theme || "system",
        notifications: localData.preferences?.notifications ?? cloudData.preferences?.notifications ?? true,
        reminderTime: localData.preferences?.reminderTime || cloudData.preferences?.reminderTime,
        // Keep cloud data for critical flags
        onboardingCompleted: cloudData.preferences?.onboardingCompleted || localData.preferences?.onboardingCompleted || false,
        useQuestSystem: cloudData.preferences?.useQuestSystem ?? localData.preferences?.useQuestSystem ?? true
      },

      // Use the quest system data with higher level/XP
      questSystemData: this.getMostAdvancedQuestData(localData.questSystemData, cloudData.questSystemData)
    };
  }

  private static mergeArraysByLastUpdated(localArray: any[], cloudArray: any[]): any[] {
    const merged = [...cloudArray];
    
    localArray.forEach(localItem => {
      const existingIndex = merged.findIndex(item => item.id === localItem.id);
      
      if (existingIndex >= 0) {
        // Compare lastUpdated dates and keep the most recent
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
    
    localArray.forEach(localItem => {
      if (!merged.find(item => item.id === localItem.id)) {
        merged.push(localItem);
      }
    });
    
    return merged;
  }

  private static getMostAdvancedQuestData(localData: any, cloudData: any): any {
    if (!localData && !cloudData) return undefined;
    if (!localData) return cloudData;
    if (!cloudData) return localData;

    const localLevel = localData.level || 0;
    const cloudLevel = cloudData.level || 0;
    const localXp = localData.xp || 0;
    const cloudXp = cloudData.xp || 0;

    // Choose data with higher level, or higher XP if levels are equal
    if (localLevel > cloudLevel || (localLevel === cloudLevel && localXp > cloudXp)) {
      return localData;
    }
    
    return cloudData;
  }

  static resolveConflict(
    localData: UserData, 
    cloudData: UserData, 
    strategy: "local" | "cloud" | "merge"
  ): UserData {
    switch (strategy) {
      case "local":
        return localData;
      case "cloud":
        return cloudData;
      case "merge":
      default:
        return this.performAutoMerge(localData, cloudData);
    }
  }
}
