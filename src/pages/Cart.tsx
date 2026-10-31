import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/store/use-cart";
import { formatPrice } from "@/components/store/store-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Cart() {
  const { lines, count, total, setQuantity, remove } = useCart();
  const navigate = useNavigate();

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-16">
        <div className="rounded-full bg-muted p-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Your cart is empty</h1>
          <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        </div>
        <Button onClick={() => navigate("/shop")} className="rounded-full">
          Browse products
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Your cart</h1>
        <span className="text-sm text-muted-foreground">
          {count} {count === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {lines.map((line) => {
            const swatch = line.color ? line.item.colors?.find((c) => c.name === line.color) : undefined;
            return (
              <Card key={`${line.item.id}-${line.color ?? ""}-${line.size ?? ""}`} className="rounded-xl border bg-card shadow-sm">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                      <img src={line.item.image} alt={line.item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate font-medium text-foreground">{line.item.name}</h3>
                          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            {swatch && (
                              <span className="h-3 w-3 rounded-full border" style={{ backgroundColor: swatch.hex }} />
                            )}
                            <span>{[line.color, line.size].filter(Boolean).join(" · ") || line.item.category}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => remove(line)}
                          aria-label={`Remove ${line.item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setQuantity(line, line.quantity - 1)}
                            disabled={line.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium tabular-nums">{line.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setQuantity(line, line.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{formatPrice(line.item.price * line.quantity)}</p>
                          {line.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">{formatPrice(line.item.price)} each</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20 rounded-xl border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {lines.map((line) => (
                  <div key={`${line.item.id}-${line.color ?? ""}-${line.size ?? ""}`} className="flex justify-between text-sm">
                    <span className="mr-2 truncate text-muted-foreground">
                      {line.item.name} × {line.quantity}
                    </span>
                    <span className="flex-shrink-0 text-foreground">{formatPrice(line.item.price * line.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">Free</span>
                </div>
              </div>
              <div className="flex justify-between border-t pt-4 font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">{formatPrice(total)}</span>
              </div>
              <Button className="w-full rounded-full" onClick={() => navigate("/checkout")}>
                Proceed to checkout
              </Button>
              <Button variant="outline" className="w-full rounded-full" onClick={() => navigate("/shop")}>
                Continue shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Cart;
