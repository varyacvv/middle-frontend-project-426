import type { FastifyInstance } from "fastify";
import { pool } from "../db.js";

const PAGE_SIZE = 12;

interface ProductRow {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  in_stock: boolean;
  image_url: string | null;
  category_id: number;
  category_slug: string;
  category_name: string;
}

interface ListProductsQuery {
  category?: string;
  priceMin?: string;
  priceMax?: string;
  available?: string;
  search?: string;
  page?: string;
}

function mapProduct(row: ProductRow) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: { amount: row.price },
    inStock: row.in_stock,
    imageUrl: row.image_url,
    category: {
      id: row.category_id,
      slug: row.category_slug,
      name: row.category_name,
    },
  };
}

export async function catalogRoutes(server: FastifyInstance) {
  server.get("/api/categories", async () => {
    const result = await pool.query(
      "SELECT id, slug, name FROM categories ORDER BY name",
    );
    return result.rows;
  });

  server.get("/api/products", async (request) => {
    const q = request.query as ListProductsQuery;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (q.category) {
      params.push(q.category);
      conditions.push(`c.slug = $${params.length}`);
    }

    if (q.priceMin && !Number.isNaN(Number(q.priceMin))) {
      params.push(Number(q.priceMin));
      conditions.push(`p.price >= $${params.length}`);
    }

    if (q.priceMax && !Number.isNaN(Number(q.priceMax))) {
      params.push(Number(q.priceMax));
      conditions.push(`p.price <= $${params.length}`);
    }

    if (q.available === "true") {
      conditions.push("p.in_stock = TRUE");
    }

    if (q.search) {
      params.push(`%${q.search}%`);
      conditions.push(`p.name ILIKE $${params.length}`);
    }

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const pageRaw = Number(q.page);
    const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;

    const countResult = await pool.query<{ count: string }>(
      `SELECT COUNT(*) AS count
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ${where}`,
      params,
    );
    const total = Number(countResult.rows[0].count);

    const offset = (page - 1) * PAGE_SIZE;
    const itemsResult = await pool.query<ProductRow>(
      `SELECT
         p.id, p.slug, p.name, p.description, p.price, p.in_stock, p.image_url,
         c.id AS category_id, c.slug AS category_slug, c.name AS category_name
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ${where}
       ORDER BY p.id
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, PAGE_SIZE, offset],
    );

    const items = itemsResult.rows.map(mapProduct);

    return { items, total, page, pageSize: PAGE_SIZE };
  });

  server.get("/api/products/:slug", async (request, reply) => {
    const { slug } = request.params as { slug: string };

    const result = await pool.query<ProductRow>(
      `SELECT
         p.id, p.slug, p.name, p.description, p.price, p.in_stock, p.image_url,
         c.id AS category_id, c.slug AS category_slug, c.name AS category_name
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.slug = $1`,
      [slug],
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({
        code: "not_found",
        message: "Product not found",
      });
    }

    return mapProduct(result.rows[0]);
  });
}
