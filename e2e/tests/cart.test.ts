import { test, expect } from "@playwright/test";

test("карточка товара открывается и показывает название, цену и описание", async ({
  page,
}) => {
  await page.goto("/product/nvidia-geforce-rtx-4070");
  await expect(page.getByTestId("product-name")).toContainText("RTX 4070");
  await expect(page.getByTestId("product-price")).toContainText("62 990");
  await expect(page.getByTestId("product-description")).not.toBeEmpty();
});

test("товар добавляется в корзину и появляется в ней", async ({ page }) => {
  await page.goto("/product/nvidia-geforce-rtx-4070");
  await page.getByTestId("product-add-to-cart").click();

  await page.goto("/cart");
  await expect(page.getByTestId("cart-item")).toHaveCount(1);
  await expect(page.getByTestId("cart-item")).toContainText("RTX 4070");
});

test("количество позиции меняется, итоговая сумма пересчитывается", async ({
  page,
}) => {
  await page.goto("/product/nvidia-geforce-rtx-4070");
  await page.getByTestId("product-add-to-cart").click();
  await page.goto("/cart");

  const totalBefore = await page.getByTestId("cart-total").textContent();

  await page.getByTestId("cart-item-qty").fill("3");

  await expect(page.getByTestId("cart-total")).not.toHaveText(
    totalBefore ?? "",
  );
  await expect(page.getByTestId("cart-total")).toContainText("188 970");
});

test("позиция удаляется из корзины", async ({ page }) => {
  await page.goto("/product/nvidia-geforce-rtx-4070");
  await page.getByTestId("product-add-to-cart").click();
  await page.goto("/cart");
  await expect(page.getByTestId("cart-item")).toHaveCount(1);

  await page.getByTestId("cart-item-remove").click();
  await expect(page.getByTestId("cart-empty")).toBeVisible();
});

test("состав корзины сохраняется после перезагрузки страницы", async ({
  page,
}) => {
  await page.goto("/product/nvidia-geforce-rtx-4070");
  await page.getByTestId("product-add-to-cart").click();
  await page.goto("/cart");

  await page.reload();

  await expect(page.getByTestId("cart-item")).toHaveCount(1);
});

test("недоступный товар в корзину не добавляется", async ({ page }) => {
  await page.goto("/product/nvidia-geforce-rtx-4090");
  await expect(page.getByTestId("product-add-to-cart")).toBeDisabled();
});

test("пустая корзина показывает своё состояние и не пускает к оформлению", async ({
  page,
}) => {
  await page.goto("/cart");
  await expect(page.getByTestId("cart-empty")).toBeVisible();
  await expect(page.getByTestId("cart-checkout")).toHaveCount(0);
});
