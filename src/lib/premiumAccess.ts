export const PREMIUM_EMAILS = ["shikiouchiha@gmail.com"];

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
  return Boolean(
    options?.isAdmin ||
    options?.profilePremium ||
    options?.cookiePremium ||
    isPremiumEmail(options?.email)
  );
}