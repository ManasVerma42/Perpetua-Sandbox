import { useState, useEffect, useCallback } from "react";
import { Order, OrderItem, ShippingAddress, OrderStatus } from "@/types";
import {
  getOrdersByUserId,
  getOrderById as fetchOrderById,
  createOrder,
} from "@/lib/orders";

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  createOrder: (
    userId: string,
    items: OrderItem[],
    totalAmount: number,
    shippingAddress: ShippingAddress,
    status?: OrderStatus
  ) => Order;
  getOrderById: (id: string) => Order | null;
  getUserOrders: (userId: string) => Order[];
  refreshOrders: (userId: string) => void;
}

export function useOrders(userId?: string): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadOrders = useCallback((uid: string) => {
    try {
      setLoading(true);
      const storedOrders = getOrdersByUserId(uid);
      setOrders(storedOrders);
    } catch {
      // If loading fails, set empty orders
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      loadOrders(userId);
    } else {
      setLoading(false);
    }
  }, [userId, loadOrders]);

  // Cross-tab synchronization via storage event
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "orders" || event.key === null) {
        if (userId) {
          loadOrders(userId);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [userId, loadOrders]);

  const createOrderCallback = useCallback(
    (
      orderUserId: string,
      items: OrderItem[],
      totalAmount: number,
      shippingAddress: ShippingAddress,
      status: OrderStatus = "pending"
    ): Order => {
      const orderId = `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const newOrder: Order = {
        id: orderId,
        userId: orderUserId,
        items,
        date: new Date().toISOString(),
        totalAmount,
        shippingAddress,
        status,
      };
      createOrder(newOrder);
      setOrders((prev) => [...prev, newOrder]);
      return newOrder;
    },
    []
  );

  const getOrderByIdCallback = useCallback((id: string): Order | null => {
    return fetchOrderById(id) || null;
  }, []);

  const getUserOrdersCallback = useCallback((uid: string): Order[] => {
    return getOrdersByUserId(uid);
  }, []);

  const refreshOrders = useCallback(
    (uid: string) => {
      loadOrders(uid);
    },
    [loadOrders]
  );

  return {
    orders,
    loading,
    createOrder: createOrderCallback,
    getOrderById: getOrderByIdCallback,
    getUserOrders: getUserOrdersCallback,
    refreshOrders,
  };
}

export default useOrders;