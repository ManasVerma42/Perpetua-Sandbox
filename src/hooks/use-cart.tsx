// src/hooks/use-cart.tsx

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import {
  getCartItems,
  saveCartItems,
  clearCartStorage,
  addCartItem as addToStorage,
  removeCartItem as removeFromStorage,
  updateCartItemQuantity as updateInStorage,
} from "@/lib/cart-storage";
import { CartItem, CartItems } from "@/types/cart";

interface CartContextValue {
  items: CartItems;
  addItem: (productId: string, quantity: number, color?: string) => void;
  removeItem: (productId: string, color?: string) => void;
  updateQuantity: (productId: string, color: string | undefined, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItems>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    return getCartItems();
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      saveCartItems(items);
    }
  }, [items]);

  const addItem = useCallback((productId: string, quantity: number, color?: string) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.productId === productId && item.color === color
      );

      if (existingItem) {
        toast({
          title: "Cart updated",
          description: `Quantity increased in your cart.`,
        });
      } else {
        toast({
          title: "Added to cart",
          description: `Item has been added to your cart.`,
        });
      }

      return addToStorage(prevItems, productId, quantity, color);
    });
  }, []);

  const removeItem = useCallback((productId: string, color?: string) => {
    setItems((prevItems) => {
      const item = prevItems.find(
        (item) => item.productId === productId && item.color === color
      );
      if (item) {
        toast({
          title: "Item removed",
          description: `Item has been removed from your cart.`,
        });
      }
      return removeFromStorage(prevItems, productId, color);
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, color: string | undefined, quantity: number) => {
      setItems((prevItems) => updateInStorage(prevItems, productId, color, quantity));
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
    clearCartStorage();
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0) * 0;
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartProvider;