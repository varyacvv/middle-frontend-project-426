import { test, expect } from "@playwright/test";

test("главная открывается на / и показывает промо-блоки", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId("home-promo")).toBeVisible();
  await expect(page.getByTestId("home-promo-item")).toHaveCount(3);
});

test("клик по промо-блоку открывает страницу его товара", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("home-promo-item").first().click();
  await expect(page).toHaveURL(/\/product\//);
});

test("из главной открывается каталог по ссылке в шапке", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("nav-catalog").click();
  await expect(page).toHaveURL(/\/catalog/);
  await expect(page.getByTestId("catalog-list")).toBeVisible();
});
