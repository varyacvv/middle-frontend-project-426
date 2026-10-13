import { test, expect, type Page } from "@playwright/test";

async function expectNoHorizontalScroll(page: Page) {
  const hasHorizontalScroll = await page.evaluate(() => {
    return (
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth
    );
  });
  expect(hasHorizontalScroll).toBe(false);
}

test.use({ viewport: { width: 390, height: 844 } });

test("главная не имеет горизонтальной прокрутки на 390px", async ({ page }) => {
  await page.goto("/");
  await expectNoHorizontalScroll(page);
});

test("каталог не имеет горизонтальной прокрутки на 390px", async ({ page }) => {
  await page.goto("/catalog");
  await expectNoHorizontalScroll(page);
});

test("корзина не имеет горизонтальной прокрутки на 390px", async ({ page }) => {
  await page.goto("/product/nvidia-geforce-rtx-4070");
  await page.getByTestId("product-add-to-cart").click();
  await page.goto("/cart");
  await expectNoHorizontalScroll(page);
});
