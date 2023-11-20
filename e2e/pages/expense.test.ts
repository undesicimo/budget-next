import test, { Locator, Page, expect } from "@playwright/test";

const BUDGET_AMOUNT = "1000";
const INPUT_EXPENSE_NAME = "おにぎり";
const INPUT_EXPENSE_AMOUNT = "500";
const CURRENT_DATE = (function getFormatedDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
})();

test.describe("/expense", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}`);
  });

  test("should be able to set expense", async ({ page }) => {
    // Arrange
    const expensePage = new ExpensePage(page);
    await page
      .getByRole("button", {
        name: "Let's save money!",
      })
      .click();

    await page.waitForSelector("h1");

    await page.locator("//input[@name='amount']").fill(BUDGET_AMOUNT);
    await page.getByRole("button", { name: "決定" }).click();

    await page.waitForSelector("//input[@name='name']");

    // Assert
    // Should able to set expenses
    await expensePage.setNewExpense(INPUT_EXPENSE_NAME, INPUT_EXPENSE_AMOUNT);

    await expect(page.getByText(INPUT_EXPENSE_NAME)).toBeVisible();
    await expect(page.getByText(`${INPUT_EXPENSE_AMOUNT}円`)).toBeVisible();
    await expect(page.getByText(CURRENT_DATE)).toBeVisible();

    // Able to set ¥0
    await page.getByPlaceholder("どういうの").waitFor({ state: "visible" });
    await expensePage.setNewExpense(
      INPUT_EXPENSE_NAME + "2",
      INPUT_EXPENSE_AMOUNT,
    );
    await expect(page.getByRole("heading", { name: "0円" })).toBeVisible();

    // Able to go over budget
    await expensePage.setNewExpense(
      INPUT_EXPENSE_NAME + "3",
      INPUT_EXPENSE_AMOUNT,
    );
    await expect(page.getByText("予算オーバー")).toBeVisible();

    const expenseAmountHeading = page.getByRole("heading", {
      name: `${INPUT_EXPENSE_AMOUNT}円`,
    });
    await expect(expenseAmountHeading).toBeVisible();
    await expect(expenseAmountHeading).toHaveCSS("color", "rgb(185, 28, 28)");

    // Able to remove an expense
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    await page
      .getByTestId("expense-item")
      .filter({
        has: page.getByText(INPUT_EXPENSE_NAME, { exact: true }),
      })
      .getByTestId("delete-expense")
      .click();

    await expect(
      page.getByText(INPUT_EXPENSE_NAME, { exact: true }),
    ).not.toBeVisible();
    //TODO 0円で予算オーバー表示しない
    // await expect(page.getByText("予算オーバー")).not.toBeVisible();
    await Promise.all([
      expect(page.getByRole("heading", { name: "0円" })).toBeVisible(),
      expect(page.getByText(INPUT_EXPENSE_NAME + "2")).toBeVisible(),
      expect(page.getByText(INPUT_EXPENSE_NAME + "3")).toBeVisible(),
    ]);
  });
});

class ExpensePage {
  private page: Page;
  private nameExpenseInput: Locator;
  private amountExpenseInput: Locator;
  private addExpenseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameExpenseInput = page.getByPlaceholder("どういうの");
    this.amountExpenseInput = page.getByPlaceholder("金額");
    this.addExpenseButton = page.getByRole("button", { name: "追加" });
  }

  public async fillExpenseName(name: string) {
    await this.nameExpenseInput.fill(name);
  }

  public async fillExpenseAmount(amount: string) {
    await this.amountExpenseInput.fill(amount);
  }
  public async clickAddExpenseButton() {
    await this.addExpenseButton.click();
  }

  public async setNewExpense(name: string, amount: string) {
    await this.fillExpenseName(name);
    await this.fillExpenseAmount(amount);
    await this.clickAddExpenseButton();
  }
}
