export interface Category {
  id: number;
  slug: string;
  name: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: { amount: number };
  inStock: boolean;
  imageUrl: string | null;
  category: Category;
}

export interface ProductList {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProductFilters {
  category: string;
  priceMin: string;
  priceMax: string;
  available: boolean;
  search: string;
  page: number;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to load categories");
  return res.json();
}

export async function fetchProducts(
  filters: ProductFilters,
  signal?: AbortSignal,
): Promise<ProductList> {
  const params = new URLSearchParams();

  if (filters.category) params.set("category", filters.category);
  if (filters.priceMin) params.set("priceMin", filters.priceMin);
  if (filters.priceMax) params.set("priceMax", filters.priceMax);
  if (filters.available) params.set("available", "true");
  if (filters.search) params.set("search", filters.search);
  if (filters.page > 1) params.set("page", String(filters.page));

  const query = params.toString();
  const url = query ? `/api/products?${query}` : "/api/products";

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function fetchProduct(slug: string): Promise<Product> {
  const res = await fetch(`/api/products/${slug}`);
  if (!res.ok) throw new Error("Failed to load product");
  return res.json();
}
