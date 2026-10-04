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
  // Видеокарты 
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
    slug: "nvidia-geforce-rtx-4080-super",
    name: "NVIDIA GeForce RTX 4080 SUPER",
    description: "Видеокарта 16 ГБ GDDR6X для сборок 4K.",
    categorySlug: "videocards",
    price: 119990,
    in_stock: true,
  },
  {
    slug: "nvidia-geforce-rtx-4060",
    name: "NVIDIA GeForce RTX 4060",
    description: "Видеокарта 8 ГБ GDDR6, бюджетная для Full HD.",
    categorySlug: "videocards",
    price: 34990,
    in_stock: true,
  },
  {
    slug: "amd-radeon-rx-7900-xtx",
    name: "AMD Radeon RX 7900 XTX",
    description: "Флагманская видеокарта 24 ГБ GDDR6.",
    categorySlug: "videocards",
    price: 109990,
    in_stock: true,
  },
  {
    slug: "amd-radeon-rx-7600",
    name: "AMD Radeon RX 7600",
    description: "Видеокарта 8 ГБ GDDR6, начальный уровень.",
    categorySlug: "videocards",
    price: 29990,
    in_stock: true,
  },
  {
    slug: "intel-arc-a770",
    name: "Intel Arc A770",
    description: "Видеокарта 16 ГБ GDDR6, альтернатива в среднем сегменте.",
    categorySlug: "videocards",
    price: 37990,
    in_stock: false,
  },
  {
    slug: "nvidia-geforce-rtx-4070-ti-super",
    name: "NVIDIA GeForce RTX 4070 Ti SUPER",
    description: "Видеокарта 16 ГБ GDDR6X, разъём PCIe 4.0.",
    categorySlug: "videocards",
    price: 89990,
    in_stock: true,
  },

  // Процессоры
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
    slug: "amd-ryzen-5-5600",
    name: "AMD Ryzen 5 5600",
    description: "Процессор 6 ядер, 12 потоков, сокет AM4.",
    categorySlug: "processors",
    price: 8990,
    in_stock: true,
  },
  {
    slug: "intel-core-i3-12100f",
    name: "Intel Core i3-12100F",
    description: "Процессор 4 ядра, 8 потоков, для офисных сборок.",
    categorySlug: "processors",
    price: 6990,
    in_stock: true,
  },
  {
    slug: "intel-core-i9-14900k",
    name: "Intel Core i9-14900K",
    description: "Процессор 24 ядра, 32 потока, топовый LGA1700.",
    categorySlug: "processors",
    price: 74990,
    in_stock: true,
  },
  {
    slug: "amd-ryzen-9-7900x",
    name: "AMD Ryzen 9 7900X",
    description: "Процессор 12 ядер, 24 потока, сокет AM5.",
    categorySlug: "processors",
    price: 45990,
    in_stock: false,
  },
  {
    slug: "amd-ryzen-7-5800x3d",
    name: "AMD Ryzen 7 5800X3D",
    description: "Процессор 8 ядер с 3D V-Cache, сокет AM4.",
    categorySlug: "processors",
    price: 28990,
    in_stock: true,
  },

  // Материнские платы
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
  {
    slug: "gigabyte-b650-gaming-x-ax",
    name: "Gigabyte B650 GAMING X AX",
    description: "Материнская плата ATX, сокет AM5, Wi-Fi 6E.",
    categorySlug: "motherboards",
    price: 17990,
    in_stock: true,
  },
  {
    slug: "asus-rog-strix-x670e-e",
    name: "ASUS ROG STRIX X670E-E",
    description: "Материнская плата ATX, сокет AM5, флагманский чипсет.",
    categorySlug: "motherboards",
    price: 42990,
    in_stock: true,
  },
  {
    slug: "msi-pro-b760m-a",
    name: "MSI PRO B760M-A",
    description: "Материнская плата mATX, сокет LGA1700, DDR4.",
    categorySlug: "motherboards",
    price: 11990,
    in_stock: true,
  },
  {
    slug: "asrock-b550m-pro4",
    name: "ASRock B550M Pro4",
    description: "Материнская плата mATX, сокет AM4.",
    categorySlug: "motherboards",
    price: 8990,
    in_stock: true,
  },
  {
    slug: "gigabyte-z790-aorus-elite",
    name: "Gigabyte Z790 AORUS ELITE",
    description: "Материнская плата ATX, сокет LGA1700, DDR5.",
    categorySlug: "motherboards",
    price: 27990,
    in_stock: true,
  },
  {
    slug: "asus-tuf-gaming-b650-plus",
    name: "ASUS TUF GAMING B650-PLUS",
    description: "Материнская плата ATX, сокет AM5, усиленное питание.",
    categorySlug: "motherboards",
    price: 19990,
    in_stock: true,
  },
  {
    slug: "msi-mpg-x670e-carbon",
    name: "MSI MPG X670E CARBON",
    description: "Материнская плата ATX, сокет AM5, премиум-сегмент.",
    categorySlug: "motherboards",
    price: 54990,
    in_stock: false,
  },
  {
    slug: "asrock-b760m-itx",
    name: "ASRock B760M-ITX",
    description:
      "Материнская плата Mini-ITX, сокет LGA1700, для компактных сборок.",
    categorySlug: "motherboards",
    price: 14990,
    in_stock: true,
  },

  // Оперативная память
  {
    slug: "kingston-fury-beast-16gb-ddr5",
    name: "Kingston Fury Beast 16 ГБ DDR5",
    description: "Модуль памяти DDR5, 5600 МГц, CL36.",
    categorySlug: "memory",
    price: 5990,
    in_stock: true,
  },
  {
    slug: "corsair-vengeance-32gb-ddr5",
    name: "Corsair Vengeance 32 ГБ DDR5",
    description: "Комплект 2×16 ГБ DDR5, 6000 МГц, CL30.",
    categorySlug: "memory",
    price: 12990,
    in_stock: true,
  },
  {
    slug: "gskill-trident-z5-32gb",
    name: "G.Skill Trident Z5 32 ГБ",
    description: "Комплект 2×16 ГБ DDR5, 6400 МГц, CL32.",
    categorySlug: "memory",
    price: 15990,
    in_stock: true,
  },
  {
    slug: "kingston-fury-beast-16gb-ddr4",
    name: "Kingston Fury Beast 16 ГБ DDR4",
    description: "Модуль памяти DDR4, 3200 МГц, CL16.",
    categorySlug: "memory",
    price: 3990,
    in_stock: true,
  },
  {
    slug: "corsair-vengeance-16gb-ddr4",
    name: "Corsair Vengeance 16 ГБ DDR4",
    description: "Комплект 2×8 ГБ DDR4, 3200 МГц, CL16.",
    categorySlug: "memory",
    price: 5490,
    in_stock: true,
  },
  {
    slug: "gskill-ripjaws-v-32gb-ddr4",
    name: "G.Skill Ripjaws V 32 ГБ DDR4",
    description: "Комплект 2×16 ГБ DDR4, 3600 МГц, CL18.",
    categorySlug: "memory",
    price: 8990,
    in_stock: true,
  },
  {
    slug: "crucial-pro-64gb-ddr5",
    name: "Crucial Pro 64 ГБ DDR5",
    description: "Комплект 2×32 ГБ DDR5, 5600 МГц, для рабочих станций.",
    categorySlug: "memory",
    price: 24990,
    in_stock: true,
  },
  {
    slug: "teamgroup-t-force-32gb-ddr5",
    name: "TeamGroup T-Force 32 ГБ DDR5",
    description: "Комплект 2×16 ГБ DDR5, 6000 МГц, RGB.",
    categorySlug: "memory",
    price: 13990,
    in_stock: true,
  },
  {
    slug: "adata-xpg-lancer-16gb-ddr5",
    name: "ADATA XPG Lancer 16 ГБ DDR5",
    description: "Модуль памяти DDR5, 5200 МГц, CL38.",
    categorySlug: "memory",
    price: 6490,
    in_stock: true,
  },
  {
    slug: "patriot-viper-32gb-ddr5",
    name: "Patriot Viper 32 ГБ DDR5",
    description: "Комплект 2×16 ГБ DDR5, 6200 МГц, CL36.",
    categorySlug: "memory",
    price: 14990,
    in_stock: false,
  },

  // Накопители
  {
    slug: "samsung-980-pro-1tb",
    name: "Samsung 980 PRO 1 ТБ",
    description: "NVMe SSD M.2, PCIe 4.0, до 7000 МБ/с.",
    categorySlug: "storage",
    price: 9990,
    in_stock: true,
  },
  {
    slug: "wd-black-sn850x-2tb",
    name: "WD Black SN850X 2 ТБ",
    description: "NVMe SSD M.2, PCIe 4.0, для игровых сборок.",
    categorySlug: "storage",
    price: 17990,
    in_stock: true,
  },
  {
    slug: "crucial-p3-plus-1tb",
    name: "Crucial P3 Plus 1 ТБ",
    description: "NVMe SSD M.2, PCIe 4.0, бюджетный вариант.",
    categorySlug: "storage",
    price: 6490,
    in_stock: true,
  },
  {
    slug: "kingston-kc3000-1tb",
    name: "Kingston KC3000 1 ТБ",
    description: "NVMe SSD M.2, PCIe 4.0, до 7000 МБ/с.",
    categorySlug: "storage",
    price: 10990,
    in_stock: true,
  },
  {
    slug: "seagate-barracuda-2tb-hdd",
    name: "Seagate BarraCuda 2 ТБ HDD",
    description: 'Жёсткий диск 3.5", 7200 об/мин, SATA III.',
    categorySlug: "storage",
    price: 5990,
    in_stock: true,
  },
  {
    slug: "samsung-990-pro-2tb",
    name: "Samsung 990 PRO 2 ТБ",
    description: "NVMe SSD M.2, PCIe 4.0, флагманская модель.",
    categorySlug: "storage",
    price: 22990,
    in_stock: true,
  },
  {
    slug: "wd-blue-sn580-500gb",
    name: "WD Blue SN580 500 ГБ",
    description: "NVMe SSD M.2, PCIe 4.0, начальный уровень.",
    categorySlug: "storage",
    price: 4490,
    in_stock: true,
  },
  {
    slug: "toshiba-p300-4tb-hdd",
    name: "Toshiba P300 4 ТБ HDD",
    description: 'Жёсткий диск 3.5", 5400 об/мин, для архивов.',
    categorySlug: "storage",
    price: 7990,
    in_stock: true,
  },
  {
    slug: "adata-legend-800-1tb",
    name: "ADATA Legend 800 1 ТБ",
    description: "NVMe SSD M.2, PCIe 4.0, до 3500 МБ/с.",
    categorySlug: "storage",
    price: 5990,
    in_stock: true,
  },
  {
    slug: "samsung-870-evo-1tb-sata",
    name: "Samsung 870 EVO 1 ТБ SATA",
    description: 'SATA SSD 2.5", для апгрейда старых ПК.',
    categorySlug: "storage",
    price: 8990,
    in_stock: false,
  },

  // Блоки питания
  {
    slug: "corsair-rm750e",
    name: "Corsair RM750e",
    description: "Блок питания 750 Вт, 80+ Gold, полностью модульный.",
    categorySlug: "psu",
    price: 9990,
    in_stock: true,
  },
  {
    slug: "be-quiet-pure-power-11-600w",
    name: "be quiet! Pure Power 11 600 Вт",
    description: "Блок питания 600 Вт, 80+ Gold.",
    categorySlug: "psu",
    price: 6990,
    in_stock: true,
  },
  {
    slug: "seasonic-focus-gx-850",
    name: "Seasonic Focus GX-850",
    description: "Блок питания 850 Вт, 80+ Gold, 10 лет гарантии.",
    categorySlug: "psu",
    price: 12990,
    in_stock: true,
  },
  {
    slug: "cooler-master-mwe-550",
    name: "Cooler Master MWE 550 Вт",
    description: "Блок питания 550 Вт, 80+ Bronze, для офисных ПК.",
    categorySlug: "psu",
    price: 3990,
    in_stock: true,
  },
  {
    slug: "corsair-hx1000i",
    name: "Corsair HX1000i",
    description: "Блок питания 1000 Вт, 80+ Platinum, цифровой.",
    categorySlug: "psu",
    price: 24990,
    in_stock: true,
  },
  {
    slug: "fsp-hydro-g-pro-750w",
    name: "FSP Hydro G Pro 750 Вт",
    description: "Блок питания 750 Вт, 80+ Gold, модульный.",
    categorySlug: "psu",
    price: 10990,
    in_stock: true,
  },
  {
    slug: "thermaltake-smart-bx1-500w",
    name: "Thermaltake Smart BX1 500 Вт",
    description: "Блок питания 500 Вт, 80+ Bronze.",
    categorySlug: "psu",
    price: 3490,
    in_stock: true,
  },
  {
    slug: "deepcool-pm750d",
    name: "Deepcool PM750D",
    description: "Блок питания 750 Вт, 80+ Gold.",
    categorySlug: "psu",
    price: 7990,
    in_stock: true,
  },
  {
    slug: "evga-supernova-650-gt",
    name: "EVGA SuperNOVA 650 GT",
    description: "Блок питания 650 Вт, 80+ Gold, компактный.",
    categorySlug: "psu",
    price: 8990,
    in_stock: false,
  },
  {
    slug: "msi-mpg-a850g-pcie5",
    name: "MSI MPG A850G PCIE5",
    description: "Блок питания 850 Вт, 80+ Gold, разъём 12VHPWR.",
    categorySlug: "psu",
    price: 13990,
    in_stock: true,
  },
];

export async function seedCatalog(): Promise<void> {
  // Категории
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
