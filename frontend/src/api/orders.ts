export interface OrderItem {
  productId: number;
  name: string;
  price: { amount: number };
  quantity: number;
}

export interface Order {
  id: number;
  status: string;
  createdAt: string;
  method: string;
  name: string;
  phone: string;
  address: string | null;
  total: { amount: number };
  items: OrderItem[];
}

export interface OrderItemInput {
  slug: string;
  quantity: number;
}

export interface CreateOrderInput {
  method: "delivery" | "pickup";
  name: string;
  phone: string;
  address?: string;
  items: OrderItemInput[];
}

export interface UnavailableItem {
  slug: string;
  reason: string;
}

export class OrderError extends Error {
  code: string;
  unavailable: UnavailableItem[];

  constructor(code: string, message: string, unavailable: UnavailableItem[]) {
    super(message);
    this.code = code;
    this.unavailable = unavailable;
  }
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const res = await fetch("/api/orders", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    let body: {
      code?: string;
      message?: string;
      unavailable?: UnavailableItem[];
    } = {};
    try {
      body = await res.json();
    } catch {
      // ignore
    }
    throw new OrderError(
      body.code ?? "unknown",
      body.message ?? "Something went wrong",
      body.unavailable ?? [],
    );
  }

  return res.json();
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch("/api/orders", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load orders");
  return res.json();
}

export async function fetchOrder(id: number): Promise<Order> {
  const res = await fetch(`/api/orders/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load order");
  return res.json();
}
