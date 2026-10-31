import { Order } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface OrderDetailProps {
  order: Order;
}

export function OrderDetail({ order }: OrderDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order #{order.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{format(new Date(order.date), "MMM dd, yyyy")}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping Address:</span>
            <span>
              {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
              , {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </span>
          </div>
          <div>
            <h3 className="font-medium">Order Items</h3>
            <ul className="mt-2 space-y-2">
              {order.items.map((item) => (
                <li key={item.productId} className="flex justify-between">
                  <span>{item.productId}</span>
                  <span>x {item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderDetail;