import { 
  DailyQuest, 
  QuestDifficulty, 
  QuestSystemData, 
  QuestPreferences, 
  UserLevel,
  calculateLevelFromXP,
  calculateXPForLevel,
  DEFAULT_DIFFICULTY_DISTRIBUTION,
  QUEST_XP_VALUES
} from '@shared/quest-types';
import {
  QUEST_TEMPLATES,
  getRandomQuestTemplate,
  getQuestTemplateById
} from '@shared/quest-templates';
import {
  QUEST_LIBRARY,
  getRandomQuest,
  getQuestById,
  getAllQuestIds
} from './questLib';

/**
 * Quest Engine - Manages daily quest generation, user progression, and quest lifecycle
 */

export class QuestEngine {
  /**
   * Generate 3 new daily quests based on user preferences and quest history
   */
  static generateDailyQuests(
    questSystemData: QuestSystemData,
    lastLoginDate?: Date
  ): DailyQuest[] {
    const today = new Date();
    const preferences = questSystemData.questPreferences;
    
    // Get previously assigned quest template IDs to avoid immediate repetition
    const recentTemplateIds = questSystemData.questHistory
      .filter(quest => {
        const questDate = new Date(quest.dateAssigned);
        const daysDiff = Math.floor((today.getTime() - questDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff <= 7; // Don't repeat quests from last 7 days
      })
      .map(quest => quest.templateId);

    const dailyQuests: DailyQuest[] = [];
    const usedTemplateIds: string[] = [];

    // Determine quest difficulties based on user preferences or default distribution
    const difficulties = this.selectQuestDifficulties(preferences);

    for (let i = 0; i < 3; i++) {
      const difficulty = difficulties[i];
      const excludeIds = [...recentTemplateIds, ...usedTemplateIds];
      
      // Try quest library first, fallback to templates
      let template = getRandomQuest(
        difficulty,
        excludeIds,
        preferences.preferredCategories
      );

      // Fallback to original templates if quest library doesn't have options
      if (!template) {
        template = getRandomQuestTemplate(
          difficulty,
          excludeIds,
          preferences.preferredCategories
        );
      }

      if (template) {
        const quest: DailyQuest = {
          id: `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          templateId: template.id,
          title: template.title,
          description: template.description,
          category: template.category,
          difficulty: template.difficulty,
          xpReward: template.xpReward,
          icon: template.icon,
          estimatedTime: template.estimatedTime,
          status: 'active',
          dateAssigned: today,
          regenerationsUsed: 0,
          isRegenerated: false,
        };

        dailyQuests.push(quest);
        usedTemplateIds.push(template.id);
      }
    }

    // If we couldn't generate 3 quests (shouldn't happen with our templates), 
    // fill remaining slots with any available templates
    while (dailyQuests.length < 3) {
      const remainingDifficulties: QuestDifficulty[] = ['easy', 'moderate', 'hard'];
      const difficulty = remainingDifficulties[Math.floor(Math.random() * remainingDifficulties.length)];
      
      const template = getRandomQuestTemplate(difficulty, usedTemplateIds);
      if (template) {
        const quest: DailyQuest = {
          id: `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          templateId: template.id,
          title: template.title,
          description: template.description,
          category: template.category,
          difficulty: template.difficulty,
          xpReward: template.xpReward,
          icon: template.icon,
          estimatedTime: template.estimatedTime,
          status: 'active',
          dateAssigned: today,
          regenerationsUsed: 0,
          isRegenerated: false,
        };

        dailyQuests.push(quest);
        usedTemplateIds.push(template.id);
      }
    }

    return dailyQuests;
  }

  /**
   * Select 3 difficulties for daily quests based on user preferences
   */
  private static selectQuestDifficulties(preferences: QuestPreferences): QuestDifficulty[] {
    const distribution = preferences.difficultyBalance || DEFAULT_DIFFICULTY_DISTRIBUTION;
    const difficulties: QuestDifficulty[] = [];
    
    // Create weighted array based on preferences
    const weightedDifficulties: QuestDifficulty[] = [];
    Object.entries(distribution).forEach(([difficulty, weight]) => {
      const count = Math.round(weight * 100); // Convert to whole numbers
      for (let i = 0; i < count; i++) {
        weightedDifficulties.push(difficulty as QuestDifficulty);
      }
    });

    // Select 3 difficulties
    for (let i = 0; i < 3; i++) {
      if (weightedDifficulties.length > 0) {
        const randomIndex = Math.floor(Math.random() * weightedDifficulties.length);
        const selectedDifficulty = weightedDifficulties[randomIndex];
        difficulties.push(selectedDifficulty);
        
        // Remove some instances to avoid too many of the same difficulty
        const removeCount = Math.min(10, Math.floor(weightedDifficulties.length * 0.1));
        for (let j = 0; j < removeCount; j++) {
          const indexToRemove = weightedDifficulties.findIndex(d => d === selectedDifficulty);
          if (indexToRemove !== -1) {
            weightedDifficulties.splice(indexToRemove, 1);
          }
        }
      }
    }

    // Fallback if we don't have enough difficulties
    while (difficulties.length < 3) {
      difficulties.push('moderate');
    }

    return difficulties;
  }

  /**
   * Auto-generate quests if none are available
   */
  static autoGenerateQuestsIfNeeded(questSystemData: QuestSystemData): boolean {
    const activeQuests = questSystemData.currentQuests.filter(q => q.status === 'active');

    if (activeQuests.length === 0) {
      console.log('🎯 No active quests found, auto-generating 3 new quests...');
      const newQuests = this.generateDailyQuests(questSystemData);
      questSystemData.currentQuests = newQuests;
      questSystemData.lastQuestGeneration = new Date();
      return true; // Indicates quests were generated
    }

    return false; // No generation needed
  }

  /**
   * Regenerate a specific quest (up to 3 times per quest, infinite in dev mode)
   */
  static regenerateQuest(
    currentQuest: DailyQuest,
    questSystemData: QuestSystemData,
    isDevMode: boolean = false
  ): DailyQuest | null {
    // Allow infinite regenerations in dev mode
    if (!isDevMode && currentQuest.regenerationsUsed >= 3) {
      return null; // Maximum regenerations reached
    }

    const preferences = questSystemData.questPreferences;
    
    // Get template IDs to exclude (current quest + recent history)
    const today = new Date();
    const recentTemplateIds = questSystemData.questHistory
      .filter(quest => {
        const questDate = new Date(quest.dateAssigned);
        const daysDiff = Math.floor((today.getTime() - questDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff <= 7;
      })
      .map(quest => quest.templateId);

    const excludeIds = [...recentTemplateIds, currentQuest.templateId];

    // Try quest library first, fallback to templates
    let newTemplate = getRandomQuest(
      currentQuest.difficulty,
      excludeIds,
      preferences.preferredCategories
    );

    // Fallback to original templates if quest library doesn't have options
    if (!newTemplate) {
      newTemplate = getRandomQuestTemplate(
        currentQuest.difficulty,
        excludeIds,
        preferences.preferredCategories
      );
    }

    if (!newTemplate) {
      return null; // No alternative template available
    }

    const regeneratedQuest: DailyQuest = {
      ...currentQuest,
      id: `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      templateId: newTemplate.id,
      title: newTemplate.title,
      description: newTemplate.description,
      category: newTemplate.category,
      icon: newTemplate.icon,
      estimatedTime: newTemplate.estimatedTime,
      regenerationsUsed: currentQuest.regenerationsUsed + 1,
      isRegenerated: true,
      originalTemplateId: currentQuest.isRegenerated ? 
        currentQuest.originalTemplateId : currentQuest.templateId,
    };

    return regeneratedQuest;
  }

  /**
   * Complete a quest and award XP
   */
  static completeQuest(
    questId: string,
    questSystemData: QuestSystemData
  ): { updatedQuest: DailyQuest; newLevel?: number; xpGained: number } | null {
    const questIndex = questSystemData.currentQuests.findIndex(q => q.id === questId);
    if (questIndex === -1) {
      return null;
    }

    const quest = questSystemData.currentQuests[questIndex];
    if (quest.status !== 'active') {
      return null; // Quest already completed or failed
    }

    // Update quest status
    const updatedQuest: DailyQuest = {
      ...quest,
      status: 'completed',
      dateCompleted: new Date(),
    };

    // Calculate XP and level progression
    const xpGained = quest.xpReward;
    const newTotalXP = questSystemData.userLevel.totalXP + xpGained;
    const levelInfo = calculateLevelFromXP(newTotalXP);
    
    const oldLevel = questSystemData.userLevel.currentLevel;
    const newLevel = levelInfo.level > oldLevel ? levelInfo.level : undefined;

    // Update weekly stats
    const today = new Date();
    const lastStreakDate = questSystemData.weeklyStats.lastStreakDate;
    const isConsecutiveDay = lastStreakDate && 
      Math.floor((today.getTime() - lastStreakDate.getTime()) / (1000 * 60 * 60 * 24)) === 1;
    
    const newStreak = !lastStreakDate || isConsecutiveDay ? 
      questSystemData.weeklyStats.streak + 1 : 1;

    // Update quest system data
    questSystemData.currentQuests[questIndex] = updatedQuest;
    questSystemData.userLevel = {
      currentLevel: levelInfo.level,
      currentXP: levelInfo.currentXP,
      xpToNextLevel: levelInfo.xpToNext,
      totalXP: newTotalXP,
    };
    questSystemData.weeklyStats = {
      ...questSystemData.weeklyStats,
      questsCompleted: questSystemData.weeklyStats.questsCompleted + 1,
      totalXPEarned: questSystemData.weeklyStats.totalXPEarned + xpGained,
      streak: newStreak,
      lastStreakDate: today,
    };

    return { updatedQuest, newLevel, xpGained };
  }

  /**
   * Check if new quests should be generated based on last login date
   */
  static shouldGenerateNewQuests(
    questSystemData: QuestSystemData,
    lastLoginDate: Date
  ): boolean {
    const today = new Date();
    const lastGeneration = new Date(questSystemData.lastQuestGeneration);
    
    // Generate new quests if:
    // 1. Different day than last generation
    // 2. No current quests exist
    // 3. All current quests are completed/failed
    
    const isDifferentDay = today.toDateString() !== lastGeneration.toDateString();
    const hasNoCurrentQuests = questSystemData.currentQuests.length === 0;
    const allQuestsCompleted = questSystemData.currentQuests.every(
      quest => quest.status === 'completed' || quest.status === 'failed'
    );

    return isDifferentDay || hasNoCurrentQuests || allQuestsCompleted;
  }

  /**
   * Initialize quest system data for new users
   */
  static initializeQuestSystem(
    questPreferences: QuestPreferences
  ): QuestSystemData {
    const initialQuestSystemData: QuestSystemData = {
      currentQuests: [],
      questHistory: [],
      lastQuestGeneration: new Date(),
      questPreferences,
      userLevel: {
        currentLevel: 1,
        currentXP: 0,
        xpToNextLevel: calculateXPForLevel(2),
        totalXP: 0,
      },
      weeklyStats: {
        questsCompleted: 0,
        totalXPEarned: 0,
        streak: 0,
      },
    };

    // Generate initial quests
    const dailyQuests = this.generateDailyQuests(initialQuestSystemData);
    initialQuestSystemData.currentQuests = dailyQuests;

    return initialQuestSystemData;
  }

  /**
   * Archive completed/failed quests and generate new ones if needed
   */
  static processQuestRotation(questSystemData: QuestSystemData): QuestSystemData {
    const today = new Date();
    
    // Move completed/failed quests to history
    const questsToArchive = questSystemData.currentQuests.filter(
      quest => quest.status === 'completed' || quest.status === 'failed'
    );
    
    const activeQuests = questSystemData.currentQuests.filter(
      quest => quest.status === 'active'
    );

    // If we need to generate new quests for today
    if (this.shouldGenerateNewQuests(questSystemData, new Date(questSystemData.lastQuestGeneration))) {
      // Archive all current quests
      questSystemData.questHistory.push(...questSystemData.currentQuests);
      
      // Generate new quests
      const newQuests = this.generateDailyQuests(questSystemData);
      questSystemData.currentQuests = newQuests;
      questSystemData.lastQuestGeneration = today;
    } else {
      // Just archive completed/failed quests, keep active ones
      questSystemData.questHistory.push(...questsToArchive);
      questSystemData.currentQuests = activeQuests;
    }

    // Keep only last 30 days of history to prevent bloat
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    questSystemData.questHistory = questSystemData.questHistory.filter(
      quest => new Date(quest.dateAssigned) >= thirtyDaysAgo
    );

    return questSystemData;
  }
}

/**
 * Default quest preferences for new users
 */
export const DEFAULT_QUEST_PREFERENCES: QuestPreferences = {
  preferredCategories: ['health', 'fitness', 'personal', 'productivity'],
  difficultyBalance: DEFAULT_DIFFICULTY_DISTRIBUTION,
  timePreference: 'mixed',
};
