import { test, expect } from "@playwright/test";

test.describe("/", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}`);
  });
  test.describe("Meta", () => {
    test("Meta", async ({ page }) => {
      //Meta
      await expect(page).toHaveTitle(/Budget/);
    });
  });
  test.describe("Elements", () => {
    test("Image", ({ page }) => {
      const landingPageImage = page.getByRole("img").getByAltText("lpmanu");
      expect(landingPageImage).toBeDefined();
    });
  });
  test.describe("Interactives", () => {
    test.describe("Let's save money! Button", () => {
      test("Button", ({ page }) => {
        const StarterButton = page.getByText("Let's save money!");
        expect(StarterButton).toBeDefined();
      });
      test("should redirect to set budget screen", async ({ page }) => {
        // Arrange
        const StarterButton = page.getByText("Let's save money!");
        // Act
        await StarterButton.click();
        // Assert
        await page.waitForSelector("h1");
        expect(new URL(page.url()).pathname).toHaveLength(6);

        const Header = page.locator("h1");
        await expect(Header).toHaveText("予算設定してね");
      });
    });
  });
});
