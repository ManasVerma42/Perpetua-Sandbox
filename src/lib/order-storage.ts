import { Order, OrderItem, ShippingAddress, OrderStatus } from "@/types";
import { v4 as uuidv4 } from "uuid";

const ORDERS_STORAGE_KEY = "orders";

/**
 * Retrieves all orders from localStorage
 */
export function getOrders(): Order[] {
  const ordersData = localStorage.getItem(ORDERS_STORAGE_KEY);
  return ordersData ? JSON.parse(ordersData) : [];
}

/**
 * Saves an order to localStorage (creates new or updates existing)
 */
export function saveOrder(order: Order): Order {
  const orders = getOrders();
  const existingIndex = orders.findIndex((o) => o.id === order.id);
  
  if (existingIndex !== -1) {
    orders[existingIndex] = order;
  } else {
    orders.push(order);
  }
  
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  return order;
}

/**
 * Retrieves a single order by ID
 */
export function getOrderById(id: string): Order | null {
  const orders = getOrders();
  return orders.find((order) => order.id === id) || null;
}

/**
 * Retrieves all orders for a specific user
 */
export function getUserOrders(userId: string): Order[] {
  const orders = getOrders();
  return orders.filter((order) => order.userId === userId);
}

/**
 * Creates a new order with generated ID and current date
 */
export function createOrder(
  userId: string,
  items: OrderItem[],
  totalAmount: number,
  shippingAddress: ShippingAddress,
  status: OrderStatus = "pending"
): Order {
  const order: Order = {
    id: uuidv4(),
    userId,
    items,
    date: new Date().toISOString(),
    totalAmount,
    shippingAddress,
    status,
  };
  
  return saveOrder(order);
}

/**
 * Updates the status of an existing order
 */
export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const order = getOrderById(id);
  if (!order) {
    return null;
  }
  
  const updatedOrder: Order = {
    ...order,
    status,
  };
  
  return saveOrder(updatedOrder);
}

/**
 * Deletes an order by ID
 */
export function deleteOrder(id: string): boolean {
  const orders = getOrders();
  const filteredOrders = orders.filter((order) => order.id !== id);
  
  if (filteredOrders.length === orders.length) {
    return false;
  }
  
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(filteredOrders));
  return true;
}

/**
 * Clears all orders from localStorage (useful for testing)
 */
export function clearOrders(): void {
  localStorage.removeItem(ORDERS_STORAGE_KEY);
}