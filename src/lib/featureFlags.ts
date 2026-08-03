/**
 * FREE_GROWTH_MODE - Temporary Strategy for User Acquisition
 * 
 * STATUS: ENABLED (true)
 * DURATION: Until 10k+ DAU or clear PMF achieved
 * 
 * PURPOSE:
 * - Maximize user adoption during growth phase
 * - Gather meaningful user feedback and engagement data
 * - Build product-market fit before monetization
 * - Reduce friction for new users to experience full value
 * 
 * MONETIZATION STRATEGY:
 * When re-enabling Premium, change to false and:
 * - Pricing page will show actual tiers
 * - Stripe checkout will be accessible
 * - Premium database flags will gate features
 * 
 * INFRASTRUCTURE STATUS (ALWAYS OPERATIONAL):
 * ✓ /api/stripe/checkout endpoint (ready)
 * ✓ /api/stripe/webhook handler (ready)
 * ✓ is_premium database flag (tracked)
 * ✓ Premium database schema (intact)
 * → Can re-enable Premium instantly by setting to false
 */

export const FREE_GROWTH_MODE = false;

export function isFreeGrowthModeEnabled(): boolean {
  return FREE_GROWTH_MODE;
}

export function getFeatureFlags() {
  return {
    freeGrowthMode: FREE_GROWTH_MODE,
    allFeaturesUnlocked: FREE_GROWTH_MODE,
    coachingAvailable: true,
    memoriesAvailable: true,
    gamificationAvailable: true,
    analyticsAvailable: true,
    premiumThemesAvailable: !FREE_GROWTH_MODE,
    premiumCoachesAvailable: !FREE_GROWTH_MODE,
  };
}