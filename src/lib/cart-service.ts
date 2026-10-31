import { Cart, CartItem, cartSchema, cartItemSchema } from "@/types";
import { z } from "zod";

const CART_STORAGE_KEY = "cart";

export function getCart(): Cart {
  const cartData = localStorage.getItem(CART_STORAGE_KEY);
  if (!cartData) {
    return { userId: "", items: [] };
  }
  
  try {
    const parsedCart = JSON.parse(cartData);
    const result = cartSchema.safeParse(parsedCart.items || parsedCart);
    if (result.success) {
      return { userId: parsedCart.userId || "", items: result.data };
    }
    console.error("Invalid cart data in localStorage", result.error);
    return { userId: "", items: [] };
  } catch (error) {
    console.error("Error parsing cart data from localStorage", error);
    return { userId: "", items: [] };
  }
}

export function saveCart(cart: Cart): void {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  
  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex((i: CartItem) => i.product?.id === item.product?.id);
  
  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    const updatedCart = { ...cart, items: [...cart.items] };
    updatedCart.items[existingItemIndex].quantity += item.quantity;
    saveCart(updatedCart);
  } else {
    // Add new item if it doesn't exist
    saveCart({ ...cart, items: [...cart.items, item] });
  }
}

export function removeFromCart(itemId: string): void {
  const cart = getCart();
  const updatedCart = { ...cart, items: cart.items.filter((item: CartItem) => item.product?.id !== itemId) };
  saveCart(updatedCart);
}

export function updateQuantity(itemId: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(itemId);
    return;
  }
  
  const cart = getCart();
  const updatedCart = {
    ...cart,
    items: cart.items.map((item: CartItem) => {
      if (item.product?.id === itemId) {
        return { ...item, quantity };
      }
      return item;
    }),
  };
  
  saveCart(updatedCart);
}

export function clearCart(): void {
  localStorage.removeItem(CART_STORAGE_KEY);
}

export { cartSchema, cartItemSchema };
export type { Cart, CartItem };