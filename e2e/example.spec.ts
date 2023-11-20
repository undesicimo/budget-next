import { test, expect } from "@playwright/test";
import { SCREENSHOT_PATH } from "./common/constants";

test("has title", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}`);

  await page.screenshot({ path: SCREENSHOT_PATH });
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Budget/);
});
