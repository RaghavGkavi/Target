import { QuestSystemData, DailyQuest, QuestDifficulty } from '@shared/quest-types';

export interface QuestAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "quests" | "levels" | "streaks" | "consistency" | "milestones" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
  condition: (questSystemData: QuestSystemData) => boolean;
  earnedAt?: Date;
}

export const QUEST_ACHIEVEMENTS: QuestAchievement[] = [
  // Quest Completion Achievements
  {
    id: "first_quest",
    title: "Adventurer",
    description: "Complete your first quest",
    icon: "⚡",
    category: "quests",
    rarity: "common",
    condition: (data) => {
      const totalCompleted = data.questHistory.filter(q => q.status === 'completed').length +
                            data.currentQuests.filter(q => q.status === 'completed').length;
      return totalCompleted >= 1;
    },
  },
  {
    id: "complete_5_quests",
    title: "Quest Hunter",
    description: "Complete 5 quests",
    icon: "🎯",
    category: "quests",
    rarity: "common",
    condition: (data) => {
      const totalCompleted = data.questHistory.filter(q => q.status === 'completed').length +
                            data.currentQuests.filter(q => q.status === 'completed').length;
      return totalCompleted >= 5;
    },
  },
  {
    id: "complete_10_quests",
    title: "Quest Seeker",
    description: "Complete 10 quests",
    icon: "🏹",
    category: "quests",
    rarity: "common",
    condition: (data) => {
      const totalCompleted = data.questHistory.filter(q => q.status === 'completed').length +
                            data.currentQuests.filter(q => q.status === 'completed').length;
      return totalCompleted >= 10;
    },
  },
  {
    id: "complete_25_quests",
    title: "Quest Master",
    description: "Complete 25 quests",
    icon: "🗡️",
    category: "quests",
    rarity: "rare",
    condition: (data) => {
      const totalCompleted = data.questHistory.filter(q => q.status === 'completed').length +
                            data.currentQuests.filter(q => q.status === 'completed').length;
      return totalCompleted >= 25;
    },
  },
  {
    id: "complete_50_quests",
    title: "Quest Champion",
    description: "Complete 50 quests",
    icon: "⚔️",
    category: "quests",
    rarity: "rare",
    condition: (data) => {
      const totalCompleted = data.questHistory.filter(q => q.status === 'completed').length +
                            data.currentQuests.filter(q => q.status === 'completed').length;
      return totalCompleted >= 50;
    },
  },
  {
    id: "complete_100_quests",
    title: "Quest Legendary",
    description: "Complete 100 quests",
    icon: "👑",
    category: "quests",
    rarity: "epic",
    condition: (data) => {
      const totalCompleted = data.questHistory.filter(q => q.status === 'completed').length +
                            data.currentQuests.filter(q => q.status === 'completed').length;
      return totalCompleted >= 100;
    },
  },
  {
    id: "complete_250_quests",
    title: "Quest God",
    description: "Complete 250 quests",
    icon: "🌟",
    category: "quests",
    rarity: "legendary",
    condition: (data) => {
      const totalCompleted = data.questHistory.filter(q => q.status === 'completed').length +
                            data.currentQuests.filter(q => q.status === 'completed').length;
      return totalCompleted >= 250;
    },
  },

  // Level Achievements
  {
    id: "reach_level_5",
    title: "Rising Star",
    description: "Reach level 5",
    icon: "📈",
    category: "levels",
    rarity: "common",
    condition: (data) => data.userLevel.currentLevel >= 5,
  },
  {
    id: "reach_level_10",
    title: "Experienced",
    description: "Reach level 10",
    icon: "💫",
    category: "levels",
    rarity: "common",
    condition: (data) => data.userLevel.currentLevel >= 10,
  },
  {
    id: "reach_level_25",
    title: "Veteran",
    description: "Reach level 25",
    icon: "🎖️",
    category: "levels",
    rarity: "rare",
    condition: (data) => data.userLevel.currentLevel >= 25,
  },
  {
    id: "reach_level_50",
    title: "Master",
    description: "Reach level 50",
    icon: "🏆",
    category: "levels",
    rarity: "epic",
    condition: (data) => data.userLevel.currentLevel >= 50,
  },
  {
    id: "reach_level_100",
    title: "Grandmaster",
    description: "Reach level 100",
    icon: "👑",
    category: "levels",
    rarity: "legendary",
    condition: (data) => data.userLevel.currentLevel >= 100,
  },

  // Streak Achievements
  {
    id: "daily_streak_3",
    title: "Consistency Starter",
    description: "Complete quests for 3 days in a row",
    icon: "🔥",
    category: "streaks",
    rarity: "common",
    condition: (data) => data.weeklyStats.streak >= 3,
  },
  {
    id: "daily_streak_7",
    title: "Week Warrior",
    description: "Complete quests for 7 days in a row",
    icon: "⚡",
    category: "streaks",
    rarity: "common",
    condition: (data) => data.weeklyStats.streak >= 7,
  },
  {
    id: "daily_streak_14",
    title: "Fortnight Fighter",
    description: "Complete quests for 14 days in a row",
    icon: "🌟",
    category: "streaks",
    rarity: "rare",
    condition: (data) => data.weeklyStats.streak >= 14,
  },
  {
    id: "daily_streak_30",
    title: "Monthly Master",
    description: "Complete quests for 30 days in a row",
    icon: "🏅",
    category: "streaks",
    rarity: "rare",
    condition: (data) => data.weeklyStats.streak >= 30,
  },
  {
    id: "daily_streak_100",
    title: "Centurion",
    description: "Complete quests for 100 days in a row",
    icon: "💎",
    category: "streaks",
    rarity: "epic",
    condition: (data) => data.weeklyStats.streak >= 100,
  },
  {
    id: "daily_streak_365",
    title: "Year Round Hero",
    description: "Complete quests for 365 days in a row",
    icon: "🌈",
    category: "streaks",
    rarity: "legendary",
    condition: (data) => data.weeklyStats.streak >= 365,
  },

  // Difficulty-specific Achievements
  {
    id: "complete_hard_quest",
    title: "Challenge Seeker",
    description: "Complete your first hard quest",
    icon: "💪",
    category: "quests",
    rarity: "common",
    condition: (data) => {
      const hardQuests = [...data.questHistory, ...data.currentQuests]
        .filter(q => q.status === 'completed' && q.difficulty === 'hard');
      return hardQuests.length >= 1;
    },
  },
  {
    id: "complete_very_hard_quest",
    title: "Elite Warrior",
    description: "Complete your first very hard quest",
    icon: "🔥",
    category: "quests",
    rarity: "rare",
    condition: (data) => {
      const veryHardQuests = [...data.questHistory, ...data.currentQuests]
        .filter(q => q.status === 'completed' && q.difficulty === 'very_hard');
      return veryHardQuests.length >= 1;
    },
  },
  {
    id: "complete_10_very_hard",
    title: "Legend Slayer",
    description: "Complete 10 very hard quests",
    icon: "⚡",
    category: "quests",
    rarity: "epic",
    condition: (data) => {
      const veryHardQuests = [...data.questHistory, ...data.currentQuests]
        .filter(q => q.status === 'completed' && q.difficulty === 'very_hard');
      return veryHardQuests.length >= 10;
    },
  },

  // Special Achievements
  {
    id: "perfect_day",
    title: "Perfect Day",
    description: "Complete all 3 daily quests in one day",
    icon: "✨",
    category: "special",
    rarity: "rare",
    condition: (data) => {
      // Check if there was ever a day where all 3 quests were completed
      const questsByDate = new Map<string, DailyQuest[]>();
      
      [...data.questHistory, ...data.currentQuests]
        .filter(q => q.status === 'completed' && q.dateCompleted)
        .forEach(quest => {
          const dateKey = new Date(quest.dateCompleted!).toDateString();
          if (!questsByDate.has(dateKey)) {
            questsByDate.set(dateKey, []);
          }
          questsByDate.get(dateKey)!.push(quest);
        });

      // Check if any day has 3 completed quests
      for (const quests of questsByDate.values()) {
        if (quests.length >= 3) {
          return true;
        }
      }
      return false;
    },
  },
  {
    id: "category_explorer",
    title: "Well Rounded",
    description: "Complete quests in 5 different categories",
    icon: "🎭",
    category: "special",
    rarity: "rare",
    condition: (data) => {
      const categories = new Set(
        [...data.questHistory, ...data.currentQuests]
          .filter(q => q.status === 'completed')
          .map(q => q.category)
      );
      return categories.size >= 5;
    },
  },
  {
    id: "xp_milestone_1000",
    title: "Power Collector",
    description: "Earn 1000 total XP",
    icon: "⭐",
    category: "milestones",
    rarity: "rare",
    condition: (data) => data.userLevel.totalXP >= 1000,
  },
  {
    id: "xp_milestone_5000",
    title: "Power Master",
    description: "Earn 5000 total XP",
    icon: "💫",
    category: "milestones",
    rarity: "epic",
    condition: (data) => data.userLevel.totalXP >= 5000,
  },
  {
    id: "quest_regenerator",
    title: "Perfectionist",
    description: "Regenerate a quest 3 times in one day",
    icon: "🔄",
    category: "special",
    rarity: "common",
    condition: (data) => {
      return data.currentQuests.some(quest => quest.regenerationsUsed >= 3);
    },
  },
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Complete a quest within 1 hour of daily generation",
    icon: "🌅",
    category: "special",
    rarity: "rare",
    condition: (data) => {
      // This would need to be tracked during quest completion
      // For now, we'll base it on having completed quests on the same day they were assigned
      return [...data.questHistory, ...data.currentQuests]
        .some(quest => {
          if (quest.status !== 'completed' || !quest.dateCompleted) return false;
          const assigned = new Date(quest.dateAssigned);
          const completed = new Date(quest.dateCompleted);
          return assigned.toDateString() === completed.toDateString() &&
                 (completed.getTime() - assigned.getTime()) <= 3600000; // 1 hour
        });
    },
  },
];

// Helper functions
export function checkQuestAchievements(
  questSystemData: QuestSystemData,
  existingAchievements: Array<{ id: string; earnedAt: Date }> = []
): QuestAchievement[] {
  const newlyEarned: QuestAchievement[] = [];

  QUEST_ACHIEVEMENTS.forEach((achievement) => {
    const wasEarned = existingAchievements.some(a => a.id === achievement.id);
    const isNowEarned = achievement.condition(questSystemData);

    if (!wasEarned && isNowEarned) {
      newlyEarned.push({
        ...achievement,
        earnedAt: new Date(),
      });
    }
  });

  return newlyEarned;
}

export function getEarnedQuestAchievements(
  existingAchievements: Array<{ id: string; earnedAt: Date }> = []
): QuestAchievement[] {
  return QUEST_ACHIEVEMENTS.filter(achievement =>
    existingAchievements.some(a => a.id === achievement.id)
  ).map(achievement => ({
    ...achievement,
    earnedAt: existingAchievements.find(a => a.id === achievement.id)?.earnedAt,
  }));
}

export function getRarityColor(rarity: QuestAchievement["rarity"]): string {
  switch (rarity) {
    case "common":
      return "text-gray-600 dark:text-gray-400";
    case "rare":
      return "text-blue-600 dark:text-blue-400";
    case "epic":
      return "text-purple-600 dark:text-purple-400";
    case "legendary":
      return "text-yellow-600 dark:text-yellow-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
}

export function getRarityBorder(rarity: QuestAchievement["rarity"]): string {
  switch (rarity) {
    case "common":
      return "border-gray-200 dark:border-gray-700";
    case "rare":
      return "border-blue-200 dark:border-blue-700";
    case "epic":
      return "border-purple-200 dark:border-purple-700";
    case "legendary":
      return "border-yellow-200 dark:border-yellow-700";
    default:
      return "border-gray-200 dark:border-gray-700";
  }
}
