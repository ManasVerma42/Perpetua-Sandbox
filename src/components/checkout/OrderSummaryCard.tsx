import { useCart } from "@/components/store/use-cart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function OrderSummaryCard() {
  const { lines, total } = useCart();

  const subtotal = lines.reduce(
    (sum, line) => sum + line.item.price * line.quantity,
    0
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lines.map((line) => (
            <div key={`${line.item.id}-${line.color || ""}-${line.size || ""}`} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium">{line.item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Qty: {line.quantity}
                  {line.color && <span className="ml-2">• {line.color}</span>}
                  {line.size && <span className="ml-2">• {line.size}</span>}
                </p>
              </div>
              <p className="font-medium">
                {formatPrice(line.item.price * line.quantity)}
              </p>
            </div>
          ))}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-muted-foreground">Free</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderSummaryCard;