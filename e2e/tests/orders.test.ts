import { test, expect, type Page } from "@playwright/test";

function uniqueEmail(prefix = "orders"): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${rand}@example.com`;
}

async function registerViaUI(page: Page, email: string) {
  await page.goto("/register");
  await page.getByTestId("auth-email").fill(email);
  await page.getByTestId("auth-password").fill("secret123");
  await page.getByTestId("auth-submit").click();
  await expect(page.getByTestId("nav-account")).toBeVisible();
}

test("неавторизованный пользователь не может оформить заказ", async ({
  page,
  request,
}) => {
  const res = await request.post("/api/orders", {
    data: {
      method: "pickup",
      name: "Иван",
      phone: "1",
      items: [{ slug: "nvidia-geforce-rtx-4070", quantity: 1 }],
    },
  });
  expect(res.status()).toBe(401);

  await page.goto("/checkout");
  await expect(page).toHaveURL(/\/login/);
});

test("авторизованный пользователь оформляет заказ и видит страницу успеха", async ({
  page,
}) => {
  const email = uniqueEmail("checkout");
  await registerViaUI(page, email);

  await page.goto("/product/nvidia-geforce-rtx-4070");
  await page.getByTestId("product-add-to-cart").click();

  await page.goto("/checkout");
  await page.getByTestId("checkout-method").selectOption("pickup");
  await page.getByTestId("checkout-name").fill("Иван Петров");
  await page.getByTestId("checkout-phone").fill("+79990001122");
  await page.getByTestId("checkout-submit").click();

  await expect(page).toHaveURL(/\/order-success\/\d+/);
  await expect(page.getByTestId("order-success")).toBeVisible();
  await expect(page.getByTestId("order-total")).toContainText("62 990");
});

test("пустую корзину оформить нельзя", async ({ page }) => {
  const email = uniqueEmail("empty");
  await registerViaUI(page, email);

  await page.goto("/checkout");
  await expect(page.getByTestId("cart-empty")).toBeVisible();
  await expect(page.getByTestId("checkout-form")).toHaveCount(0);
});

test("итоговая сумма заказа совпадает с суммой позиций и не зависит от клиента", async ({
  request,
}) => {
  const email = uniqueEmail("total");
  await request.post("/api/auth/register", {
    data: { email, password: "secret123" },
  });

  const res = await request.post("/api/orders", {
    data: {
      method: "pickup",
      name: "Иван",
      phone: "1",
      total: 1,
      items: [
        { slug: "nvidia-geforce-rtx-4070", quantity: 2 },
        { slug: "amd-ryzen-5-7600x", quantity: 1 },
      ],
    },
  });
  expect(res.status()).toBe(201);
  const order = await res.json();

  expect(order.total.amount).toBe(147970);
  expect(order.items).toHaveLength(2);
  const itemsSum = order.items.reduce(
    (sum: number, item: { price: { amount: number }; quantity: number }) =>
      sum + item.price.amount * item.quantity,
    0,
  );
  expect(order.total.amount).toBe(itemsSum);
});

test("при доставке адрес обязателен, при самовывозе — не запрашивается", async ({
  page,
}) => {
  const email = uniqueEmail("method");
  await registerViaUI(page, email);

  await page.goto("/product/nvidia-geforce-rtx-4070");
  await page.getByTestId("product-add-to-cart").click();
  await page.goto("/checkout");

  await expect(page.getByTestId("checkout-address")).toBeVisible();

  await page.getByTestId("checkout-method").selectOption("pickup");
  await expect(page.getByTestId("checkout-address")).toHaveCount(0);

  await page.getByTestId("checkout-name").fill("Иван");
  await page.getByTestId("checkout-phone").fill("1");
  await page.getByTestId("checkout-submit").click();
  await expect(page).toHaveURL(/\/order-success\/\d+/);
});

test("заказ с недоступным товаром отклоняется целиком", async ({ request }) => {
  const email = uniqueEmail("unavailable");
  await request.post("/api/auth/register", {
    data: { email, password: "secret123" },
  });

  const res = await request.post("/api/orders", {
    data: {
      method: "pickup",
      name: "Иван",
      phone: "1",
      items: [
        { slug: "nvidia-geforce-rtx-4070", quantity: 1 },
        { slug: "nvidia-geforce-rtx-4090", quantity: 1 },
      ],
    },
  });

  expect(res.status()).toBe(409);
  const body = await res.json();
  expect(body.code).toBe("unavailable_products");
  expect(body.unavailable).toHaveLength(1);
  expect(body.unavailable[0].slug).toBe("nvidia-geforce-rtx-4090");

  const ordersRes = await request.get("/api/orders");
  const orders = await ordersRes.json();
  expect(orders).toHaveLength(0);
});

test("в личном кабинете видны заказы этого пользователя и не видны чужие", async ({
  page,
  request,
}) => {
  const emailA = uniqueEmail("user-a");
  await request.post("/api/auth/register", {
    data: { email: emailA, password: "secret123" },
  });
  await request.post("/api/orders", {
    data: {
      method: "pickup",
      name: "А",
      phone: "1",
      items: [{ slug: "nvidia-geforce-rtx-4070", quantity: 1 }],
    },
  });

  const emailB = uniqueEmail("user-b");
  await registerViaUI(page, emailB);

  await page.goto("/account");
  await expect(page.getByTestId("account-orders-empty")).toBeVisible();
});

test("открытый заказ показывает состав, количество, цены покупки и итог", async ({
  page,
}) => {
  const email = uniqueEmail("account-view");
  await registerViaUI(page, email);

  await page.goto("/product/nvidia-geforce-rtx-4070");
  await page.getByTestId("product-add-to-cart").click();

  await page.goto("/checkout");
  await page.getByTestId("checkout-method").selectOption("pickup");
  await page.getByTestId("checkout-name").fill("Иван");
  await page.getByTestId("checkout-phone").fill("1");
  await page.getByTestId("checkout-submit").click();
  await expect(page).toHaveURL(/\/order-success\/\d+/);

  await page.goto("/account");
  await expect(page.getByTestId("account-orders")).toBeVisible();
  await expect(page.getByTestId("account-order-item")).toHaveCount(1);
  await expect(page.getByTestId("account-order-line")).toHaveCount(1);

  const qty = page.getByTestId("account-order-line-qty").first();
  await expect(qty).toHaveText("1");

  const price = page.getByTestId("account-order-line-price").first();
  await expect(price).toContainText("62 990");

  const status = page.getByTestId("order-status").first();
  await expect(status).toHaveAttribute("data-status", "paid");

  await expect(page.getByTestId("order-total").first()).toContainText("62 990");
});
