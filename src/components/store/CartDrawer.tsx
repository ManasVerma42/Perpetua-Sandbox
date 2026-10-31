import { useNavigate } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "./use-cart";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { lines, count, total, setQuantity, remove, clear } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onOpenChange(false);
    navigate("/checkout");
  };

  const handleViewCart = () => {
    onOpenChange(false);
    navigate("/cart");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 transition-opacity"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background shadow-xl transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-foreground">
              Your Cart
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {lines.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">
                  Your cart is empty
                </p>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => onOpenChange(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {lines.map((line) => (
                  <div
                    key={`${line.item.id}-${line.color || "default"}`}
                    className="flex gap-4 py-4 border-b"
                  >
                    {/* Product Image */}
                    <div className="h-20 w-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {line.item.image ? (
                        <img
                          src={line.item.image}
                          alt={line.item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">
                        {line.item.name}
                      </h3>
                      {line.color && (
                        <p className="text-sm text-muted-foreground">
                          {line.color}
                        </p>
                      )}
                      <p className="text-sm font-medium text-foreground mt-1">
                        {formatPrice(line.item.price || 0)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() =>
                            setQuantity(line, Math.max(1, line.quantity - 1))
                          }
                          disabled={line.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {line.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => setQuantity(line, line.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto text-muted-foreground hover:text-destructive"
                          onClick={() => remove(line)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {lines.length > 0 && (
            <div className="border-t px-6 py-4 space-y-4 bg-background">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Subtotal ({count} {count === 1 ? "item" : "items"})
                </span>
                <span className="text-lg font-semibold text-foreground">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  className="w-full rounded-full"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={handleViewCart}
                >
                  View Cart
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={clear}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CartDrawer;