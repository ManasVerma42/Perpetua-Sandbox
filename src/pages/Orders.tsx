import { useState } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "@/hooks/use-orders";
import { useAuth } from "@/lib/local-auth";
import { RequireAuth } from "@/components/auth/require-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order, OrderStatus } from "@/types";
import { ChevronDown, ChevronUp, Package, MapPin, ShoppingBag } from "lucide-react";
import React from "react";

function getStatusBadgeVariant(status: OrderStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "delivered":
      return "default";
    case "processing":
    case "shipped":
      return "secondary";
    case "pending":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
}

function formatStatus(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-6" />
        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-sm">
          You haven&apos;t placed any orders yet. Start shopping to see your orders here.
        </p>
        <Button asChild className="rounded-full">
          <Link to="/shop">Browse products</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function OrdersContent() {
  const { user } = useAuth();
  const ordersResult = useOrders(user?.id);
  const orders = ordersResult.orders;
  const loading = ordersResult.loading;
  const error = 'error' in ordersResult ? ordersResult.error : undefined;
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (orderId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-32" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Order History</h1>
          <p className="text-muted-foreground">View your past orders and track their status.</p>
        </div>
        <Card className="border-destructive/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive text-center mb-4">
              {error instanceof Error ? error.message : String(error)}
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Order History</h1>
          <p className="text-muted-foreground">View your past orders and track their status.</p>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Order History</h1>
        <p className="text-muted-foreground">
          {orders.length} order{orders.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12">
                  <span className="sr-only">Expand</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: Order) => {
                const isExpanded = expandedRows.has(order.id);
                return (
                  <React.Fragment key={order.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleRow(order.id)}
                    >
                      <TableCell className="font-medium">
                        #{order.id.slice(-8).toUpperCase()}
                      </TableCell>
                      <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {formatStatus(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <button
                          className="p-1 hover:bg-muted rounded-full transition-colors"
                          aria-label={isExpanded ? "Collapse row" : "Expand row"}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={5} className="p-0">
                          <div className="p-6 space-y-6">
                            {/* Shipping Address */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm font-medium">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                Shipping Address
                              </div>
                              <div className="text-sm text-muted-foreground pl-6">
                                <p>{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.addressLine1}</p>
                                {order.shippingAddress.addressLine2 && (
                                  <p>{order.shippingAddress.addressLine2}</p>
                                )}
                                <p>
                                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                                  {order.shippingAddress.postalCode}
                                </p>
                                <p>{order.shippingAddress.country}</p>
                                {order.shippingAddress.phone && (
                                  <p>Phone: {order.shippingAddress.phone}</p>
                                )}
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm font-medium">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                Order Items
                              </div>
                              <div className="pl-6">
                                <div className="space-y-2">
                                  {order.items.map((item, index) => (
                                    <div
                                      key={`${item.productId}-${index}`}
                                      className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                          <Package className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                          <p className="font-medium">
                                            Product #{item.productId.slice(-6).toUpperCase()}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            Qty: {item.quantity}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Order Summary */}
                            <div className="flex justify-end pt-4 border-t">
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Order Total</p>
                                <p className="text-2xl font-semibold">
                                  {formatCurrency(order.totalAmount)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function Orders() {
  return (
    <RequireAuth>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <OrdersContent />
      </div>
    </RequireAuth>
  );
}

export default Orders;