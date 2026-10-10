import type { FastifyInstance } from "fastify";
import { pool } from "../db.js";
import { findUserBySession, SESSION_COOKIE } from "../auth/sessions.js";

interface OrderItemInput {
  slug: string;
  quantity: number;
}

interface CreateOrderBody {
  method?: unknown;
  name?: unknown;
  phone?: unknown;
  address?: unknown;
  items?: unknown;
}

interface ProductRow {
  id: number;
  slug: string;
  name: string;
  price: number;
  in_stock: boolean;
}

interface OrderRow {
  id: number;
  status: string;
  created_at: string;
  method: string;
  name: string;
  phone: string;
  address: string | null;
  total: number;
}

interface OrderItemRow {
  order_id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

function mapOrder(order: OrderRow, items: OrderItemRow[]) {
  return {
    id: order.id,
    status: order.status,
    createdAt: order.created_at,
    method: order.method,
    name: order.name,
    phone: order.phone,
    address: order.address,
    total: { amount: order.total },
    items: items.map((i) => ({
      productId: i.product_id,
      name: i.product_name,
      price: { amount: i.product_price },
      quantity: i.quantity,
    })),
  };
}

export async function ordersRoutes(server: FastifyInstance) {
  server.post("/api/orders", async (request, reply) => {
    const sessionId = request.cookies[SESSION_COOKIE];
    if (!sessionId) {
      return reply
        .code(401)
        .send({ code: "unauthorized", message: "Not authenticated" });
    }
    const user = await findUserBySession(sessionId);
    if (!user) {
      return reply
        .code(401)
        .send({ code: "unauthorized", message: "Not authenticated" });
    }

    const body = (request.body ?? {}) as CreateOrderBody;

    const method = body.method;
    if (method !== "delivery" && method !== "pickup") {
      return reply.code(400).send({
        code: "validation_error",
        message: "Method must be delivery or pickup",
      });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    if (!name) {
      return reply
        .code(400)
        .send({ code: "validation_error", message: "Name is required" });
    }
    if (!phone) {
      return reply
        .code(400)
        .send({ code: "validation_error", message: "Phone is required" });
    }

    const rawAddress =
      typeof body.address === "string" ? body.address.trim() : "";
    let address: string | null = null;
    if (method === "delivery") {
      if (!rawAddress) {
        return reply.code(400).send({
          code: "validation_error",
          message: "Address is required for delivery",
        });
      }
      address = rawAddress;
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return reply.code(400).send({
        code: "empty_cart",
        message: "Cart is empty",
      });
    }

    const items: OrderItemInput[] = [];
    for (const raw of body.items) {
      if (
        typeof raw !== "object" ||
        raw === null ||
        typeof (raw as OrderItemInput).slug !== "string" ||
        typeof (raw as OrderItemInput).quantity !== "number" ||
        (raw as OrderItemInput).quantity < 1
      ) {
        return reply.code(400).send({
          code: "validation_error",
          message: "Invalid cart items",
        });
      }
      items.push({
        slug: (raw as OrderItemInput).slug,
        quantity: Math.floor((raw as OrderItemInput).quantity),
      });
    }

    const slugs = items.map((i) => i.slug);
    const productsResult = await pool.query<ProductRow>(
      "SELECT id, slug, name, price, in_stock FROM products WHERE slug = ANY($1)",
      [slugs],
    );
    const productBySlug = new Map(productsResult.rows.map((p) => [p.slug, p]));

    const unavailable: { slug: string; reason: string }[] = [];
    for (const item of items) {
      const product = productBySlug.get(item.slug);
      if (!product) {
        unavailable.push({ slug: item.slug, reason: "not_found" });
      } else if (!product.in_stock) {
        unavailable.push({ slug: item.slug, reason: "out_of_stock" });
      }
    }

    if (unavailable.length > 0) {
      return reply.code(409).send({
        code: "unavailable_products",
        message: "Some products are unavailable",
        unavailable,
      });
    }

    let total = 0;
    const lines = items.map((item) => {
      const product = productBySlug.get(item.slug)!;
      const sum = product.price * item.quantity;
      total += sum;
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      };
    });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const orderResult = await client.query<{
        id: number;
        created_at: string;
      }>(
        `INSERT INTO orders (user_id, method, name, phone, address, total)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, created_at`,
        [user.id, method, name, phone, address, total],
      );
      const orderId = orderResult.rows[0].id;
      const createdAt = orderResult.rows[0].created_at;

      for (const line of lines) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity)
           VALUES ($1, $2, $3, $4, $5)`,
          [orderId, line.productId, line.name, line.price, line.quantity],
        );
      }

      await client.query("COMMIT");

      return reply.code(201).send({
        id: orderId,
        status: "paid",
        createdAt,
        method,
        name,
        phone,
        address,
        total: { amount: total },
        items: lines.map((line) => ({
          productId: line.productId,
          name: line.name,
          price: { amount: line.price },
          quantity: line.quantity,
        })),
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  });

  server.get("/api/orders", async (request, reply) => {
    const sessionId = request.cookies[SESSION_COOKIE];
    if (!sessionId) {
      return reply
        .code(401)
        .send({ code: "unauthorized", message: "Not authenticated" });
    }
    const user = await findUserBySession(sessionId);
    if (!user) {
      return reply
        .code(401)
        .send({ code: "unauthorized", message: "Not authenticated" });
    }

    const ordersResult = await pool.query<OrderRow>(
      `SELECT id, status, created_at, method, name, phone, address, total
       FROM orders
       WHERE user_id = $1
       ORDER BY id DESC`,
      [user.id],
    );

    if (ordersResult.rows.length === 0) {
      return [];
    }

    const orderIds = ordersResult.rows.map((o) => o.id);
    const itemsResult = await pool.query<OrderItemRow>(
      `SELECT order_id, product_id, product_name, product_price, quantity
       FROM order_items
       WHERE order_id = ANY($1)
       ORDER BY id`,
      [orderIds],
    );

    const itemsByOrder = new Map<number, OrderItemRow[]>();
    for (const item of itemsResult.rows) {
      const list = itemsByOrder.get(item.order_id) ?? [];
      list.push(item);
      itemsByOrder.set(item.order_id, list);
    }

    return ordersResult.rows.map((order) =>
      mapOrder(order, itemsByOrder.get(order.id) ?? []),
    );
  });

  server.get("/api/orders/:id", async (request, reply) => {
    const sessionId = request.cookies[SESSION_COOKIE];
    if (!sessionId) {
      return reply
        .code(401)
        .send({ code: "unauthorized", message: "Not authenticated" });
    }
    const user = await findUserBySession(sessionId);
    if (!user) {
      return reply
        .code(401)
        .send({ code: "unauthorized", message: "Not authenticated" });
    }

    const id = Number((request.params as { id: string }).id);
    if (!Number.isInteger(id) || id <= 0) {
      return reply
        .code(404)
        .send({ code: "not_found", message: "Order not found" });
    }

    const orderResult = await pool.query<OrderRow>(
      `SELECT id, status, created_at, method, name, phone, address, total
       FROM orders
       WHERE id = $1 AND user_id = $2`,
      [id, user.id],
    );

    if (orderResult.rows.length === 0) {
      return reply
        .code(404)
        .send({ code: "not_found", message: "Order not found" });
    }

    const itemsResult = await pool.query<OrderItemRow>(
      `SELECT order_id, product_id, product_name, product_price, quantity
       FROM order_items
       WHERE order_id = $1
       ORDER BY id`,
      [id],
    );

    return mapOrder(orderResult.rows[0], itemsResult.rows);
  });
}
