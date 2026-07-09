import { expect, test } from "@playwright/test";

const E2E_EMAIL = process.env.E2E_TEST_EMAIL;
const E2E_PASSWORD = process.env.E2E_TEST_PASSWORD;
const E2E_PREMIUM_EMAIL = process.env.E2E_PREMIUM_TEST_EMAIL;
const E2E_PREMIUM_PASSWORD = process.env.E2E_PREMIUM_TEST_PASSWORD;

async function login(page: import("@playwright/test").Page, email: string, password: string) {
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForLoadState("networkidle");
}

function assertNoHorizontalOverflow(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth <= doc.clientWidth + 1;
  });
}

test.describe("mobile authenticated layouts", () => {
  test.beforeEach(({ }, testInfo) => {
    if (!E2E_EMAIL || !E2E_PASSWORD) {
      testInfo.skip(true, "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run authenticated mobile tests.");
    }
  });

  test("dashboard mobile smoke after login", async ({ page }) => {
    await login(page, E2E_EMAIL!, E2E_PASSWORD!);
    await page.goto("/dashboard", { waitUntil: "networkidle" });

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(await assertNoHorizontalOverflow(page)).toBeTruthy();

    await page.screenshot({
      path: "test-results/mobile-auth-dashboard.png",
      fullPage: true,
    });
  });

  test("settings mobile smoke after login", async ({ page }) => {
    await login(page, E2E_EMAIL!, E2E_PASSWORD!);
    await page.goto("/settings", { waitUntil: "networkidle" });

    await expect(page).toHaveURL(/\/settings/);
    await expect(await assertNoHorizontalOverflow(page)).toBeTruthy();

    await page.screenshot({
      path: "test-results/mobile-auth-settings.png",
      fullPage: true,
    });
  });

  test("premium mobile smoke after login", async ({ page }, testInfo) => {
    if (!E2E_PREMIUM_EMAIL || !E2E_PREMIUM_PASSWORD) {
      testInfo.skip(true, "Set E2E_PREMIUM_TEST_EMAIL and E2E_PREMIUM_TEST_PASSWORD to run premium mobile test.");
    }

    await login(page, E2E_PREMIUM_EMAIL!, E2E_PREMIUM_PASSWORD!);
    await page.goto("/premium", { waitUntil: "networkidle" });

    await expect(page).toHaveURL(/\/premium/);
    await expect(await assertNoHorizontalOverflow(page)).toBeTruthy();

    await page.screenshot({
      path: "test-results/mobile-auth-premium.png",
      fullPage: true,
    });
  });
});
