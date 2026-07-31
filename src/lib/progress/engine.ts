import { clampDailyProgress, PROGRESS_DAILY_CAP } from "@/lib/progress/constants";
import type { ProgressEventRecord, ProgressSummary } from "@/lib/progress/types";

const LEVEL_XP_STEP = 100;

function previousDateKey(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

function computeLongestStreak(activeDates: string[]) {
  if (activeDates.length === 0) {
    return 0;
  }

  let longest = 1;
  let run = 1;

  for (let index = 1; index < activeDates.length; index += 1) {
    const previous = activeDates[index - 1];
    const current = activeDates[index];

    if (previousDateKey(current) === previous) {
      run += 1;
      if (run > longest) {
        longest = run;
      }
    } else {
      run = 1;
    }
  }

  return longest;
}

function computeCurrentStreak(activeDateSet: Set<string>, latestDate: string | null) {
  if (!latestDate) {
    return 0;
  }

  let streak = 0;
  let cursor = latestDate;

  while (activeDateSet.has(cursor)) {
    streak += 1;
    cursor = previousDateKey(cursor);
  }

  return streak;
}

export function calculateProgressSummaryFromEvents(params: {
  timezone: string;
  localDate: string;
  events: ProgressEventRecord[];
}): ProgressSummary {
  const { timezone, localDate, events } = params;

  const uniqueEvents = new Map<string, ProgressEventRecord>();
  for (const event of events) {
    if (!uniqueEvents.has(event.completionId)) {
      uniqueEvents.set(event.completionId, event);
    }
  }

  const deduped = Array.from(uniqueEvents.values());
  const xp = deduped.reduce((sum, event) => sum + event.xpEarned, 0);
  const level = Math.floor(xp / LEVEL_XP_STEP) + 1;

  let dailyPoints = 0;
  let actionsToday = 0;

  for (const event of deduped) {
    if (event.localDate === localDate) {
      dailyPoints += event.dailyPoints;
      actionsToday += 1;
    }
  }

  const dailyProgress = clampDailyProgress(Math.min(PROGRESS_DAILY_CAP, dailyPoints));
  const completionPercentage = dailyProgress;

  const activeDateSet = new Set(deduped.map((event) => event.localDate));
  const activeDates = Array.from(activeDateSet).sort();
  const latestDate = activeDates.length > 0 ? activeDates[activeDates.length - 1] : null;
  const currentStreak = computeCurrentStreak(activeDateSet, latestDate);
  const longestStreak = computeLongestStreak(activeDates);

  const lastCompletionAt = deduped
    .map((event) => event.occurredAt)
    .sort()
    .at(-1) ?? null;

  return {
    timezone,
    localDate,
    dailyProgress,
    completionPercentage,
    xp,
    level,
    currentStreak,
    longestStreak,
    totalCompletions: deduped.length,
    actionsToday,
    lastCompletionAt,
  };
}
