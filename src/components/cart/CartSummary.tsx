import { CartItem as CartItemType } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CartSummaryProps {
  items: CartItemType[];
}

export function CartSummary({ items }: CartSummaryProps) {
  const navigate = useNavigate();

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between">
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CartSummary;