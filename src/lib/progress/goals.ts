import type { ProgressSummary } from "./types";

export type ProgressGoalCard = {
  title: string;
  detail: string;
  progress: number;
  category: string;
};

export function buildProgressGoalCards(summary: ProgressSummary | null): ProgressGoalCard[] {
  if (!summary) {
    return [];
  }

  const streakProgress = Math.min(100, Math.round((summary.currentStreak / 10) * 100));
  const levelProgress = Math.min(100, Math.round(((summary.xp % 100) / 100) * 100));

  return [
    {
      title: "Daily momentum",
      detail: `${summary.actionsToday} actions logged today`,
      progress: Math.min(100, summary.dailyProgress),
      category: "Daily",
    },
    {
      title: "Completion rate",
      detail: `${summary.completionPercentage}% completion across tracked actions`,
      progress: Math.min(100, summary.completionPercentage),
      category: "Performance",
    },
    {
      title: "Consistency streak",
      detail: `${summary.currentStreak} day streak`,
      progress: streakProgress,
      category: "Habits",
    },
    {
      title: "Level progress",
      detail: `Level ${summary.level} • ${summary.xp} XP`,
      progress: levelProgress,
      category: "Growth",
    },
  ];
}
