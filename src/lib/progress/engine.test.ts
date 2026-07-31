import { describe, expect, it } from "vitest";
import { calculateProgressSummaryFromEvents } from "./engine";
import { toLocalDateKey } from "./server";
import type { ProgressEventRecord } from "./types";

function event(input: Partial<ProgressEventRecord> & Pick<ProgressEventRecord, "completionId" | "localDate">): ProgressEventRecord {
  return {
    completionId: input.completionId,
    actionType: input.actionType ?? "task_completed",
    localDate: input.localDate,
    occurredAt: input.occurredAt ?? `${input.localDate}T12:00:00.000Z`,
    xpEarned: input.xpEarned ?? 12,
    dailyPoints: input.dailyPoints ?? 20,
  };
}

describe("progress engine", () => {
  it("caps daily progress at 100%", () => {
    const events = [
      event({ completionId: "a", localDate: "2026-07-30", dailyPoints: 35 }),
      event({ completionId: "b", localDate: "2026-07-30", dailyPoints: 35 }),
      event({ completionId: "c", localDate: "2026-07-30", dailyPoints: 35 }),
    ];

    const summary = calculateProgressSummaryFromEvents({
      timezone: "UTC",
      localDate: "2026-07-30",
      events,
    });

    expect(summary.dailyProgress).toBe(100);
    expect(summary.completionPercentage).toBe(100);
  });

  it("does not double count duplicate completion IDs", () => {
    const events = [
      event({ completionId: "same", localDate: "2026-07-30", xpEarned: 18, dailyPoints: 25 }),
      event({ completionId: "same", localDate: "2026-07-30", xpEarned: 18, dailyPoints: 25 }),
    ];

    const summary = calculateProgressSummaryFromEvents({
      timezone: "UTC",
      localDate: "2026-07-30",
      events,
    });

    expect(summary.totalCompletions).toBe(1);
    expect(summary.xp).toBe(18);
    expect(summary.dailyProgress).toBe(25);
  });

  it("is stable across repeated recalculations (refresh-safe)", () => {
    const events = [
      event({ completionId: "1", localDate: "2026-07-30", xpEarned: 14, dailyPoints: 20 }),
      event({ completionId: "2", localDate: "2026-07-30", xpEarned: 14, dailyPoints: 20 }),
    ];

    const first = calculateProgressSummaryFromEvents({
      timezone: "UTC",
      localDate: "2026-07-30",
      events,
    });

    const second = calculateProgressSummaryFromEvents({
      timezone: "UTC",
      localDate: "2026-07-30",
      events,
    });

    expect(second).toEqual(first);
  });

  it("updates streaks correctly across multiple consecutive days", () => {
    const events = [
      event({ completionId: "d1", localDate: "2026-07-28" }),
      event({ completionId: "d2", localDate: "2026-07-29" }),
      event({ completionId: "d3", localDate: "2026-07-30" }),
    ];

    const summary = calculateProgressSummaryFromEvents({
      timezone: "UTC",
      localDate: "2026-07-30",
      events,
    });

    expect(summary.currentStreak).toBe(3);
    expect(summary.longestStreak).toBe(3);
  });

  it("resets daily progress at local midnight while preserving streak history", () => {
    const events = [
      event({ completionId: "y1", localDate: "2026-07-30", dailyPoints: 40 }),
      event({ completionId: "y2", localDate: "2026-07-30", dailyPoints: 40 }),
    ];

    const summaryNextDay = calculateProgressSummaryFromEvents({
      timezone: "UTC",
      localDate: "2026-07-31",
      events,
    });

    expect(summaryNextDay.dailyProgress).toBe(0);
    expect(summaryNextDay.currentStreak).toBe(1);
    expect(summaryNextDay.longestStreak).toBe(1);
  });

  it("uses local timezone date keys for midnight boundaries", () => {
    const utcMoment = new Date("2026-08-01T06:30:00.000Z");
    const losAngelesDate = toLocalDateKey(utcMoment, "America/Los_Angeles");

    expect(losAngelesDate).toBe("2026-07-31");
  });

  it("keeps derived values aligned with event ledger totals", () => {
    const events = [
      event({ completionId: "p1", localDate: "2026-07-30", xpEarned: 25, dailyPoints: 35 }),
      event({ completionId: "p2", localDate: "2026-07-30", xpEarned: 18, dailyPoints: 25 }),
      event({ completionId: "p3", localDate: "2026-07-29", xpEarned: 12, dailyPoints: 20 }),
    ];

    const summary = calculateProgressSummaryFromEvents({
      timezone: "UTC",
      localDate: "2026-07-30",
      events,
    });

    expect(summary.xp).toBe(55);
    expect(summary.level).toBe(1);
    expect(summary.actionsToday).toBe(2);
    expect(summary.totalCompletions).toBe(3);
  });
});
