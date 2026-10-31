import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Order, OrderItem, ShippingAddress, OrderStatus } from "@/types";
import {
  getOrders as fetchOrders,
  saveOrder,
  getOrderById as fetchOrderById,
  getUserOrders as fetchUserOrders,
  createOrder as createNewOrder,
} from "@/lib/order-storage";

interface OrdersContextValue {
  orders: Order[];
  loading: boolean;
  error: Error | null;
  createOrder: (
    userId: string,
    items: OrderItem[],
    totalAmount: number,
    shippingAddress: ShippingAddress,
    status?: OrderStatus
  ) => Order;
  getOrders: () => Order[];
  getOrderById: (id: string) => Order | null;
  getUserOrders: (userId: string) => Order[];
  refreshOrders: () => void;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

interface OrdersProviderProps {
  children: ReactNode;
}

export function OrdersProvider({ children }: OrdersProviderProps): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadOrders = useCallback(() => {
    try {
      setLoading(true);
      const storedOrders = fetchOrders();
      setOrders(storedOrders);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load orders"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Cross-tab synchronization via storage event
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "orders" || event.key === null) {
        loadOrders();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadOrders]);

  const createOrder = useCallback(
    (
      userId: string,
      items: OrderItem[],
      totalAmount: number,
      shippingAddress: ShippingAddress,
      status: OrderStatus = "pending"
    ): Order => {
      const newOrder = createNewOrder(userId, items, totalAmount, shippingAddress, status);
      setOrders((prev) => [...prev, newOrder]);
      return newOrder;
    },
    []
  );

  const getOrdersCallback = useCallback((): Order[] => {
    return fetchOrders();
  }, []);

  const getOrderById = useCallback((id: string): Order | null => {
    return fetchOrderById(id);
  }, []);

  const getUserOrdersCallback = useCallback((userId: string): Order[] => {
    return fetchUserOrders(userId);
  }, []);

  const refreshOrders = useCallback(() => {
    loadOrders();
  }, [loadOrders]);

  const value: OrdersContextValue = {
    orders,
    loading,
    error,
    createOrder,
    getOrders: getOrdersCallback,
    getOrderById,
    getUserOrders: getUserOrdersCallback,
    refreshOrders,
  };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersContextValue {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}

export default OrdersProvider;