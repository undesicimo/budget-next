import { test, expect } from "@playwright/test";

test.describe("/{budgetID}", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}`);
    await page.click("text=Let's save money!");
    await page.waitForSelector("h1");
  });

  test.describe("Elements", () => {
    test("should have heading ", async ({ page }) => {
      // Arrange
      await page.waitForSelector("h1");

      const header = page.getByRole("heading", { name: "予算設定してね" });
      // Assert
      await expect(header).toBeVisible();
    });
    test("should have form", async ({ page }) => {
      // Arrange
      const submitButton = page.getByRole("button", { name: "決定" });
      const resetSessionButton = page.locator("#reset-session");
      const input = page.locator("//input[@name='amount']");
      // Assert
      await expect(submitButton).toBeVisible();
      await expect(resetSessionButton).toBeVisible();
      await expect(input).toBeVisible();
    });
  });
  test.describe("Interactivity", () => {
    test("should be able to set budget", async ({ page }) => {
      // Arrange
      const inputAmount = "1000";
      const submitButton = page.getByRole("button", { name: "決定" });
      const input = page.locator("//input[@name='amount']");
      // Act
      await input.fill(inputAmount);
      await submitButton.click();
      // Assert
      await page.waitForSelector("h1");
      const header = page.locator("h1");
      const amount = page.locator("h2");

      await expect.soft(header).toHaveText("💰残高");
      await expect.soft(amount).toHaveText("¥" + inputAmount);
    });
    test("should be able to reset session", async ({ page }) => {
      // Arrange
      const resetSessionButton = page.locator("//button[@id='reset-session']");
      // Act
      page.on("dialog", async (dialog) => {
        await dialog.accept();
      });
      await resetSessionButton.click();

      // Assert
      await page.waitForLoadState("load");
      const landingPageImage = page.getByRole("img", { name: "lpman" });
      const StarterButton = page.getByText("Let's save money!");

      await expect.soft(landingPageImage).toBeAttached();
      await expect.soft(StarterButton).toBeVisible();
    });
  });
});
