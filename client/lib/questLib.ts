import { QuestTemplate, QuestDifficulty, QuestCategory, QUEST_XP_VALUES } from '@shared/quest-types';

/**
 * Comprehensive Quest Library - Separate from templates
 * This file contains an expanded collection of quests for variety
 */

export const QUEST_LIBRARY: QuestTemplate[] = [
  // EASY QUESTS (5 XP each) - Expanded library
  {
    id: 'easy_water_hydration',
    title: 'Stay Hydrated',
    description: 'Drink 8 glasses of water throughout the day',
    category: 'health',
    difficulty: 'easy',
    xpReward: QUEST_XP_VALUES.easy,
    icon: '💧',
    estimatedTime: '5 minutes',
    requiresTracking: true,
  },
  {
    id: 'easy_morning_walk',
    title: 'Morning Stride',
    description: 'Take a 10-minute walk to start your day',
    category: 'fitness',
    difficulty: 'easy',
    xpReward: QUEST_XP_VALUES.easy,
    icon: '🌅',
    estimatedTime: '10 minutes',
    requiresTracking: true,
  },
  {
    id: 'easy_daily_pages',
    title: 'Reading Time',
    description: 'Read 10 pages of any book or article',
    category: 'learning',
    difficulty: 'easy',
    xpReward: QUEST_XP_VALUES.easy,
    icon: '📖',
    estimatedTime: '15 minutes',
    requiresTracking: true,
  },
  {
    id: 'easy_gratitude_journal',
    title: 'Gratitude Practice',
    description: 'Write down 3 things you are grateful for',
    category: 'mindfulness',
    difficulty: 'easy',
    xpReward: QUEST_XP_VALUES.easy,
    icon: '🙏',
    estimatedTime: '5 minutes',
    requiresTracking: true,
  },
  {
    id: 'easy_workspace_tidy',
    title: 'Organize Space',
    description: 'Clean and organize your desk or workspace',
    category: 'productivity',
    difficulty: 'easy',
    xpReward: QUEST_XP_VALUES.easy,
    icon: '🗂️',
    estimatedTime: '15 minutes',
    requiresTracking: true,
  },
  {
    id: 'easy_social_check_in',
    title: 'Connect & Care',
    description: 'Call or message a friend or family member',
    category: 'social',
    difficulty: 'easy',
    xpReward: QUEST_XP_VALUES.easy,
    icon: '📞',
    estimatedTime: '10 minutes',
    requiresTracking: true,
  },
  {
    id: 'easy_creative_sketch',
    title: 'Creative Flow',
    description: 'Spend 10 minutes drawing, doodling, or creating',
    category: 'creativity',
    difficulty: 'easy',
    xpReward: QUEST_XP_VALUES.easy,
    icon: '🎨',
    estimatedTime: '10 minutes',
    requiresTracking: true,
  },
  {
    id: 'easy_deep_breathing',
    title: 'Breath of Fresh Air',
    description: 'Practice 5 minutes of deep breathing exercises',
    category: 'mindfulness',
    difficulty: 'easy',
    xpReward: QUEST_XP_VALUES.easy,
    icon: '🫁',
    estimatedTime: '5 minutes',
    requiresTracking: true,
  },
  {
    id: 'easy_stretch_session',
    title: 'Body Stretch',
    description: 'Do 10 minutes of stretching exercises',
    category: 'fitness',
    difficulty: 'easy',
    xpReward: QUEST_XP_VALUES.easy,
    icon: '🤸‍♂️',
    estimatedTime: '10 minutes',
    requiresTracking: true,
  },
  {
    id: 'easy_healthy_snack',
    title: 'Nutritious Choice',
    description: 'Choose a healthy snack over processed food',
    category: 'health',
    difficulty: 'easy',
    xpReward: QUEST_XP_VALUES.easy,
    icon: '🥗',
    estimatedTime: '2 minutes',
    requiresTracking: true,
  },

  // MODERATE QUESTS (10 XP each) - Expanded library
  {
    id: 'moderate_workout_session',
    title: 'Power Workout',
    description: 'Complete a 30-minute exercise routine',
    category: 'fitness',
    difficulty: 'moderate',
    xpReward: QUEST_XP_VALUES.moderate,
    icon: '💪',
    estimatedTime: '30 minutes',
    requiresTracking: true,
  },
  {
    id: 'moderate_meditation_time',
    title: 'Mindful Moment',
    description: 'Practice meditation for 15 minutes',
    category: 'mindfulness',
    difficulty: 'moderate',
    xpReward: QUEST_XP_VALUES.moderate,
    icon: '🧘‍♀️',
    estimatedTime: '15 minutes',
    requiresTracking: true,
  },
  {
    id: 'moderate_skill_learning',
    title: 'Knowledge Quest',
    description: 'Complete 45 minutes of focused learning using online tutorials, courses, or educational videos on a specific skill',
    category: 'learning',
    difficulty: 'moderate',
    xpReward: QUEST_XP_VALUES.moderate,
    icon: '🎓',
    estimatedTime: '45 minutes',
    requiresTracking: true,
  },
  {
    id: 'moderate_home_cooking',
    title: 'Chef Challenge',
    description: 'Cook a healthy meal from scratch',
    category: 'health',
    difficulty: 'moderate',
    xpReward: QUEST_XP_VALUES.moderate,
    icon: '👨‍🍳',
    estimatedTime: '45 minutes',
    requiresTracking: true,
  },
  {
    id: 'moderate_focused_work',
    title: 'Deep Focus',
    description: 'Work on important task for 1 hour without distractions',
    category: 'career',
    difficulty: 'moderate',
    xpReward: QUEST_XP_VALUES.moderate,
    icon: '⚡',
    estimatedTime: '1 hour',
    requiresTracking: true,
  },
  {
    id: 'moderate_digital_break',
    title: 'Screen Detox',
    description: 'Stay off social media for 2 hours',
    category: 'recovery',
    difficulty: 'moderate',
    xpReward: QUEST_XP_VALUES.moderate,
    icon: '📵',
    estimatedTime: '2 hours',
    requiresTracking: true,
  },
  {
    id: 'moderate_creative_project',
    title: 'Creative Sprint',
    description: 'Work on creative project for 30 minutes',
    category: 'creativity',
    difficulty: 'moderate',
    xpReward: QUEST_XP_VALUES.moderate,
    icon: '✨',
    estimatedTime: '30 minutes',
    requiresTracking: true,
  },
  {
    id: 'moderate_nature_walk',
    title: 'Nature Explorer',
    description: 'Take a 30-minute walk in nature or park',
    category: 'fitness',
    difficulty: 'moderate',
    xpReward: QUEST_XP_VALUES.moderate,
    icon: '🌳',
    estimatedTime: '30 minutes',
    requiresTracking: true,
  },
  {
    id: 'moderate_planning_session',
    title: 'Life Organizer',
    description: 'Plan your week and organize your schedule',
    category: 'productivity',
    difficulty: 'moderate',
    xpReward: QUEST_XP_VALUES.moderate,
    icon: '📋',
    estimatedTime: '30 minutes',
    requiresTracking: true,
  },
  {
    id: 'moderate_social_activity',
    title: 'Social Butterfly',
    description: 'Engage in meaningful conversation for 30 minutes',
    category: 'social',
    difficulty: 'moderate',
    xpReward: QUEST_XP_VALUES.moderate,
    icon: '💬',
    estimatedTime: '30 minutes',
    requiresTracking: true,
  },

  // HARD QUESTS (20 XP each) - Expanded library
  {
    id: 'hard_intense_training',
    title: 'Beast Mode',
    description: 'Complete challenging 45-minute workout',
    category: 'fitness',
    difficulty: 'hard',
    xpReward: QUEST_XP_VALUES.hard,
    icon: '🔥',
    estimatedTime: '45 minutes',
    requiresTracking: true,
  },
  {
    id: 'hard_course_completion',
    title: 'Learning Marathon',
    description: 'Complete entire course chapter or module',
    category: 'learning',
    difficulty: 'hard',
    xpReward: QUEST_XP_VALUES.hard,
    icon: '📚',
    estimatedTime: '1.5 hours',
    requiresTracking: true,
  },
  {
    id: 'hard_networking_mission',
    title: 'Connection Builder',
    description: 'Reach out to 3 professional contacts',
    category: 'career',
    difficulty: 'hard',
    xpReward: QUEST_XP_VALUES.hard,
    icon: '🤝',
    estimatedTime: '1 hour',
    requiresTracking: true,
  },
  {
    id: 'hard_meal_prep_master',
    title: 'Prep Commander',
    description: 'Prepare healthy meals for the entire week',
    category: 'health',
    difficulty: 'hard',
    xpReward: QUEST_XP_VALUES.hard,
    icon: '🍱',
    estimatedTime: '2 hours',
    requiresTracking: true,
  },
  {
    id: 'hard_deep_work_session',
    title: 'Focus Warrior',
    description: 'Complete 2 hours of focused work',
    category: 'productivity',
    difficulty: 'hard',
    xpReward: QUEST_XP_VALUES.hard,
    icon: '🎯',
    estimatedTime: '2 hours',
    requiresTracking: true,
  },
  {
    id: 'hard_social_leadership',
    title: 'Event Organizer',
    description: 'Organize or attend meaningful social event',
    category: 'social',
    difficulty: 'hard',
    xpReward: QUEST_XP_VALUES.hard,
    icon: '🎉',
    estimatedTime: '2-3 hours',
    requiresTracking: true,
  },
  {
    id: 'hard_creative_masterpiece',
    title: 'Art Creator',
    description: 'Complete significant creative piece',
    category: 'creativity',
    difficulty: 'hard',
    xpReward: QUEST_XP_VALUES.hard,
    icon: '🖼️',
    estimatedTime: '2-3 hours',
    requiresTracking: true,
  },
  {
    id: 'hard_mindful_retreat',
    title: 'Inner Journey',
    description: 'Extended meditation or mindfulness practice (1 hour)',
    category: 'mindfulness',
    difficulty: 'hard',
    xpReward: QUEST_XP_VALUES.hard,
    icon: '🕯️',
    estimatedTime: '1 hour',
    requiresTracking: true,
  },
  {
    id: 'hard_fitness_challenge',
    title: 'Endurance Test',
    description: 'Complete challenging fitness milestone',
    category: 'fitness',
    difficulty: 'hard',
    xpReward: QUEST_XP_VALUES.hard,
    icon: '🏃‍♂️',
    estimatedTime: '1-2 hours',
    requiresTracking: true,
  },
  {
    id: 'hard_habit_break',
    title: 'Habit Breaker',
    description: 'Successfully avoid a bad habit for entire day',
    category: 'recovery',
    difficulty: 'hard',
    xpReward: QUEST_XP_VALUES.hard,
    icon: '💪',
    estimatedTime: 'Full day',
    requiresTracking: true,
  },

  // VERY HARD QUESTS (30 XP each) - Expanded library
  {
    id: 'very_hard_endurance_epic',
    title: 'Epic Endurance',
    description: 'Complete major endurance challenge (10K run, long hike)',
    category: 'fitness',
    difficulty: 'very_hard',
    xpReward: QUEST_XP_VALUES.very_hard,
    icon: '🏔️',
    estimatedTime: '2+ hours',
    requiresTracking: true,
  },
  {
    id: 'very_hard_knowledge_master',
    title: 'Knowledge Master',
    description: 'Master complex topic with 3+ hours of study',
    category: 'learning',
    difficulty: 'very_hard',
    xpReward: QUEST_XP_VALUES.very_hard,
    icon: '🧠',
    estimatedTime: '3+ hours',
    requiresTracking: true,
  },
  {
    id: 'very_hard_project_milestone',
    title: 'Project Hero',
    description: 'Complete major project milestone or deliverable',
    category: 'career',
    difficulty: 'very_hard',
    xpReward: QUEST_XP_VALUES.very_hard,
    icon: '🚀',
    estimatedTime: '4+ hours',
    requiresTracking: true,
  },
  {
    id: 'very_hard_digital_fast',
    title: 'Digital Monk',
    description: 'Complete digital detox for entire day',
    category: 'recovery',
    difficulty: 'very_hard',
    xpReward: QUEST_XP_VALUES.very_hard,
    icon: '🚫',
    estimatedTime: 'Full day',
    requiresTracking: true,
  },
  {
    id: 'very_hard_life_optimization',
    title: 'Life Architect',
    description: 'Completely organize major life area',
    category: 'productivity',
    difficulty: 'very_hard',
    xpReward: QUEST_XP_VALUES.very_hard,
    icon: '🏗️',
    estimatedTime: '3-4 hours',
    requiresTracking: true,
  },
  {
    id: 'very_hard_mindful_fast',
    title: 'Ascetic Challenge',
    description: 'Complete 24-hour mindful fast (safely)',
    category: 'mindfulness',
    difficulty: 'very_hard',
    xpReward: QUEST_XP_VALUES.very_hard,
    icon: '🌙',
    estimatedTime: '24 hours',
    requiresTracking: true,
  },
  {
    id: 'very_hard_creative_exhibition',
    title: 'Creative Legend',
    description: 'Create and publicly share creative work',
    category: 'creativity',
    difficulty: 'very_hard',
    xpReward: QUEST_XP_VALUES.very_hard,
    icon: '⭐',
    estimatedTime: '4+ hours',
    requiresTracking: true,
  },
  {
    id: 'very_hard_social_impact',
    title: 'Community Leader',
    description: 'Organize event that positively impacts others',
    category: 'social',
    difficulty: 'very_hard',
    xpReward: QUEST_XP_VALUES.very_hard,
    icon: '🌟',
    estimatedTime: '4+ hours',
    requiresTracking: true,
  },
  {
    id: 'very_hard_health_transformation',
    title: 'Health Revolution',
    description: 'Implement major health change for entire day',
    category: 'health',
    difficulty: 'very_hard',
    xpReward: QUEST_XP_VALUES.very_hard,
    icon: '🔄',
    estimatedTime: 'Full day',
    requiresTracking: true,
  },
  {
    id: 'very_hard_fear_conquest',
    title: 'Fear Conqueror',
    description: 'Face and overcome a significant personal fear',
    category: 'personal',
    difficulty: 'very_hard',
    xpReward: QUEST_XP_VALUES.very_hard,
    icon: '⚔️',
    estimatedTime: 'Variable',
    requiresTracking: true,
  },
];

