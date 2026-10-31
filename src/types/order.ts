import { z } from "zod";

// Order Item interface represents an individual item in an order
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

// Order interface represents a complete order
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

// CartItem interface represents an item in a shopping cart
export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

// Cart interface represents a shopping cart
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Zod schema for validating OrderItem structure
export const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
  price: z.number().nonnegative(),
});

// Zod schema for validating Order structure
export const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(orderItemSchema),
  totalAmount: z.number().nonnegative(),
  status: z.enum(["pending", "processing", "completed", "cancelled"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Zod schema for validating CartItem structure
export const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
  price: z.number().nonnegative(),
});

// Zod schema for validating Cart structure
export const cartSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(cartItemSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});
