import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useOrders } from "@/hooks/use-orders";
import { Order } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Package, MapPin } from "lucide-react";

export function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = (location.state as { orderId?: string })?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate("/shop");
      return;
    }

    const fetchedOrder = getOrderById(orderId);
    if (!fetchedOrder) {
      navigate("/shop");
      return;
    }

    setOrder(fetchedOrder);
    setLoading(false);
  }, [orderId, navigate, getOrderById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Card className="rounded-xl">
              <CardContent className="py-12">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Order Confirmed
          </h1>
          <p className="text-muted-foreground">
            Thank you for your purchase!
          </p>
        </div>

        <Card className="mb-6 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-medium">
                #{order.id.slice(-8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span>{formatDate(order.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="capitalize">{order.status}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{order.shippingAddress.fullName}</p>
            <p className="text-muted-foreground">
              {order.shippingAddress.addressLine1}
            </p>
            {order.shippingAddress.addressLine2 && (
              <p className="text-muted-foreground">
                {order.shippingAddress.addressLine2}
              </p>
            )}
            <p className="text-muted-foreground">
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p className="text-muted-foreground">
              {order.shippingAddress.country}
            </p>
            {order.shippingAddress.phone && (
              <p className="text-muted-foreground">
                {order.shippingAddress.phone}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Items Ordered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <p className="font-medium">Product {item.productId}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 rounded-xl">
          <CardContent className="py-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/shop")} variant="outline" className="rounded-full">
            Continue Shopping
          </Button>
          <Button onClick={() => navigate("/orders")} className="rounded-full">
            View Order History
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;