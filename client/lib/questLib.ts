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
    description: 'Work on a specific high-priority task for 1 hour with phone on silent and all notifications disabled',
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
    description: 'Spend 30 minutes actively creating: write 500+ words, draw/sketch, practice an instrument, or work on a craft project',
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
    description: 'Create a detailed weekly schedule with specific time blocks for work, exercise, meals, and personal time',
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
    description: 'Have an intentional 30-minute conversation with someone about their goals, feelings, or something meaningful to them',
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
    description: 'Complete a 45-minute high-intensity workout: HIIT training, weight lifting, or challenging cardio that pushes your limits',
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
    description: 'Complete a full chapter/module of an online course, including all videos, readings, and exercises/quizzes',
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
    description: 'Send personalized messages to 3 professional contacts: update them on your work, ask about theirs, or suggest meeting up',
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
    description: 'Complete 2 uninterrupted hours on your most important project with phone in another room and all distractions eliminated',
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
    description: 'Plan and host a gathering (dinner party, game night, study group) or attend a networking/community event where you meet new people',
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
    description: 'Complete a substantial creative work: finish a short story/poem, create a detailed artwork, compose a song, or complete a craft project',
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
    description: 'Practice 1 hour of deep meditation, mindfulness, or contemplative practice in a quiet space without interruptions',
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
    description: 'Achieve a personal fitness goal: run 5K without stopping, do 100 push-ups, hold plank for 5 minutes, or similar challenge',
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
    description: 'Go the entire day without engaging in a specific bad habit (smoking, junk food, excessive social media, etc.)',
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
    description: 'Complete a major endurance challenge: run 10K, hike for 3+ hours, bike 25+ miles, or swim 2+ miles',
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
    description: 'Deeply study a complex topic for 3+ hours: research thoroughly, take detailed notes, and create a summary or teach it to someone',
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
    description: 'Complete a major project deliverable: finish a presentation, submit a proposal, deploy code, or complete a significant work milestone',
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
    description: 'Stay completely offline for an entire day: no social media, news websites, entertainment apps, or non-essential digital devices',
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
    description: 'Completely reorganize a major life area: create a budget and financial plan, deep clean and organize your home, or overhaul your productivity system',
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
    description: 'Complete a 24-hour mindful fast with only water, using the time for reflection, meditation, and mental clarity (consult doctor if needed)',
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
    description: 'Create and publicly share significant creative work: publish a blog post/story, post artwork online, perform music, or showcase your creation to others',
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
