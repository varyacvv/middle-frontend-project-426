import { createContext } from "react";

export interface CartItem {
  slug: string;
  quantity: number;
}

export interface CartContextValue {
  items: CartItem[];
  add: (slug: string) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  totalCount: number;
}

export const CartContext = createContext<CartContextValue | null>(null);
