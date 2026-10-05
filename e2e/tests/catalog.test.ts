import { test, expect } from "@playwright/test";

test("каталог загружается, карточки товаров видны", async ({ page }) => {
  await page.goto("/catalog");
  await expect(page.getByTestId("catalog-list")).toBeVisible();
  await expect(page.getByTestId("catalog-item")).toHaveCount(12);
});

test("в карточке есть название, цена и наличие", async ({ page }) => {
  await page.goto("/catalog");
  const card = page.getByTestId("catalog-item").first();

  await expect(card.getByTestId("catalog-item-name")).toBeVisible();
  await expect(card.getByTestId("catalog-item-name")).not.toBeEmpty();

  await expect(card.getByTestId("catalog-item-price")).toBeVisible();
  await expect(card.getByTestId("catalog-item-price")).not.toBeEmpty();

  const availability = card.getByTestId("catalog-item-availability");
  await expect(availability).toBeVisible();
  await expect(availability).toHaveAttribute("data-available", /true|false/);
});

test("фильтр по категории сужает список", async ({ page }) => {
  await page.goto("/catalog");
  await page.getByTestId("filter-category").selectOption("videocards");
  await expect(page).toHaveURL(/category=videocards/);
  await expect(page.getByTestId("catalog-item")).toHaveCount(10);
});

test("поиск по части названия оставляет в выдаче подходящий товар", async ({
  page,
}) => {
  await page.goto("/catalog");
  await page.getByTestId("filter-search").fill("rtx");

  await expect(page).toHaveURL(/search=rtx/);
  await expect(page.getByTestId("catalog-item")).toHaveCount(6);

  const names = await page.getByTestId("catalog-item-name").allTextContents();
  for (const name of names) {
    expect(name.toLowerCase()).toContain("rtx");
  }
});

test("фильтр по цене меняет состав выдачи", async ({ page }) => {
  await page.goto("/catalog");
  const before = await page.getByTestId("catalog-item-name").allTextContents();

  await page.getByTestId("filter-price-min").fill("100000");
  await expect(page).toHaveURL(/priceMin=100000/);

  await expect
    .poll(async () => page.getByTestId("catalog-item").count())
    .toBeLessThan(12);

  const after = await page.getByTestId("catalog-item-name").allTextContents();
  expect(after).not.toEqual(before);
});

test("сброс фильтров возвращает полный список", async ({ page }) => {
  await page.goto("/catalog?category=videocards");
  await expect(page.getByTestId("catalog-item")).toHaveCount(10);

  await page.getByTestId("filter-reset").click();
  await expect(page).toHaveURL("/catalog");
  await expect(page.getByTestId("catalog-item")).toHaveCount(12);
});

test("фильтры, под которые ничего не подходит, показывает пустое состояние", async ({
  page,
}) => {
  await page.goto("/catalog?category=videocards&priceMax=1000");
  await expect(page.getByTestId("catalog-empty")).toBeVisible();
  await expect(page.getByTestId("catalog-item")).toHaveCount(0);
});

test("переход на следующую страницу меняет набор карточек", async ({
  page,
}) => {
  await page.goto("/catalog");
  const firstPageNames = await page
    .getByTestId("catalog-item-name")
    .allTextContents();

  await page.getByTestId("catalog-page-next").click();
  await expect(page).toHaveURL(/page=2/);

  const secondPageNames = await page
    .getByTestId("catalog-item-name")
    .allTextContents();
  expect(secondPageNames).not.toEqual(firstPageNames);
});

test("смена фильтра возвращает на первую страницу выдачи", async ({ page }) => {
  await page.goto("/catalog?page=2");
  await expect(page).toHaveURL(/page=2/);

  await page.getByTestId("filter-category").selectOption("videocards");
  await expect(page).toHaveURL(/category=videocards/);
  await expect(page).not.toHaveURL(/page=/);
});

test("на первой странице «назад» не уводит в несуществующую страницу", async ({
  page,
}) => {
  await page.goto("/catalog");
  await expect(page.getByTestId("catalog-page-prev")).toBeDisabled();
});

test("перезагрузка страницы с выбранным фильтром сохраняет выдачу", async ({
  page,
}) => {
  await page.goto("/catalog?category=videocards");
  await expect(page.getByTestId("catalog-item")).toHaveCount(10);
  await expect(page.getByTestId("filter-category")).toHaveValue("videocards");

  await page.reload();

  await expect(page.getByTestId("catalog-item")).toHaveCount(10);
  await expect(page.getByTestId("filter-category")).toHaveValue("videocards");
});

test("Кнопка 'назад' после смены фильтра возвращает предыдущую выдачу", async ({
  page,
}) => {
  await page.goto("/catalog");
  await page.getByTestId("filter-category").selectOption("videocards");
  await expect(page.getByTestId("filter-category")).toHaveValue("videocards");

  await page.getByTestId("filter-category").selectOption("processors");
  await expect(page.getByTestId("filter-category")).toHaveValue("processors");

  await page.goBack();

  await expect(page.getByTestId("filter-category")).toHaveValue("videocards");
  await expect(page.getByTestId("catalog-item")).toHaveCount(10);
});
