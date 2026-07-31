export const PROGRESS_DAILY_CAP = 100;

export const ACTION_TYPE_CONFIG = {
  lesson_completed: { dailyPoints: 35, xp: 25 },
  coaching_session_completed: { dailyPoints: 25, xp: 18 },
  habit_completed: { dailyPoints: 20, xp: 14 },
  task_completed: { dailyPoints: 20, xp: 12 },
} as const;

export type ProgressActionType = keyof typeof ACTION_TYPE_CONFIG;

export function isProgressActionType(value: string): value is ProgressActionType {
  return value in ACTION_TYPE_CONFIG;
}

export function getActionConfig(actionType: ProgressActionType) {
  return ACTION_TYPE_CONFIG[actionType];
}

export function clampDailyProgress(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > PROGRESS_DAILY_CAP) {
    return PROGRESS_DAILY_CAP;
  }
  return Math.round(value);
}
