import { QuestTemplate, QuestDifficulty, QuestCategory, QUEST_XP_VALUES } from './quest-types';

/**
 * Quest templates database - 7 quests per difficulty level
 * These will be used to generate daily quests based on user preferences
 */

export const QUEST_TEMPLATES: QuestTemplate[] = [
  // EASY QUESTS (5 XP each)
  {
    id: 'easy_water_8_glasses',
    title: 'Hydrate Yourself',
    description: 'Drink 8 glasses of water throughout the day',
    category: 'health',
    difficulty: 'easy',
    xpReward: QUEST_XP_VALUES.easy,
    icon: '💧',
    estimatedTime: '5 minutes',
    requiresTracking: true,
  },
  {
    id: 'easy_walk_10_minutes',
    title: 'Quick Walk',
    description: 'Take a 10-minute walk outside or around your home',
    category: 'fitness',
    difficulty: 'easy',
    xpReward: QUEST_XP_VALUES.easy,
    icon: '🚶‍♂️',
    estimatedTime: '10 minutes',
    requiresTracking: true,
  },
  {
    id: 'easy_read_10_pages',
    title: 'Daily Reading',
    description: 'Read 10 pages of any book or educational material',
    category: 'learning',
    difficulty: 'easy',
    xpReward: QUEST_XP_VALUES.easy,
    icon: '📖',
    estimatedTime: '15 minutes',
    requiresTracking: true,
  },
  {
    id: 'easy_gratitude_3_things',
    title: 'Gratitude Practice',
    description: 'Write down 3 things you are grateful for today',
    category: 'mindfulness',
    difficulty: 'easy',
    xpReward: QUEST_XP_VALUES.easy,
    icon: '🙏',
    estimatedTime: '5 minutes',
    requiresTracking: true,
  },
  {
    id: 'easy_organize_desk',
    title: 'Tidy Workspace',
    description: 'Organize and clean your desk or workspace',
    category: 'productivity',
    difficulty: 'easy',
    xpReward: QUEST_XP_VALUES.easy,
    icon: '🗂️',
    estimatedTime: '15 minutes',
    requiresTracking: true,
  },
  {
    id: 'easy_call_friend_family',
    title: 'Connect with Loved Ones',
    description: 'Call or message a friend or family member to check in',
    category: 'social',
    difficulty: 'easy',
    xpReward: QUEST_XP_VALUES.easy,
    icon: '📞',
    estimatedTime: '10 minutes',
    requiresTracking: true,
  },
  {
    id: 'easy_creative_doodle',
    title: 'Creative Moment',
    description: 'Spend 10 minutes doodling, drawing, or being creative',
    category: 'creativity',
    difficulty: 'easy',
    xpReward: QUEST_XP_VALUES.easy,
    icon: '🎨',
    estimatedTime: '10 minutes',
    requiresTracking: true,
  },

  // MODERATE QUESTS (10 XP each)
  {
    id: 'moderate_exercise_30_min',
    title: 'Workout Session',
    description: 'Complete a 30-minute workout or exercise routine',
    category: 'fitness',
    difficulty: 'moderate',
    xpReward: QUEST_XP_VALUES.moderate,
    icon: '💪',
    estimatedTime: '30 minutes',
    requiresTracking: true,
  },
  {
    id: 'moderate_meditate_15_min',
    title: 'Mindful Meditation',
    description: 'Practice meditation or mindfulness for 15 minutes',
    category: 'mindfulness',
    difficulty: 'moderate',
    xpReward: QUEST_XP_VALUES.moderate,
    icon: '🧘‍♀️',
    estimatedTime: '15 minutes',
    requiresTracking: true,
  },
  {
    id: 'moderate_learn_new_skill',
    title: 'Skill Development',
    description: 'Spend 45 minutes learning a new skill or language',
    category: 'learning',
    difficulty: 'moderate',
    xpReward: QUEST_XP_VALUES.moderate,
    icon: '🎓',
    estimatedTime: '45 minutes',
    requiresTracking: true,
  },
  {
    id: 'moderate_cook_healthy_meal',
    title: 'Healthy Chef',
    description: 'Cook a nutritious meal from scratch instead of ordering out',
    category: 'health',
    difficulty: 'moderate',
    xpReward: QUEST_XP_VALUES.moderate,
    icon: '🥗',
    estimatedTime: '45 minutes',
    requiresTracking: true,
  },
  {
    id: 'moderate_work_project_1hr',
    title: 'Focused Work Session',
    description: 'Work on an important project for 1 hour without distractions',
    category: 'career',
    difficulty: 'moderate',
    xpReward: QUEST_XP_VALUES.moderate,
    icon: '💼',
    estimatedTime: '1 hour',
    requiresTracking: true,
  },
  {
    id: 'moderate_digital_detox_2hr',
    title: 'Digital Detox',
    description: 'Stay off social media and unnecessary apps for 2 hours',
    category: 'recovery',
    difficulty: 'moderate',
    xpReward: QUEST_XP_VALUES.moderate,
    icon: '📵',
    estimatedTime: '2 hours',
    requiresTracking: true,
  },
  {
    id: 'moderate_creative_project',
    title: 'Creative Project',
    description: 'Work on a creative project for 30 minutes (writing, art, music, etc.)',
    category: 'creativity',
    difficulty: 'moderate',
    xpReward: QUEST_XP_VALUES.moderate,
    icon: '✨',
    estimatedTime: '30 minutes',
    requiresTracking: true,
  },

  // HARD QUESTS (20 XP each)
  {
    id: 'hard_intense_workout_45min',
    title: 'Intense Training',
    description: 'Complete a challenging 45-minute workout or gym session',
    category: 'fitness',
    difficulty: 'hard',
    xpReward: QUEST_XP_VALUES.hard,
    icon: '🔥',
    estimatedTime: '45 minutes',
    requiresTracking: true,
  },
  {
    id: 'hard_complete_course_chapter',
    title: 'Knowledge Quest',
    description: 'Complete an entire chapter or module of an online course',
    category: 'learning',
    difficulty: 'hard',
    xpReward: QUEST_XP_VALUES.hard,
    icon: '📚',
    estimatedTime: '1.5 hours',
    requiresTracking: true,
  },
  {
    id: 'hard_networking_reach_out',
    title: 'Network Builder',
    description: 'Reach out to 3 professional contacts or make new career connections',
    category: 'career',
    difficulty: 'hard',
    xpReward: QUEST_XP_VALUES.hard,
    icon: '🤝',
    estimatedTime: '1 hour',
    requiresTracking: true,
  },
  {
    id: 'hard_meal_prep_week',
    title: 'Meal Prep Master',
    description: 'Prepare healthy meals for the entire week',
    category: 'health',
    difficulty: 'hard',
    xpReward: QUEST_XP_VALUES.hard,
    icon: '🍱',
    estimatedTime: '2 hours',
    requiresTracking: true,
  },
  {
    id: 'hard_deep_work_2hr',
    title: 'Deep Work Session',
    description: 'Complete 2 hours of focused, high-priority work without interruptions',
    category: 'productivity',
    difficulty: 'hard',
    xpReward: QUEST_XP_VALUES.hard,
    icon: '⚡',
    estimatedTime: '2 hours',
    requiresTracking: true,
  },
  {
    id: 'hard_social_event_attend',
    title: 'Social Butterfly',
    description: 'Attend a social event or organize a gathering with friends',
    category: 'social',
    difficulty: 'hard',
    xpReward: QUEST_XP_VALUES.hard,
    icon: '🎉',
    estimatedTime: '2-3 hours',
    requiresTracking: true,
  },
  {
    id: 'hard_creative_complete_piece',
    title: 'Creative Masterpiece',
    description: 'Complete a significant creative piece (story, artwork, song, etc.)',
    category: 'creativity',
    difficulty: 'hard',
    xpReward: QUEST_XP_VALUES.hard,
    icon: '🖼️',
    estimatedTime: '2-3 hours',
    requiresTracking: true,
  },

  // VERY HARD QUESTS (30 XP each)
  {
    id: 'very_hard_marathon_training',
    title: 'Endurance Challenge',
    description: 'Complete a long endurance activity (10K run, 2-hour hike, etc.)',
    category: 'fitness',
    difficulty: 'very_hard',
    xpReward: QUEST_XP_VALUES.very_hard,
    icon: '🏃‍♂️',
    estimatedTime: '2+ hours',
    requiresTracking: true,
  },
  {
    id: 'very_hard_learn_complex_topic',
    title: 'Master Complex Topic',
    description: 'Deeply study and understand a complex topic for 3+ hours',
    category: 'learning',
    difficulty: 'very_hard',
    xpReward: QUEST_XP_VALUES.very_hard,
    icon: '🧠',
    estimatedTime: '3+ hours',
    requiresTracking: true,
  },
  {
    id: 'very_hard_major_project_milestone',
    title: 'Project Milestone',
    description: 'Complete a major milestone or deliverable for an important project',
    category: 'career',
    difficulty: 'very_hard',
    xpReward: QUEST_XP_VALUES.very_hard,
    icon: '🎯',
    estimatedTime: '4+ hours',
    requiresTracking: true,
  },
  {
    id: 'very_hard_digital_detox_full_day',
    title: 'Complete Digital Fast',
    description: 'Stay completely off social media and non-essential digital devices for an entire day',
    category: 'recovery',
    difficulty: 'very_hard',
    xpReward: QUEST_XP_VALUES.very_hard,
    icon: '🚫',
    estimatedTime: 'Full day',
    requiresTracking: true,
  },
  {
    id: 'very_hard_organize_life_area',
    title: 'Life Organization',
    description: 'Completely organize and optimize a major area of your life (finances, schedule, living space)',
    category: 'productivity',
    difficulty: 'very_hard',
    xpReward: QUEST_XP_VALUES.very_hard,
    icon: '📋',
    estimatedTime: '3-4 hours',
    requiresTracking: true,
  },
  {
    id: 'very_hard_fasting_24hr',
    title: 'Mindful Fasting',
    description: 'Complete a 24-hour mindful fast (with proper preparation and safety)',
    category: 'mindfulness',
    difficulty: 'very_hard',
    xpReward: QUEST_XP_VALUES.very_hard,
    icon: '🕯️',
    estimatedTime: '24 hours',
    requiresTracking: true,
  },
  {
    id: 'very_hard_creative_exhibition',
    title: 'Creative Exhibition',
    description: 'Create and share/exhibit your creative work publicly (publish, perform, display)',
    category: 'creativity',
    difficulty: 'very_hard',
    xpReward: QUEST_XP_VALUES.very_hard,
    icon: '🌟',
    estimatedTime: '4+ hours',
    requiresTracking: true,
  },
];