// Helper functions for quest library management
export function getQuestsByDifficulty(difficulty: QuestDifficulty): QuestTemplate[] {
  return QUEST_LIBRARY.filter(quest => quest.difficulty === difficulty);
}

export function getQuestsByCategory(category: QuestCategory): QuestTemplate[] {
  return QUEST_LIBRARY.filter(quest => quest.category === category);
}

export function getQuestById(id: string): QuestTemplate | undefined {
  return QUEST_LIBRARY.find(quest => quest.id === id);
}

export function getRandomQuest(
  difficulty: QuestDifficulty,
  excludeIds: string[] = [],
  preferredCategories?: QuestCategory[]
): QuestTemplate | null {
  let availableQuests = getQuestsByDifficulty(difficulty)
    .filter(quest => !excludeIds.includes(quest.id));

  // Filter by preferred categories if specified
  if (preferredCategories && preferredCategories.length > 0) {
    const preferredQuests = availableQuests.filter(quest => 
      preferredCategories.includes(quest.category)
    );
    if (preferredQuests.length > 0) {
      availableQuests = preferredQuests;
    }
  }

  if (availableQuests.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableQuests.length);
  return availableQuests[randomIndex];
}

// Get all available quest IDs for a difficulty
export function getAllQuestIds(difficulty?: QuestDifficulty): string[] {
  if (difficulty) {
    return getQuestsByDifficulty(difficulty).map(quest => quest.id);
  }
  return QUEST_LIBRARY.map(quest => quest.id);
}

// Validate quest library counts
const easyQuests = getQuestsByDifficulty('easy');
const moderateQuests = getQuestsByDifficulty('moderate');
const hardQuests = getQuestsByDifficulty('hard');
const veryHardQuests = getQuestsByDifficulty('very_hard');

console.log('Quest Library Stats:', {
  total: QUEST_LIBRARY.length,
  easy: easyQuests.length,
  moderate: moderateQuests.length,
  hard: hardQuests.length,
  very_hard: veryHardQuests.length,
});
