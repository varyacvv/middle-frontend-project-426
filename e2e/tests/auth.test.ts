import { test, expect } from "@playwright/test";

function uniqueEmail(prefix = "user"): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${rand}@example.com`;
}

test("новый пользователь регистрируется и оказывается авторизованным", async ({
  page,
}) => {
  const email = uniqueEmail("register");

  await page.goto("/register");
  await page.getByTestId("auth-email").fill(email);
  await page.getByTestId("auth-password").fill("secret123");
  await page.getByTestId("auth-submit").click();

  await expect(page.getByTestId("nav-account")).toBeVisible();
  await expect(page.getByTestId("nav-signout")).toBeVisible();
});

test("зарегистрированный пользователь входит по своим email и паролю", async ({
  page,
  request,
}) => {
  const email = uniqueEmail("login");
  await request.post("/api/auth/register", {
    data: { email, password: "secret123" },
  });

  await page.goto("/login");
  await page.getByTestId("auth-email").fill(email);
  await page.getByTestId("auth-password").fill("secret123");
  await page.getByTestId("auth-submit").click();

  await expect(page.getByTestId("nav-account")).toBeVisible();
});

test("авторизованный пользователь выходит, и личный раздел перестаёт быть доступен", async ({
  page,
}) => {
  const email = uniqueEmail("logout");

  await page.goto("/register");
  await page.getByTestId("auth-email").fill(email);
  await page.getByTestId("auth-password").fill("secret123");
  await page.getByTestId("auth-submit").click();
  await expect(page.getByTestId("nav-account")).toBeVisible();

  await page.getByTestId("nav-signout").click();
  await expect(page.getByTestId("nav-signin")).toBeVisible();

  await page.goto("/account");
  await expect(page).toHaveURL(/\/login$/);
});

test("регистрация с уже занятым email отклоняется", async ({
  page,
  request,
}) => {
  const email = uniqueEmail("taken");
  await request.post("/api/auth/register", {
    data: { email, password: "secret123" },
  });

  await page.goto("/register");
  await page.getByTestId("auth-email").fill(email);
  await page.getByTestId("auth-password").fill("secret123");
  await page.getByTestId("auth-submit").click();

  await expect(page.getByTestId("auth-error")).toBeVisible();
  await expect(page.getByTestId("auth-error")).toContainText(
    "уже зарегистрирован",
  );
});

test("вход с неверным паролем отклоняется", async ({ page, request }) => {
  const email = uniqueEmail("wrongpass");
  await request.post("/api/auth/register", {
    data: { email, password: "secret123" },
  });

  await page.goto("/login");
  await page.getByTestId("auth-email").fill(email);
  await page.getByTestId("auth-password").fill("wrong-password");
  await page.getByTestId("auth-submit").click();

  await expect(page.getByTestId("auth-error")).toBeVisible();
  await expect(page.getByTestId("auth-error")).toContainText(
    "Неверный email или пароль",
  );
});

test("после перезагрузки страницы пользователь остаётся авторизованным", async ({
  page,
}) => {
  const email = uniqueEmail("reload");

  await page.goto("/register");
  await page.getByTestId("auth-email").fill(email);
  await page.getByTestId("auth-password").fill("secret123");
  await page.getByTestId("auth-submit").click();
  await expect(page.getByTestId("nav-account")).toBeVisible();

  await page.reload();

  await expect(page.getByTestId("nav-account")).toBeVisible();
  await expect(page.getByTestId("nav-signout")).toBeVisible();
});

test("неавторизованный посетитель не попадает на защищённую страницу", async ({
  page,
}) => {
  await page.goto("/account");
  await expect(page).toHaveURL(/\/login$/);
});
