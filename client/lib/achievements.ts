export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "goals" | "streaks" | "discipline" | "consistency" | "milestones";
  rarity: "common" | "rare" | "epic" | "legendary";
  condition: (userData: any) => boolean;
  earnedAt?: Date;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Goal Achievements
  {
    id: "first_goal",
    title: "Goal Setter",
    description: "Complete your first goal",
    icon: "🎯",
    category: "goals",
    rarity: "common",
    condition: (userData) => (userData.completedGoals?.length || 0) >= 1,
  },
  {
    id: "five_goals",
    title: "Goal Crusher",
    description: "Complete 5 goals",
    icon: "💪",
    category: "goals",
    rarity: "rare",
    condition: (userData) => {
      const totalCompletions =
        userData.completedGoals?.reduce(
          (sum: number, goal: any) => sum + (goal.completedCount || 0),
          0,
        ) || 0;
      return totalCompletions >= 5;
    },
  },
  {
    id: "ten_goals",
    title: "Goal Master",
    description: "Complete 10 goals",
    icon: "🏆",
    category: "goals",
    rarity: "epic",
    condition: (userData) => {
      const totalCompletions =
        userData.completedGoals?.reduce(
          (sum: number, goal: any) => sum + (goal.completedCount || 0),
          0,
        ) || 0;
      return totalCompletions >= 10;
    },
  },

  // Streak Achievements
  {
    id: "first_week",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    category: "streaks",
    rarity: "common",
    condition: (userData) => {
      const maxStreak = Math.max(
        ...(userData.goals?.map((g: any) => g.streak || 0) || [0]),
      );
      return maxStreak >= 7;
    },
  },
  {
    id: "habit_former",
    title: "Habit Former",
    description: "Maintain a 21-day streak",
    icon: "⚡",
    category: "streaks",
    rarity: "rare",
    condition: (userData) => {
      const maxStreak = Math.max(
        ...(userData.goals?.map((g: any) => g.streak || 0) || [0]),
      );
      return maxStreak >= 21;
    },
  },
  {
    id: "unstoppable",
    title: "Unstoppable",
    description: "Maintain a 50-day streak",
    icon: "🚀",
    category: "streaks",
    rarity: "epic",
    condition: (userData) => {
      const maxStreak = Math.max(
        ...(userData.goals?.map((g: any) => g.streak || 0) || [0]),
      );
      return maxStreak >= 50;
    },
  },
  {
    id: "legend",
    title: "Legend",
    description: "Maintain a 100-day streak",
    icon: "👑",
    category: "streaks",
    rarity: "legendary",
    condition: (userData) => {
      const maxStreak = Math.max(
        ...(userData.goals?.map((g: any) => g.streak || 0) || [0]),
      );
      return maxStreak >= 100;
    },
  },

  // Discipline Achievements
  {
    id: "discipline_b",
    title: "Rising Discipline",
    description: "Reach B rank in discipline",
    icon: "📈",
    category: "discipline",
    rarity: "common",
    condition: (userData) => {
      const rank = userData.disciplineData?.currentRank || "F-";
      const bRanks = ["B-", "B", "B+", "A-", "A", "A+"];
      return bRanks.includes(rank);
    },
  },
  {
    id: "discipline_a",
    title: "Disciplined Mind",
    description: "Reach A rank in discipline",
    icon: "🧠",
    category: "discipline",
    rarity: "epic",
    condition: (userData) => {
      const rank = userData.disciplineData?.currentRank || "F-";
      const aRanks = ["A-", "A", "A+"];
      return aRanks.includes(rank);
    },
  },
  {
    id: "discipline_plus",
    title: "Perfect Discipline",
    description: "Reach A+ rank in discipline",
    icon: "✨",
    category: "discipline",
    rarity: "legendary",
    condition: (userData) => userData.disciplineData?.currentRank === "A+",
  },

  // Consistency Achievements
  {
    id: "consistency_80",
    title: "Consistent Performer",
    description: "Maintain 80% consistency",
    icon: "📊",
    category: "consistency",
    rarity: "rare",
    condition: (userData) =>
      (userData.disciplineData?.consistencyScore || 0) >= 80,
  },
  {
    id: "consistency_95",
    title: "Perfectionist",
    description: "Maintain 95% consistency",
    icon: "💎",
    category: "consistency",
    rarity: "epic",
    condition: (userData) =>
      (userData.disciplineData?.consistencyScore || 0) >= 95,
  },

  // Recovery Achievements
  {
    id: "clean_week",
    title: "Clean Week",
    description: "Stay clean for 7 days",
    icon: "🌟",
    category: "milestones",
    rarity: "common",
    condition: (userData) => {
      const maxCleanDays = Math.max(
        ...(userData.addictions?.map((a: any) => a.cleanDays || 0) || [0]),
      );
      return maxCleanDays >= 7;
    },
  },
  {
    id: "clean_month",
    title: "Clean Month",
    description: "Stay clean for 30 days",
    icon: "🎊",
    category: "milestones",
    rarity: "rare",
    condition: (userData) => {
      const maxCleanDays = Math.max(
        ...(userData.addictions?.map((a: any) => a.cleanDays || 0) || [0]),
      );
      return maxCleanDays >= 30;
    },
  },
  {
    id: "clean_year",
    title: "Year of Freedom",
    description: "Stay clean for 365 days",
    icon: "🏅",
    category: "milestones",
    rarity: "legendary",
    condition: (userData) => {
      const maxCleanDays = Math.max(
        ...(userData.addictions?.map((a: any) => a.cleanDays || 0) || [0]),
      );
      return maxCleanDays >= 365;
    },
  },

  // Special Achievements
  {
    id: "multi_goal",
    title: "Multitasker",
    description: "Have 3 active goals simultaneously",
    icon: "🎭",
    category: "goals",
    rarity: "rare",
    condition: (userData) =>
      (userData.goals?.filter((g: any) => !g.isCompleted).length || 0) >= 3,
  },
  {
    id: "balanced_life",
    title: "Balanced Life",
    description: "Have active goals in 3 different categories",
    icon: "⚖️",
    category: "goals",
    rarity: "epic",
    condition: (userData) => {
      const categories = new Set(
        userData.goals
          ?.filter((g: any) => !g.isCompleted)
          .map((g: any) => g.category) || [],
      );
      return categories.size >= 3;
    },
  },
];

export function checkAchievements(
  userData: any,
  previousUserData?: any,
): Achievement[] {
  const newlyEarned: Achievement[] = [];

  ACHIEVEMENTS.forEach((achievement) => {
    const wasEarned = userData.achievements?.some(
      (a: any) => a.id === achievement.id,
    );
    const isNowEarned = achievement.condition(userData);

    if (!wasEarned && isNowEarned) {
      newlyEarned.push({
        ...achievement,
        earnedAt: new Date(),
      });
    }
  });

  return newlyEarned;
}

export function getEarnedAchievements(userData: any): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) =>
    userData.achievements?.some((a: any) => a.id === achievement.id),
  ).map((achievement) => ({
    ...achievement,
    earnedAt: userData.achievements?.find((a: any) => a.id === achievement.id)
      ?.earnedAt,
  }));
}

export function getRarityColor(rarity: Achievement["rarity"]): string {
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

export function getRarityBorder(rarity: Achievement["rarity"]): string {
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
