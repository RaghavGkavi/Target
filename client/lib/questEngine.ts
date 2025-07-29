import {
  DailyQuest,
  QuestDifficulty,
  QuestSystemData,
  QuestPreferences,
  UserLevel,
  calculateLevelFromXP,
  calculateXPForLevel,
  DEFAULT_DIFFICULTY_DISTRIBUTION,
  QUEST_XP_VALUES,
} from "@shared/quest-types";
import {
  QUEST_TEMPLATES,
  getRandomQuestTemplate,
  getQuestTemplateById,
} from "@shared/quest-templates";
import {
  QUEST_LIBRARY,
  getRandomQuest,
  getQuestById,
  getAllQuestIds,
} from "./questLib";
import {
  getUTCDateOnly,
  toUTCDateOnly,
  isSameUTCDay,
  getDayDifferenceUTC,
  isConsecutiveUTCDay,
  getUTCDateString,
  getUTCTimestamp,
} from "./dateUtils";

/**
 * Quest Engine - Manages daily quest generation, user progression, and quest lifecycle
 */

export class QuestEngine {
  /**
   * Generate 3 new daily quests based on user preferences and quest history
   */
  static generateDailyQuests(
    questSystemData: QuestSystemData,
    lastLoginDate?: Date,
  ): DailyQuest[] {
    const today = getUTCDateOnly();
    const preferences = questSystemData.questPreferences;

    // Get previously assigned quest template IDs to avoid immediate repetition
    const recentTemplateIds = questSystemData.questHistory
      .filter((quest) => {
        const questDate = new Date(quest.dateAssigned);
        const daysDiff = getDayDifferenceUTC(today, questDate);
        return daysDiff <= 7; // Don't repeat quests from last 7 days
      })
      .map((quest) => quest.templateId);

    // Include flagged/disabled quests in exclusion list
    const flaggedTemplateIds = questSystemData.flaggedQuests || [];

    const dailyQuests: DailyQuest[] = [];
    const usedTemplateIds: string[] = [];

    // Determine quest difficulties based on user preferences or default distribution
    const difficulties = this.selectQuestDifficulties(preferences);

    for (let i = 0; i < 3; i++) {
      const difficulty = difficulties[i];
      const excludeIds = [
        ...recentTemplateIds,
        ...flaggedTemplateIds,
        ...usedTemplateIds,
      ];

      // Try quest library first, fallback to templates
      let template = getRandomQuest(
        difficulty,
        excludeIds,
        preferences.preferredCategories,
      );

      // Fallback to original templates if quest library doesn't have options
      if (!template) {
        template = getRandomQuestTemplate(
          difficulty,
          excludeIds,
          preferences.preferredCategories,
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
          status: "active",
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
      const remainingDifficulties: QuestDifficulty[] = [
        "easy",
        "moderate",
        "hard",
      ];
      const difficulty =
        remainingDifficulties[
          Math.floor(Math.random() * remainingDifficulties.length)
        ];

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
          status: "active",
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
   * Select 3 difficulties for daily quests with guaranteed distribution
   */
  private static selectQuestDifficulties(
    preferences: QuestPreferences,
  ): QuestDifficulty[] {
    const difficulties: QuestDifficulty[] = [];

    // Ensure at least one hard/very hard quest
    const hardQuests: QuestDifficulty[] = ["hard", "very_hard"];
    const hardQuest = hardQuests[Math.floor(Math.random() * hardQuests.length)];
    difficulties.push(hardQuest);

    // Ensure at least one easy/moderate quest
    const easyQuests: QuestDifficulty[] = ["easy", "moderate"];
    const easyQuest = easyQuests[Math.floor(Math.random() * easyQuests.length)];
    difficulties.push(easyQuest);

    // Third quest based on user preferences with some randomization
    const distribution =
      preferences.difficultyBalance || DEFAULT_DIFFICULTY_DISTRIBUTION;
    const weightedDifficulties: QuestDifficulty[] = [];
    Object.entries(distribution).forEach(([difficulty, weight]) => {
      const count = Math.round(weight * 100);
      for (let i = 0; i < count; i++) {
        weightedDifficulties.push(difficulty as QuestDifficulty);
      }
    });

    if (weightedDifficulties.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * weightedDifficulties.length,
      );
      difficulties.push(weightedDifficulties[randomIndex]);
    } else {
      difficulties.push("moderate"); // Fallback
    }

    return difficulties;
  }

  /**
   * Regenerate all quests with randomized difficulty distribution
   */
  static regenerateAllQuests(questSystemData: QuestSystemData): DailyQuest[] {
    const today = new Date();

    // Create randomized difficulty distribution
    const difficulties: QuestDifficulty[] = [];

    // Ensure at least one hard/very hard quest
    const hardQuests: QuestDifficulty[] = ["hard", "very_hard"];
    difficulties.push(
      hardQuests[Math.floor(Math.random() * hardQuests.length)],
    );

    // Ensure at least one easy/moderate quest
    const easyQuests: QuestDifficulty[] = ["easy", "moderate"];
    difficulties.push(
      easyQuests[Math.floor(Math.random() * easyQuests.length)],
    );

    // Third quest is completely random
    const allDifficulties: QuestDifficulty[] = [
      "easy",
      "moderate",
      "hard",
      "very_hard",
    ];
    difficulties.push(
      allDifficulties[Math.floor(Math.random() * allDifficulties.length)],
    );

    const preferences = questSystemData.questPreferences;
    const recentTemplateIds = questSystemData.questHistory
      .filter((quest) => {
        const questDate = new Date(quest.dateAssigned);
        const daysDiff = Math.floor(
          (today.getTime() - questDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        return daysDiff <= 7;
      })
      .map((quest) => quest.templateId);

    // Include flagged/disabled quests in exclusion list
    const flaggedTemplateIds = questSystemData.flaggedQuests || [];

    const dailyQuests: DailyQuest[] = [];
    const usedTemplateIds: string[] = [];

    for (let i = 0; i < 3; i++) {
      const difficulty = difficulties[i];
      const excludeIds = [
        ...recentTemplateIds,
        ...flaggedTemplateIds,
        ...usedTemplateIds,
      ];

      // Try quest library first, fallback to templates
      let template = getRandomQuest(
        difficulty,
        excludeIds,
        preferences.preferredCategories,
      );

      if (!template) {
        template = getRandomQuestTemplate(
          difficulty,
          excludeIds,
          preferences.preferredCategories,
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
          status: "active",
          dateAssigned: today,
          regenerationsUsed: 0,
          isRegenerated: true,
        };

        dailyQuests.push(quest);
        usedTemplateIds.push(template.id);
      }
    }

    return dailyQuests;
  }

  /**
   * Auto-generate quests if none are available and auto-generation is allowed
   */
  static autoGenerateQuestsIfNeeded(questSystemData: QuestSystemData): boolean {
    const activeQuests = questSystemData.currentQuests.filter(
      (q) => q.status === "active",
    );

    // Don't auto-generate if all quests were completed (wait for manual regeneration)
    if (questSystemData.allQuestsCompleted) {
      return false;
    }

    if (activeQuests.length === 0) {
      console.log("🎯 No active quests found, auto-generating 3 new quests...");
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
    isDevMode: boolean = false,
  ): DailyQuest | null {
    // Allow infinite regenerations in dev mode
    if (!isDevMode && currentQuest.regenerationsUsed >= 3) {
      return null; // Maximum regenerations reached
    }

    const preferences = questSystemData.questPreferences;

    // Get template IDs to exclude (current quest + recent history + flagged quests)
    const today = new Date();
    const recentTemplateIds = questSystemData.questHistory
      .filter((quest) => {
        const questDate = new Date(quest.dateAssigned);
        const daysDiff = Math.floor(
          (today.getTime() - questDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        return daysDiff <= 7;
      })
      .map((quest) => quest.templateId);

    // Include flagged/disabled quests in exclusion list
    const flaggedTemplateIds = questSystemData.flaggedQuests || [];

    const excludeIds = [
      ...recentTemplateIds,
      ...flaggedTemplateIds,
      currentQuest.templateId,
    ];

    // Try quest library first, fallback to templates
    let newTemplate = getRandomQuest(
      currentQuest.difficulty,
      excludeIds,
      preferences.preferredCategories,
    );

    // Fallback to original templates if quest library doesn't have options
    if (!newTemplate) {
      newTemplate = getRandomQuestTemplate(
        currentQuest.difficulty,
        excludeIds,
        preferences.preferredCategories,
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
      originalTemplateId: currentQuest.isRegenerated
        ? currentQuest.originalTemplateId
        : currentQuest.templateId,
    };

    return regeneratedQuest;
  }

  /**
   * Flag a quest and regenerate it immediately
   */
  static flagQuest(
    questId: string,
    questSystemData: QuestSystemData,
    isDevMode: boolean = false,
  ): DailyQuest | null {
    const questIndex = questSystemData.currentQuests.findIndex(
      (q) => q.id === questId,
    );
    if (questIndex === -1) {
      return null;
    }

    const currentQuest = questSystemData.currentQuests[questIndex];

    // Add quest template to flagged list if not already there
    if (!questSystemData.flaggedQuests.includes(currentQuest.templateId)) {
      questSystemData.flaggedQuests.push(currentQuest.templateId);
    }

    // Generate a replacement quest
    const replacementQuest = this.regenerateQuest(
      currentQuest,
      questSystemData,
      isDevMode,
    );

    if (replacementQuest) {
      // Replace the quest in the current quests array
      questSystemData.currentQuests[questIndex] = replacementQuest;
      return replacementQuest;
    }

    return null;
  }

  /**
   * Complete a quest and award XP
   */
  static completeQuest(
    questId: string,
    questSystemData: QuestSystemData,
  ): { updatedQuest: DailyQuest; newLevel?: number; xpGained: number } | null {
    const questIndex = questSystemData.currentQuests.findIndex(
      (q) => q.id === questId,
    );
    if (questIndex === -1) {
      return null;
    }

    const quest = questSystemData.currentQuests[questIndex];
    if (quest.status !== "active") {
      return null; // Quest already completed or failed
    }

    // Update quest status
    const updatedQuest: DailyQuest = {
      ...quest,
      status: "completed",
      dateCompleted: new Date(),
    };

    // Calculate XP and level progression
    const xpGained = quest.xpReward;
    const newTotalXP = questSystemData.userLevel.totalXP + xpGained;
    const levelInfo = calculateLevelFromXP(newTotalXP);

    const oldLevel = questSystemData.userLevel.currentLevel;
    const newLevel = levelInfo.level > oldLevel ? levelInfo.level : undefined;

    // Update weekly stats
    const today = getUTCDateOnly();
    const lastStreakDate = questSystemData.weeklyStats.lastStreakDate;
    // Ensure lastStreakDate is a Date object
    const lastStreakDateObj = lastStreakDate ? new Date(lastStreakDate) : null;
    const isConsecutiveDay =
      lastStreakDateObj && isConsecutiveUTCDay(today, lastStreakDateObj);

    const newStreak =
      !lastStreakDateObj || isConsecutiveDay
        ? questSystemData.weeklyStats.streak + 1
        : 1;

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

    // Update daily stats
    const dailyStatsDate = questSystemData.dailyStats?.date
      ? new Date(questSystemData.dailyStats.date)
      : null;

    if (dailyStatsDate && isSameUTCDay(today, dailyStatsDate)) {
      // Same day, increment count
      questSystemData.dailyStats.questsCompleted += 1;
      questSystemData.dailyStats.lastUpdated = getUTCTimestamp();
    } else {
      // New day, reset count
      questSystemData.dailyStats = {
        date: today,
        questsCompleted: 1,
        lastUpdated: getUTCTimestamp(),
      };
    }

    return { updatedQuest, newLevel, xpGained };
  }

  /**
   * Check if new quests should be generated based on last login date
   */
  static shouldGenerateNewQuests(
    questSystemData: QuestSystemData,
    lastLoginDate: Date,
  ): boolean {
    const today = new Date();
    const lastGeneration = new Date(questSystemData.lastQuestGeneration);

    // Generate new quests if:
    // 1. Different day than last generation
    // 2. No current quests exist
    // 3. All current quests are completed/failed AND allQuestsCompleted flag is false

    const isDifferentDay =
      today.toDateString() !== lastGeneration.toDateString();
    const hasNoCurrentQuests = questSystemData.currentQuests.length === 0;
    const allQuestsCompleted = questSystemData.currentQuests.every(
      (quest) => quest.status === "completed" || quest.status === "failed",
    );

    // Don't auto-generate if user has completed all quests (wait for manual regeneration)
    if (allQuestsCompleted && questSystemData.allQuestsCompleted) {
      return false;
    }

    return isDifferentDay || hasNoCurrentQuests || allQuestsCompleted;
  }

  /**
   * Initialize quest system data for new users
   */
  static initializeQuestSystem(
    questPreferences: QuestPreferences,
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
      dailyStats: {
        date: new Date(),
        questsCompleted: 0,
        lastUpdated: new Date(),
      },
      allQuestsCompleted: false,
      flaggedQuests: [],
    };

    // Generate initial quests
    const dailyQuests = this.generateDailyQuests(initialQuestSystemData);
    initialQuestSystemData.currentQuests = dailyQuests;

    return initialQuestSystemData;
  }

  /**
   * Archive completed/failed quests and generate new ones if needed
   */
  static processQuestRotation(
    questSystemData: QuestSystemData,
  ): QuestSystemData {
    const today = new Date();
    const todayDateString = today.toDateString();

    // Separate quests by status and date
    const activeQuests = questSystemData.currentQuests.filter(
      (quest) => quest.status === "active",
    );

    // Keep completed quests from today, archive older ones
    const completedQuestsToday = questSystemData.currentQuests.filter(
      (quest) =>
        quest.status === "completed" &&
        new Date(quest.dateCompleted || quest.dateAssigned).toDateString() ===
          todayDateString,
    );

    const questsToArchive = questSystemData.currentQuests.filter(
      (quest) =>
        (quest.status === "completed" || quest.status === "failed") &&
        new Date(quest.dateCompleted || quest.dateAssigned).toDateString() !==
          todayDateString,
    );

    // If we need to generate new quests for today
    if (
      this.shouldGenerateNewQuests(
        questSystemData,
        new Date(questSystemData.lastQuestGeneration),
      )
    ) {
      // Archive all current quests (they're from a previous day)
      questSystemData.questHistory.push(...questSystemData.currentQuests);

      // Generate new quests
      const newQuests = this.generateDailyQuests(questSystemData);
      questSystemData.currentQuests = newQuests;
      questSystemData.lastQuestGeneration = today;
    } else {
      // Archive only old completed/failed quests, keep active quests and today's completed quests
      questSystemData.questHistory.push(...questsToArchive);
      questSystemData.currentQuests = [
        ...activeQuests,
        ...completedQuestsToday,
      ];
    }

    // Keep only last 30 days of history to prevent bloat
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    questSystemData.questHistory = questSystemData.questHistory.filter(
      (quest) => new Date(quest.dateAssigned) >= thirtyDaysAgo,
    );

    return questSystemData;
  }
}

/**
 * Default quest preferences for new users
 */
export const DEFAULT_QUEST_PREFERENCES: QuestPreferences = {
  preferredCategories: ["health", "fitness", "personal", "productivity"],
  difficultyBalance: DEFAULT_DIFFICULTY_DISTRIBUTION,
  timePreference: "mixed",
};
