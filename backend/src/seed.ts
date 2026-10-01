import { pool } from "./db.js";

interface CategorySeed {
  slug: string;
  name: string;
}

interface ProductSeed {
  slug: string;
  name: string;
  description: string;
  categorySlug: string;
  price: number;
  in_stock: boolean;
}

const categories: CategorySeed[] = [
  { slug: "videocards", name: "Видеокарты" },
  { slug: "processors", name: "Процессоры" },
  { slug: "motherboards", name: "Материнские платы" },
  { slug: "memory", name: "Оперативная память" },
  { slug: "storage", name: "Накопители" },
  { slug: "psu", name: "Блоки питания" },
];

const products: ProductSeed[] = [
  {
    slug: "nvidia-geforce-rtx-4070",
    name: "NVIDIA GeForce RTX 4070",
    description: "Видеокарта 12 ГБ GDDR6X, 5888 CUDA-ядер, разъём PCIe 4.0.",
    categorySlug: "videocards",
    price: 62990,
    in_stock: true,
  },
  {
    slug: "nvidia-geforce-rtx-4060-ti",
    name: "NVIDIA GeForce RTX 4060 Ti",
    description:
      "Видеокарта 8 ГБ GDDR6, компактная, для сборок среднего уровня.",
    categorySlug: "videocards",
    price: 44990,
    in_stock: true,
  },
  {
    slug: "amd-radeon-rx-7800-xt",
    name: "AMD Radeon RX 7800 XT",
    description: "Видеокарта 16 ГБ GDDR6, архитектура RDNA 3.",
    categorySlug: "videocards",
    price: 54990,
    in_stock: true,
  },
  {
    slug: "nvidia-geforce-rtx-4090",
    name: "NVIDIA GeForce RTX 4090",
    description: "Флагманская видеокарта 24 ГБ GDDR6X. Временно нет в наличии.",
    categorySlug: "videocards",
    price: 199990,
    in_stock: false,
  },
  {
    slug: "amd-ryzen-5-7600x",
    name: "AMD Ryzen 5 7600X",
    description: "Процессор 6 ядер, 12 потоков, сокет AM5.",
    categorySlug: "processors",
    price: 21990,
    in_stock: true,
  },
  {
    slug: "amd-ryzen-7-7800x3d",
    name: "AMD Ryzen 7 7800X3D",
    description: "Процессор 8 ядер с 3D V-Cache, выбор для игровых сборок.",
    categorySlug: "processors",
    price: 38990,
    in_stock: true,
  },
  {
    slug: "intel-core-i5-13400f",
    name: "Intel Core i5-13400F",
    description: "Процессор 10 ядер, 16 потоков, без встроенной графики.",
    categorySlug: "processors",
    price: 17990,
    in_stock: true,
  },
  {
    slug: "intel-core-i7-14700k",
    name: "Intel Core i7-14700K",
    description: "Процессор 20 ядер, 28 потоков, разблокированный множитель.",
    categorySlug: "processors",
    price: 42990,
    in_stock: true,
  },
  {
    slug: "amd-ryzen-9-7950x",
    name: "AMD Ryzen 9 7950X",
    description: "Процессор 16 ядер, 32 потока, для рабочих станций.",
    categorySlug: "processors",
    price: 59990,
    in_stock: true,
  },
  {
    slug: "asus-prime-b650m-a",
    name: "ASUS PRIME B650M-A",
    description: "Материнская плата mATX, сокет AM5, два слота M.2.",
    categorySlug: "motherboards",
    price: 12990,
    in_stock: true,
  },
  {
    slug: "msi-mag-b760-tomahawk",
    name: "MSI MAG B760 TOMAHAWK",
    description: "Материнская плата ATX, сокет LGA1700, поддержка DDR5.",
    categorySlug: "motherboards",
    price: 18990,
    in_stock: true,
  },
];

export async function seedCatalog(): Promise<void> {
  //Категории
  for (const c of categories) {
    await pool.query(
      `INSERT INTO categories (slug, name) VALUES ($1, $2)
       ON CONFLICT (slug) DO NOTHING`,
      [c.slug, c.name],
    );
  }

  const catResult = await pool.query<{ id: number; slug: string }>(
    "SELECT id, slug FROM categories",
  );
  const categoryIdBySlug = new Map(catResult.rows.map((r) => [r.slug, r.id]));

  // Товары
  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.categorySlug);
    if (!categoryId) {
      throw new Error(`Category not found for slug: ${p.categorySlug}`);
    }
    await pool.query(
      `INSERT INTO products (slug, name, description, category_id, price, in_stock, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, NULL)
       ON CONFLICT (slug) DO NOTHING`,
      [p.slug, p.name, p.description, categoryId, p.price, p.in_stock],
    );
  }

  console.log(
    `Seed: ensured ${categories.length} categories and ${products.length} products`,
  );
}
