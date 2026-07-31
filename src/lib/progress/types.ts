import type { ProgressActionType } from "@/lib/progress/constants";

export type ProgressEventRecord = {
  completionId: string;
  actionType: ProgressActionType;
  localDate: string;
  occurredAt: string;
  xpEarned: number;
  dailyPoints: number;
};

export type ProgressSummary = {
  timezone: string;
  localDate: string;
  dailyProgress: number;
  completionPercentage: number;
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  actionsToday: number;
  lastCompletionAt: string | null;
};

export type ProgressCompletePayload = {
  completionId: string;
  actionType: ProgressActionType;
  occurredAt?: string;
  source?: string;
  metadata?: Record<string, unknown>;
};
