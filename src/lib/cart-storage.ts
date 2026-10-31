// src/lib/cart-storage.ts

import { CartItem, CartItems } from "@/types/cart";

export const CART_STORAGE_KEY = "simpleshop_cart";

export function getCartItems(): CartItems {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
    return [];
  }
}

export function saveCartItems(items: CartItems): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
}

export function clearCartStorage(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing cart from localStorage:", error);
  }
}

export function findCartItem(
  items: CartItems,
  productId: string,
  color?: string
): CartItem | undefined {
  return items.find(
    (item) => item.productId === productId && item.color === color
  );
}

export function addCartItem(
  items: CartItems,
  productId: string,
  quantity: number,
  color?: string
): CartItems {
  const existingIndex = items.findIndex(
    (item) => item.productId === productId && item.color === color
  );

  if (existingIndex >= 0) {
    const updated = [...items];
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: updated[existingIndex].quantity + quantity,
    };
    return updated;
  }

  return [...items, { productId, quantity, color }];
}

export function removeCartItem(
  items: CartItems,
  productId: string,
  color?: string
): CartItems {
  return items.filter(
    (item) => !(item.productId === productId && item.color === color)
  );
}

export function updateCartItemQuantity(
  items: CartItems,
  productId: string,
  color: string | undefined,
  quantity: number
): CartItems {
  if (quantity <= 0) {
    return removeCartItem(items, productId, color);
  }

  return items.map((item) =>
    item.productId === productId && item.color === color
      ? { ...item, quantity }
      : item
  );
}