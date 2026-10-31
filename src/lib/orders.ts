// src/lib/orders.ts
import { Order, CartItem } from "@/types";

const STORAGE_KEY = "orders";

function getStoredOrders(): Order[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Order[];
    }
  } catch {
    // If parsing fails, return empty array
  }
  return [];
}

function saveOrders(orders: Order[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function generateOrderId(): string {
  return `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getOrdersByUserId(userId: string): Order[] {
  const orders = getStoredOrders();
  return orders
    .filter((order) => order.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getOrderById(orderId: string): Order | undefined {
  const orders = getStoredOrders();
  return orders.find((order) => order.id === orderId);
}

export function createOrder(order: Order): void {
  const orders = getStoredOrders();
  orders.push(order);
  saveOrders(orders);
}

export function createOrderFromCart(
  userId: string,
  cartItems: CartItem[],
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  }
): Order {
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const order: Order = {
    id: generateOrderId(),
    userId,
    date: new Date().toISOString(),
    items: cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
    shippingAddress,
    totalAmount,
    status: "pending",
  };

  createOrder(order);
  return order;
}

export function getOrders(userId: string): Order[] {
  return getOrdersByUserId(userId);
}

export default {
  getOrdersByUserId,
  getOrderById,
  createOrder,
  createOrderFromCart,
  getOrders,
};