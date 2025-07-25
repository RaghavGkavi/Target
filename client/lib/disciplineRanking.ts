interface DisciplineData {
  baseScore: number; // 0-100 from assessment
  totalCompletions: number;
  consistencyScore: number;
  lastUpdated: Date;
}

export const DISCIPLINE_RANKS = [
  'F-', 'F', 'F+', 
  'D-', 'D', 'D+', 
  'C-', 'C', 'C+', 
  'B-', 'B', 'B+', 
  'A-', 'A', 'A+'
] as const;

export type DisciplineRank = typeof DISCIPLINE_RANKS[number];

export function calculateDisciplineRank(
  baseScore: number,
  totalCompletions: number,
  consistencyScore: number,
  activeGoals: any[] = [],
  completedGoals: any[] = []
): DisciplineRank {
  // Base score from assessment (0-100)
  let finalScore = baseScore;
  
  // Bonus points for total completions (up to +20 points)
  const completionBonus = Math.min(20, totalCompletions * 0.5);
  finalScore += completionBonus;
  
  // Bonus points for consistency (up to +15 points)
  const consistencyBonus = (consistencyScore / 100) * 15;
  finalScore += consistencyBonus;
  
  // Bonus for current active streaks (up to +10 points)
  const totalStreaks = activeGoals.reduce((sum: number, goal: any) => sum + (goal.streak || 0), 0);
  const streakBonus = Math.min(10, totalStreaks * 0.2);
  finalScore += streakBonus;
  
  // Bonus for completed goal cycles (up to +15 points)
  const completedCycles = completedGoals.reduce((sum: number, goal: any) => sum + (goal.completedCount || 0), 0);
  const cycleBonus = Math.min(15, completedCycles * 1);
  finalScore += cycleBonus;
  
  // Cap at 100
  finalScore = Math.min(100, finalScore);
  
  // Convert to rank (each rank spans ~6.67 points)
  const rankIndex = Math.min(14, Math.floor(finalScore / 6.67));
  return DISCIPLINE_RANKS[rankIndex];
}

export function calculateConsistencyScore(goals: any[]): number {
  if (goals.length === 0) return 0;
  
  const totalPossibleDays = goals.reduce((sum, goal) => sum + goal.targetDays, 0);
  const totalCompletedDays = goals.reduce((sum, goal) => sum + goal.daysCompleted, 0);
  
  if (totalPossibleDays === 0) return 0;
  
  return Math.round((totalCompletedDays / totalPossibleDays) * 100);
}

export function getDisciplineRankInfo(rank: DisciplineRank) {
  const rankIndex = DISCIPLINE_RANKS.indexOf(rank);
  const isTopTier = rankIndex >= 12; // A-, A, A+
  const isHighTier = rankIndex >= 9; // B-, B, B+, A-, A, A+
  const isMidTier = rankIndex >= 6; // C-, C, C+, B-, B, B+, A-, A, A+
  
  return {
    rank,
    color: isTopTier ? 'text-yellow-500' : isHighTier ? 'text-green-500' : isMidTier ? 'text-blue-500' : 'text-red-500',
    bgColor: isTopTier ? 'bg-yellow-100 dark:bg-yellow-900/20' : isHighTier ? 'bg-green-100 dark:bg-green-900/20' : isMidTier ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-red-100 dark:bg-red-900/20',
    description: isTopTier ? 'Exceptional Discipline' : isHighTier ? 'Strong Discipline' : isMidTier ? 'Developing Discipline' : 'Building Discipline',
    emoji: isTopTier ? '🏆' : isHighTier ? '💪' : isMidTier ? '📈' : '🌱'
  };
}

export function getNextRankInfo(currentRank: DisciplineRank) {
  const currentIndex = DISCIPLINE_RANKS.indexOf(currentRank);
  if (currentIndex === DISCIPLINE_RANKS.length - 1) {
    return null; // Already at max rank
  }
  
  const nextRank = DISCIPLINE_RANKS[currentIndex + 1];
  const pointsNeeded = Math.ceil((currentIndex + 2) * 6.67 - (currentIndex + 1) * 6.67);
  
  return {
    rank: nextRank,
    pointsNeeded
  };
}

// Assessment questions for determining base discipline score
export const DISCIPLINE_ASSESSMENT = [
  {
    id: 'wake_time',
    question: 'How consistent is your wake-up time?',
    options: [
      { text: 'Same time every day (±15 minutes)', points: 20 },
      { text: 'Usually consistent (±30 minutes)', points: 15 },
      { text: 'Somewhat consistent (±1 hour)', points: 10 },
      { text: 'Varies significantly (±2+ hours)', points: 5 },
      { text: 'No consistent schedule', points: 0 }
    ]
  },
  {
    id: 'exercise',
    question: 'How often do you exercise or do physical activity?',
    options: [
      { text: 'Daily or almost daily', points: 20 },
      { text: '4-5 times per week', points: 15 },
      { text: '2-3 times per week', points: 10 },
      { text: 'Once a week or less', points: 5 },
      { text: 'Rarely or never', points: 0 }
    ]
  },
  {
    id: 'planning',
    question: 'How often do you plan your day or week ahead?',
    options: [
      { text: 'Always plan and follow through', points: 20 },
      { text: 'Usually plan and mostly follow through', points: 15 },
      { text: 'Sometimes plan but often deviate', points: 10 },
      { text: 'Rarely plan ahead', points: 5 },
      { text: 'Never plan, go with the flow', points: 0 }
    ]
  },
  {
    id: 'habits',
    question: 'How successful are you at maintaining good habits?',
    options: [
      { text: 'Very successful, rarely break habits', points: 20 },
      { text: 'Usually successful with occasional lapses', points: 15 },
      { text: 'Moderately successful, some consistency', points: 10 },
      { text: 'Struggle but keep trying', points: 5 },
      { text: 'Very difficult to maintain habits', points: 0 }
    ]
  },
  {
    id: 'procrastination',
    question: 'How often do you procrastinate on important tasks?',
    options: [
      { text: 'Rarely, I tackle things immediately', points: 20 },
      { text: 'Sometimes, but usually get things done', points: 15 },
      { text: 'Often, but eventually complete tasks', points: 10 },
      { text: 'Frequently, causes stress and delays', points: 5 },
      { text: 'Almost always, major struggle', points: 0 }
    ]
  }
];
