import { describe, expect, it } from "vitest";
import { getPremiumStatus, getPremiumLimits, getUsageState } from "./premiumAccess";

describe("premium access", () => {
  it("returns premium for subscribed users and admins", () => {
    expect(getPremiumStatus({ profilePremium: true })).toBe(true);
    expect(getPremiumStatus({ isAdmin: true })).toBe(true);
    expect(getPremiumStatus({ email: "free@example.com" })).toBe(false);
  });

  it("applies free-plan message and memory limits", () => {
    const limits = getPremiumLimits({ isPremium: false });
    expect(limits.dailyMessages).toBe(8);
    expect(limits.monthlyMessages).toBe(80);
    expect(limits.advancedCoachingSessions).toBe(3);
    expect(limits.memoryCapacity).toBe(8);

    const state = getUsageState({
      isPremium: false,
      dailyCount: 8,
      monthlyCount: 80,
      advancedSessionCount: 3,
    });

    expect(state.canSendMessage).toBe(false);
    expect(state.canStartAdvancedCoaching).toBe(false);
    expect(state.limitMessage).toContain("Premium");
  });
});
