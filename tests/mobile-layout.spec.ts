import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/login",
  "/signup",
  "/pricing",
  "/privacy",
  "/terms",
  "/forgot-password",
  "/reset-password",
];

for (const route of routes) {
  test(`mobile layout smoke: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });

    const hasHorizontalOverflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth + 1;
    });

    expect(hasHorizontalOverflow).toBeFalsy();

    await page.screenshot({
      path: `test-results/mobile-${route.replace(/\//g, "_") || "home"}.png`,
      fullPage: true,
    });
  });
}
