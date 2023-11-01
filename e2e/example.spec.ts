import { test, expect } from "@playwright/test";
import { getDate } from "./helpers/date";

test("has title", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}`);

  await page.screenshot({ path: `test-results/${getDate()}.png` });
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Budget/);
});
