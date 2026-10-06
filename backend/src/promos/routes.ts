import type { FastifyInstance } from "fastify";
import { pool } from "../db.js";

interface PromoRow {
  id: number;
  title: string;
  text: string;
  product_id: number;
  product_slug: string;
  product_name: string;
  product_description: string;
  product_price: number;
  product_in_stock: boolean;
  product_image_url: string | null;
  category_id: number;
  category_slug: string;
  category_name: string;
}

export async function promosRoutes(server: FastifyInstance) {
  server.get("/api/promos", async () => {
    const result = await pool.query<PromoRow>(
      `SELECT
         p.id, p.title, p.text,
         pr.id AS product_id,
         pr.slug AS product_slug,
         pr.name AS product_name,
         pr.description AS product_description,
         pr.price AS product_price,
         pr.in_stock AS product_in_stock,
         pr.image_url AS product_image_url,
         c.id AS category_id,
         c.slug AS category_slug,
         c.name AS category_name
       FROM promos p
       JOIN products pr ON pr.id = p.product_id
       JOIN categories c ON c.id = pr.category_id
       WHERE pr.in_stock = TRUE
       ORDER BY p.id`,
    );

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      text: row.text,
      product: {
        id: row.product_id,
        slug: row.product_slug,
        name: row.product_name,
        description: row.product_description,
        price: { amount: row.product_price },
        inStock: row.product_in_stock,
        imageUrl: row.product_image_url,
        category: {
          id: row.category_id,
          slug: row.category_slug,
          name: row.category_name,
        },
      },
    }));
  });
}