// Helper functions for quest template management
export function getQuestTemplatesByDifficulty(difficulty: QuestDifficulty): QuestTemplate[] {
  return QUEST_TEMPLATES.filter(template => template.difficulty === difficulty);
}

export function getQuestTemplatesByCategory(category: QuestCategory): QuestTemplate[] {
  return QUEST_TEMPLATES.filter(template => template.category === category);
}

export function getQuestTemplateById(id: string): QuestTemplate | undefined {
  return QUEST_TEMPLATES.find(template => template.id === id);
}

export function getRandomQuestTemplate(
  difficulty: QuestDifficulty,
  excludeIds: string[] = [],
  preferredCategories?: QuestCategory[]
): QuestTemplate | null {
  let availableTemplates = getQuestTemplatesByDifficulty(difficulty)
    .filter(template => !excludeIds.includes(template.id));

  // If preferred categories are specified, try to find from those first
  if (preferredCategories && preferredCategories.length > 0) {
    const preferredTemplates = availableTemplates.filter(template => 
      preferredCategories.includes(template.category)
    );
    if (preferredTemplates.length > 0) {
      availableTemplates = preferredTemplates;
    }
  }

  if (availableTemplates.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableTemplates.length);
  return availableTemplates[randomIndex];
}

// Validate that we have exactly 7 quests per difficulty
const easyQuests = getQuestTemplatesByDifficulty('easy');
const moderateQuests = getQuestTemplatesByDifficulty('moderate');
const hardQuests = getQuestTemplatesByDifficulty('hard');
const veryHardQuests = getQuestTemplatesByDifficulty('very_hard');

if (easyQuests.length !== 7 || moderateQuests.length !== 7 || 
    hardQuests.length !== 7 || veryHardQuests.length !== 7) {
  console.warn('Quest template count validation failed:', {
    easy: easyQuests.length,
    moderate: moderateQuests.length,
    hard: hardQuests.length,
    very_hard: veryHardQuests.length,
  });
}
