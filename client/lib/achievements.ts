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
  // Goal Completion Achievements
  {
    id: "first_goal",
    title: "Goal Setter",
    description: "Complete your first goal",
    icon: "🎯",
    category: "goals",
    rarity: "common",
    condition: (userData) => {
      const totalCompletions =
        userData.completedGoals?.reduce(
          (sum: number, goal: any) => sum + (goal.completedCount || 0),
          0,
        ) || 0;
      return totalCompletions >= 1;
    },
  },
  {
    id: "three_completions",
    title: "Building Momentum",
    description: "Complete 3 goals",
    icon: "🔥",
    category: "goals",
    rarity: "common",
    condition: (userData) => {
      const totalCompletions =
        userData.completedGoals?.reduce(
          (sum: number, goal: any) => sum + (goal.completedCount || 0),
          0,
        ) || 0;
      return totalCompletions >= 3;
    },
  },
  {
    id: "five_completions",
    title: "Goal Crusher",
    description: "Complete 5 goals",
    icon: "💪",
    category: "goals",
    rarity: "common",
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
    id: "ten_completions",
    title: "Goal Master",
    description: "Complete 10 goals",
    icon: "🏆",
    category: "goals",
    rarity: "rare",
    condition: (userData) => {
      const totalCompletions =
        userData.completedGoals?.reduce(
          (sum: number, goal: any) => sum + (goal.completedCount || 0),
          0,
        ) || 0;
      return totalCompletions >= 10;
    },
  },
  {
    id: "fifteen_completions",
    title: "Dedicated Achiever",
    description: "Complete 15 goals",
    icon: "⭐",
    category: "goals",
    rarity: "rare",
    condition: (userData) => {
      const totalCompletions =
        userData.completedGoals?.reduce(
          (sum: number, goal: any) => sum + (goal.completedCount || 0),
          0,
        ) || 0;
      return totalCompletions >= 15;
    },
  },
  {
    id: "twentyfive_completions",
    title: "Goal Veteran",
    description: "Complete 25 goals",
    icon: "🌟",
    category: "goals",
    rarity: "rare",
    condition: (userData) => {
      const totalCompletions =
        userData.completedGoals?.reduce(
          (sum: number, goal: any) => sum + (goal.completedCount || 0),
          0,
        ) || 0;
      return totalCompletions >= 25;
    },
  },
  {
    id: "fifty_completions",
    title: "Goal Expert",
    description: "Complete 50 goals",
    icon: "💎",
    category: "goals",
    rarity: "epic",
    condition: (userData) => {
      const totalCompletions =
        userData.completedGoals?.reduce(
          (sum: number, goal: any) => sum + (goal.completedCount || 0),
          0,
        ) || 0;
      return totalCompletions >= 50;
    },
  },
  {
    id: "seventyfive_completions",
    title: "Goal Virtuoso",
    description: "Complete 75 goals",
    icon: "🏅",
    category: "goals",
    rarity: "epic",
    condition: (userData) => {
      const totalCompletions =
        userData.completedGoals?.reduce(
          (sum: number, goal: any) => sum + (goal.completedCount || 0),
          0,
        ) || 0;
      return totalCompletions >= 75;
    },
  },
  {
    id: "hundred_completions",
    title: "Goal Legend",
    description: "Complete 100 goals",
    icon: "👑",
    category: "goals",
    rarity: "legendary",
    condition: (userData) => {
      const totalCompletions =
        userData.completedGoals?.reduce(
          (sum: number, goal: any) => sum + (goal.completedCount || 0),
          0,
        ) || 0;
      return totalCompletions >= 100;
    },
  },

  // Streak Achievements
  {
    id: "streak_one_week",
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
    id: "streak_two_weeks",
    title: "Fortnight Fighter",
    description: "Maintain a 14-day streak",
    icon: "⚡",
    category: "streaks",
    rarity: "common",
    condition: (userData) => {
      const maxStreak = Math.max(
        ...(userData.goals?.map((g: any) => g.streak || 0) || [0]),
      );
      return maxStreak >= 14;
    },
  },
  {
    id: "streak_one_month",
    title: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: "🌙",
    category: "streaks",
    rarity: "rare",
    condition: (userData) => {
      const maxStreak = Math.max(
        ...(userData.goals?.map((g: any) => g.streak || 0) || [0]),
      );
      return maxStreak >= 30;
    },
  },
  {
    id: "streak_three_months",
    title: "Quarterly Champion",
    description: "Maintain a 90-day streak",
    icon: "🏆",
    category: "streaks",
    rarity: "rare",
    condition: (userData) => {
      const maxStreak = Math.max(
        ...(userData.goals?.map((g: any) => g.streak || 0) || [0]),
      );
      return maxStreak >= 90;
    },
  },
  {
    id: "streak_six_months",
    title: "Half-Year Hero",
    description: "Maintain a 180-day streak",
    icon: "💫",
    category: "streaks",
    rarity: "epic",
    condition: (userData) => {
      const maxStreak = Math.max(
        ...(userData.goals?.map((g: any) => g.streak || 0) || [0]),
      );
      return maxStreak >= 180;
    },
  },
  {
    id: "streak_nine_months",
    title: "Triple Quarter Titan",
    description: "Maintain a 270-day streak",
    icon: "🌟",
    category: "streaks",
    rarity: "epic",
    condition: (userData) => {
      const maxStreak = Math.max(
        ...(userData.goals?.map((g: any) => g.streak || 0) || [0]),
      );
      return maxStreak >= 270;
    },
  },
  {
    id: "streak_one_year",
    title: "Annual Legend",
    description: "Maintain a 365-day streak",
    icon: "👑",
    category: "streaks",
    rarity: "legendary",
    condition: (userData) => {
      const maxStreak = Math.max(
        ...(userData.goals?.map((g: any) => g.streak || 0) || [0]),
      );
      return maxStreak >= 365;
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
    id: "clean_one_week",
    title: "First Week Clean",
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
    id: "clean_two_weeks",
    title: "Two Weeks Strong",
    description: "Stay clean for 14 days",
    icon: "💪",
    category: "milestones",
    rarity: "common",
    condition: (userData) => {
      const maxCleanDays = Math.max(
        ...(userData.addictions?.map((a: any) => a.cleanDays || 0) || [0]),
      );
      return maxCleanDays >= 14;
    },
  },
  {
    id: "clean_one_month",
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
    id: "clean_three_months",
    title: "Quarter Year Clean",
    description: "Stay clean for 90 days",
    icon: "🏆",
    category: "milestones",
    rarity: "rare",
    condition: (userData) => {
      const maxCleanDays = Math.max(
        ...(userData.addictions?.map((a: any) => a.cleanDays || 0) || [0]),
      );
      return maxCleanDays >= 90;
    },
  },
  {
    id: "clean_six_months",
    title: "Half Year Victory",
    description: "Stay clean for 180 days",
    icon: "🎖️",
    category: "milestones",
    rarity: "epic",
    condition: (userData) => {
      const maxCleanDays = Math.max(
        ...(userData.addictions?.map((a: any) => a.cleanDays || 0) || [0]),
      );
      return maxCleanDays >= 180;
    },
  },
  {
    id: "clean_nine_months",
    title: "Nine Month Warrior",
    description: "Stay clean for 270 days",
    icon: "⚔️",
    category: "milestones",
    rarity: "epic",
    condition: (userData) => {
      const maxCleanDays = Math.max(
        ...(userData.addictions?.map((a: any) => a.cleanDays || 0) || [0]),
      );
      return maxCleanDays >= 270;
    },
  },
  {
    id: "clean_one_year",
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
  {
    id: "clean_two_years",
    title: "Two Year Champion",
    description: "Stay clean for 730 days",
    icon: "🥇",
    category: "milestones",
    rarity: "legendary",
    condition: (userData) => {
      const maxCleanDays = Math.max(
        ...(userData.addictions?.map((a: any) => a.cleanDays || 0) || [0]),
      );
      return maxCleanDays >= 730;
    },
  },
  {
    id: "clean_three_years",
    title: "Three Year Master",
    description: "Stay clean for 1095 days",
    icon: "🏆",
    category: "milestones",
    rarity: "legendary",
    condition: (userData) => {
      const maxCleanDays = Math.max(
        ...(userData.addictions?.map((a: any) => a.cleanDays || 0) || [0]),
      );
      return maxCleanDays >= 1095;
    },
  },
  {
    id: "clean_five_years",
    title: "Five Year Legend",
    description: "Stay clean for 1825 days",
    icon: "👑",
    category: "milestones",
    rarity: "legendary",
    condition: (userData) => {
      const maxCleanDays = Math.max(
        ...(userData.addictions?.map((a: any) => a.cleanDays || 0) || [0]),
      );
      return maxCleanDays >= 1825;
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
