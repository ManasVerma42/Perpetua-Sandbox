// src/types/cart.ts

export interface CartItem {
  productId: string;
  quantity: number;
  color?: string;
}

export type CartItems = CartItem[];