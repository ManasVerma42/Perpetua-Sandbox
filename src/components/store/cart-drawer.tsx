import { useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/components/store/use-cart';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { lines, count, total, setQuantity, clear } = useCart();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleQuantityUpdate = (lineId: string, newQuantity: number) => {
    const line = lines.find(l => l.item.id === lineId);
    if (line) {
      setQuantity(line, newQuantity);
    }
  };

  const handleRemoveItem = (line: typeof lines[0]) => {
    const itemName = line.item.name;
    setQuantity(line, 0);
    toast({
      title: 'Item removed',
      description: `${itemName} has been removed from your cart.`,
    });
  };

  const subtotal = total;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => onOpenChange(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Your Cart</h2>
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
        <div className="flex h-[calc(100%-180px)] flex-col overflow-hidden">
          {count === 0 ? (
            // Empty state
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">
                  Add some items to get started
                </p>
              </div>
              <Button onClick={() => onOpenChange(false)}>
                <a href="/shop">Continue Shopping</a>
              </Button>
            </div>
          ) : (
            // Cart items
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {lines.map((line) => (
                  <div
                    key={`${line.item.id}-${line.color}-${line.size}`}
                    className="flex gap-4 rounded-xl border bg-card p-4"
                  >
                    {/* Product Image */}
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      {line.item.image ? (
                        <img
                          src={line.item.image}
                          alt={line.item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium line-clamp-1">{line.item.name}</h3>
                          {(line.color || line.size) && (
                            <p className="text-xs text-muted-foreground">
                              {[line.color, line.size].filter(Boolean).join(' · ')}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveItem(line)}
                          aria-label={`Remove ${line.item.name} from cart`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityUpdate(line.item.id, line.quantity - 1)}
                            aria-label={`Decrease quantity of ${line.item.name}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-10 text-center text-sm font-medium">
                            {line.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityUpdate(line.item.id, line.quantity + 1)}
                            aria-label={`Increase quantity of ${line.item.name}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Price */}
                        <p className="font-semibold">
                          ${((line.item.price || 0) * line.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {count > 0 && (
          <div className="border-t bg-background px-6 py-4">
            <div className="flex items-center justify-between pb-4">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-xl font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <Button className="w-full rounded-full" size="lg">
              <a href="/checkout">Proceed to checkout</a>
            </Button>
            <Button
              variant="ghost"
              className="mt-2 w-full text-sm text-muted-foreground"
              onClick={() => {
                clear();
                onOpenChange(false);
              }}
            >
              Clear cart
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export function CartDrawerTrigger({ 
  children, 
  onClick 
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
}) {
  return (
    <div onClick={onClick} className="cursor-pointer">
      {children}
    </div>
  );
}

export default CartDrawer;