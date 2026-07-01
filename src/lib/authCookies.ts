export function setAppCookie(name: string, value: string, maxAge = 60 * 60 * 24 * 7) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAppCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function setAuthCookies(options?: { premium?: boolean; admin?: boolean }) {
  setAppCookie("myfuture_session", "1");
  setAppCookie("myfuture_premium", options?.premium ? "1" : "0");
  setAppCookie("myfuture_admin", options?.admin ? "1" : "0");
}

export function clearAuthCookies() {
  clearAppCookie("myfuture_session");
  clearAppCookie("myfuture_premium");
  clearAppCookie("myfuture_admin");
}
