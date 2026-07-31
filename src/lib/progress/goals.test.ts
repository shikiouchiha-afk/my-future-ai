import { describe, expect, it } from "vitest";
import { buildProgressGoalCards } from "./goals";
import type { ProgressSummary } from "./types";

function summary(overrides: Partial<ProgressSummary> = {}): ProgressSummary {
  return {
    timezone: "UTC",
    localDate: "2026-07-30",
    dailyProgress: 78,
    completionPercentage: 82,
    xp: 240,
    level: 3,
    currentStreak: 6,
    longestStreak: 9,
    totalCompletions: 24,
    actionsToday: 3,
    lastCompletionAt: "2026-07-30T10:00:00.000Z",
    ...overrides,
  };
}

describe("buildProgressGoalCards", () => {
  it("maps real progress metrics into goal cards", () => {
    const cards = buildProgressGoalCards(summary());

    expect(cards).toHaveLength(4);
    expect(cards[0]).toMatchObject({
      title: "Daily momentum",
      progress: 78,
      detail: "3 actions logged today",
    });
    expect(cards[1]).toMatchObject({
      title: "Completion rate",
      progress: 82,
    });
    expect(cards[2]).toMatchObject({
      title: "Consistency streak",
      progress: 60,
    });
    expect(cards[3]).toMatchObject({
      title: "Level progress",
      progress: 40,
    });
  });

  it("returns an empty list when there is no summary", () => {
    expect(buildProgressGoalCards(null)).toEqual([]);
  });
});
