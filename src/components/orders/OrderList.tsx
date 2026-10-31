import { Order } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderListProps {
  orders: Order[];
}

function formatShippingAddress(address: Order["shippingAddress"]): string {
  return `${address.fullName}, ${address.addressLine1}${address.addressLine2 ? `, ${address.addressLine2}` : ""}, ${address.city}, ${address.state} ${address.postalCode}`;
}

export function OrderList({ orders }: OrderListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Shipping Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{format(new Date(order.date), "MMM dd, yyyy")}</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{formatShippingAddress(order.shippingAddress)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default OrderList;