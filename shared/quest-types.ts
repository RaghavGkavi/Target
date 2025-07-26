/**
 * Quest system types shared between client and server
 */

export type QuestDifficulty = 'easy' | 'moderate' | 'hard' | 'very_hard';

export type QuestCategory = 
  | 'health' 
  | 'fitness' 
  | 'personal' 
  | 'career' 
  | 'creativity' 
  | 'mindfulness' 
  | 'productivity' 
  | 'social' 
  | 'learning' 
  | 'recovery';

export type QuestStatus = 'active' | 'completed' | 'failed' | 'skipped';

export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  xpReward: number;
  icon: string;
  estimatedTime: string; // e.g., "30 minutes", "1 hour"
  requiresTracking?: boolean; // Some quests might need user confirmation vs automatic tracking
}

export interface DailyQuest {
  id: string;
  templateId: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  xpReward: number;
  icon: string;
  estimatedTime: string;
  status: QuestStatus;
  dateAssigned: Date;
  dateCompleted?: Date;
  regenerationsUsed: number; // 0-3, tracks how many times user regenerated this quest
  isRegenerated: boolean; // true if this quest was regenerated from another
  originalTemplateId?: string; // if regenerated, stores the original template that was replaced
}

export interface UserLevel {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
}

export interface QuestPreferences {
  preferredCategories: QuestCategory[];
  difficultyBalance: {
    easy: number;    // 0-1, percentage preference
    moderate: number;
    hard: number;
    very_hard: number;
  };
  excludedCategories?: QuestCategory[];
  timePreference?: 'short' | 'medium' | 'long' | 'mixed'; // Quest duration preference
}

export interface QuestSystemData {
  currentQuests: DailyQuest[]; // Always 3 active quests
  questHistory: DailyQuest[]; // Completed/failed quests from previous days
  lastQuestGeneration: Date;
  questPreferences: QuestPreferences;
  userLevel: UserLevel;
  weeklyStats: {
    questsCompleted: number;
    totalXPEarned: number;
    streak: number; // Consecutive days with at least 1 quest completed
    lastStreakDate?: Date;
  };
  dailyStats: {
    date: Date; // The date these stats are for
    questsCompleted: number; // Total quests completed on this day
    lastUpdated: Date;
  };
}

// XP values for each difficulty
export const QUEST_XP_VALUES: Record<QuestDifficulty, number> = {
  easy: 5,
  moderate: 10,
  hard: 20,
  very_hard: 30,
};

// Level progression - each level requires progressively more XP
export function calculateXPForLevel(level: number): number {
  if (level <= 1) return 0;
  // Progressive difficulty: level 2 = 50 XP, level 3 = 55 XP, level 4 = 60 XP, etc.
  // Formula: 45 + (level * 5) XP needed to reach that level from previous
  const baseXP = 45;
  const increment = 5;
  
  let totalXP = 0;
  for (let i = 2; i <= level; i++) {
    totalXP += baseXP + (i * increment);
  }
  return totalXP;
}

export function calculateLevelFromXP(totalXP: number): { level: number; currentXP: number; xpToNext: number } {
  let level = 1;
  let xpUsed = 0;
  
  while (true) {
    const xpForNextLevel = calculateXPForLevel(level + 1) - calculateXPForLevel(level);
    if (totalXP < xpUsed + xpForNextLevel) {
      break;
    }
    xpUsed += xpForNextLevel;
    level++;
  }
  
  const currentXP = totalXP - xpUsed;
  const xpToNext = calculateXPForLevel(level + 1) - calculateXPForLevel(level) - currentXP;
  
  return { level, currentXP, xpToNext };
}

// Difficulty distribution for quest generation
export const DEFAULT_DIFFICULTY_DISTRIBUTION = {
  easy: 0.4,      // 40% easy quests
  moderate: 0.35, // 35% moderate quests  
  hard: 0.20,     // 20% hard quests
  very_hard: 0.05 // 5% very hard quests
};
