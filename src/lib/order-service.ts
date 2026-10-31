import { Order, OrderItem, CartItem } from "@/types/order";
import { v4 as uuidv4 } from "uuid";

/**
 * Interface for the response structure when fetching user orders
 */
export interface FetchUserOrdersResponse {
  orders: Order[];
}

/**
 * Interface for payment details
 */
export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
}

/**
 * Fetches the user's order history from localStorage
 * @returns Promise with the user's orders
 */
export async function fetchUserOrders(): Promise<FetchUserOrdersResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Get orders from localStorage
  const storedOrders = localStorage.getItem("orders");
  const orders: Order[] = storedOrders ? JSON.parse(storedOrders) : [];

  return { orders };
}

/**
 * Submits a new order to localStorage
 * @param cart - The cart to convert to an order
 * @param userId - The user placing the order
 * @returns Promise with the created order
 */
export async function submitOrder(cart: CartItem[], userId: string): Promise<Order> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const now = new Date();

  // Create a new order from the cart
  const newOrder: Order = {
    id: uuidv4(),
    userId,
    items: cart.map((item): OrderItem => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
    totalAmount: cart.reduce((total, item) => total + item.price * item.quantity, 0),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  // Save the order to localStorage
  const storedOrders = localStorage.getItem("orders");
  const orders: Order[] = storedOrders ? JSON.parse(storedOrders) : [];
  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  return newOrder;
}

/**
 * Validates payment details
 * @param paymentDetails - The payment details to validate
 * @returns Promise with validation result
 */
export async function validatePayment(paymentDetails: PaymentDetails): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simple validation for demonstration purposes
  // In a real application, this would call a payment gateway API
  if (
    paymentDetails.cardNumber.length === 16 &&
    paymentDetails.expiryDate.match(/^\d{2}\/\d{2}$/) &&
    paymentDetails.cvv.length === 3 &&
    paymentDetails.cardHolderName.trim().length > 0
  ) {
    return true;
  }

  return false;
}

/**
 * Processes a simulated payment
 * @param orderId - The order ID to process payment for
 * @param paymentDetails - The payment details
 * @returns Promise with payment success status
 */
export async function processPayment(orderId: string, paymentDetails: PaymentDetails): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Validate payment details first
  const isValid = await validatePayment(paymentDetails);
  if (!isValid) {
    return false;
  }

  // Simulate payment processing
  // In a real application, this would call a payment gateway API
  const storedOrders = localStorage.getItem("orders");
  if (!storedOrders) return false;

  const orders: Order[] = JSON.parse(storedOrders);
  const orderIndex = orders.findIndex((order) => order.id === orderId);

  if (orderIndex === -1) {
    return false;
  }

  // Update order status to processing
  orders[orderIndex] = {
    ...orders[orderIndex],
    status: "processing",
    updatedAt: new Date(),
  };

  localStorage.setItem("orders", JSON.stringify(orders));

  // Simulate successful payment
  return true;
}

/**
 * Completes an order after successful payment
 * @param orderId - The order ID to complete
 * @returns Promise with completion status
 */
export async function completeOrder(orderId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const storedOrders = localStorage.getItem("orders");
  if (!storedOrders) return false;

  const orders: Order[] = JSON.parse(storedOrders);
  const orderIndex = orders.findIndex((order) => order.id === orderId);

  if (orderIndex === -1) {
    return false;
  }

  // Update order status to completed
  orders[orderIndex] = {
    ...orders[orderIndex],
    status: "completed",
    updatedAt: new Date(),
  };

  localStorage.setItem("orders", JSON.stringify(orders));

  return true;
}