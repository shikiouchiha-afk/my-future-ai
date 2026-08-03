import { isFreeGrowthModeEnabled } from "@/lib/featureFlags";

export const PREMIUM_EMAILS = ["shikiouchiha@gmail.com"];
export const PREMIUM_MONTHLY_PRICE_USD = 1199;
export const PREMIUM_MONTHLY_PRICE_LABEL = "$11.99/month";

export interface PremiumLimits {
  dailyMessages: number;
  monthlyMessages: number;
  advancedCoachingSessions: number;
  memoryCapacity: number;
  analyticsAccess: boolean;
  premiumThemes: boolean;
  prioritySpeed: boolean;
}

export interface PremiumUsageState {
  canSendMessage: boolean;
  canStartAdvancedCoaching: boolean;
  limitMessage: string;
  isPremium: boolean;
}

export function isPremiumEmail(email?: string | null) {
  if (!email) return false;
  return PREMIUM_EMAILS.includes(email.trim().toLowerCase());
}

export function getPremiumStatus(options?: {
  email?: string | null;
  profilePremium?: boolean | null;
  isAdmin?: boolean | null;
  cookiePremium?: boolean;
}) {
  if (isFreeGrowthModeEnabled()) {
    return true;
  }

  return Boolean(
    options?.isAdmin ||
    options?.profilePremium ||
    options?.cookiePremium ||
    isPremiumEmail(options?.email)
  );
}

export function getPremiumLimits(options?: { isPremium?: boolean }) {
  const premium = Boolean(options?.isPremium);

  if (premium) {
    return {
      dailyMessages: Number.POSITIVE_INFINITY,
      monthlyMessages: Number.POSITIVE_INFINITY,
      advancedCoachingSessions: Number.POSITIVE_INFINITY,
      memoryCapacity: Number.POSITIVE_INFINITY,
      analyticsAccess: true,
      premiumThemes: true,
      prioritySpeed: true,
    } satisfies PremiumLimits;
  }

  return {
    dailyMessages: 8,
    monthlyMessages: 80,
    advancedCoachingSessions: 3,
    memoryCapacity: 8,
    analyticsAccess: false,
    premiumThemes: false,
    prioritySpeed: false,
  } satisfies PremiumLimits;
}

export function getUsageState(options: {
  isPremium?: boolean;
  dailyCount?: number;
  monthlyCount?: number;
  advancedSessionCount?: number;
}) {
  const isPremium = Boolean(options?.isPremium);
  const limits = getPremiumLimits({ isPremium });
  const dailyCount = options?.dailyCount ?? 0;
  const monthlyCount = options?.monthlyCount ?? 0;
  const advancedSessionCount = options?.advancedSessionCount ?? 0;

  const canSendMessage = isPremium || dailyCount < limits.dailyMessages && monthlyCount < limits.monthlyMessages;
  const canStartAdvancedCoaching = isPremium || advancedSessionCount < limits.advancedCoachingSessions;

  return {
    canSendMessage,
    canStartAdvancedCoaching,
    limitMessage: isPremium
      ? "Premium access is active."
      : `Free plan limit reached. Upgrade to Premium at ${PREMIUM_MONTHLY_PRICE_LABEL} for unlimited AI conversations, richer memory, and advanced coaching.`,
    isPremium,
  } satisfies PremiumUsageState;
}