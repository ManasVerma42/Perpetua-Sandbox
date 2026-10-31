import { useState } from "react";
import { Minus, Plus, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PriceCardProps {
  price: number;
  oldPrice?: number;
  name: string;
  inStock?: boolean;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onWishlist?: () => void;
  loading?: boolean;
}

export function PriceCard({
  price,
  oldPrice,
  name,
  inStock = true,
  quantity,
  onQuantityChange,
  onAddToCart,
  onWishlist,
  loading = false,
}: PriceCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await onAddToCart();
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      onQuantityChange(newQuantity);
    }
  };

  const savings = oldPrice ? oldPrice - price : 0;
  const savingsPercent = oldPrice ? Math.round((savings / oldPrice) * 100) : 0;

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-5 space-y-4 border shadow-sm">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-5 space-y-4 border shadow-sm">
      {/* Price display */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-4xl font-bold text-foreground">
          ₹{price.toLocaleString()}
        </span>
        {oldPrice && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              ₹{oldPrice.toLocaleString()}
            </span>
            <Badge className="bg-accent text-accent-foreground rounded-full">
              Save {savingsPercent}%
            </Badge>
          </>
        )}
      </div>

      {/* EMI info */}
      {price > 1000 && (
        <p className="text-xs text-muted-foreground">
          or ₹{Math.round(price / 3).toLocaleString()}/mo · 0% interest
        </p>
      )}

      {/* Stock status */}
      {!inStock && (
        <p className="text-sm text-destructive font-medium">Out of stock</p>
      )}

      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Quantity:</span>
        <div className="flex items-center gap-1 bg-muted rounded-full p-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1 || !inStock}
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= 10 || !inStock}
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className={cn(
            "flex-1 h-14 rounded-full",
            !inStock && "opacity-50 cursor-not-allowed"
          )}
          onClick={handleAddToCart}
          disabled={!inStock || isAdding}
        >
          <ShoppingCart className="size-5 mr-2" />
          {isAdding ? "Adding..." : "Add to cart"}
        </Button>
        {onWishlist && (
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-4 rounded-full"
            onClick={onWishlist}
            aria-label="Add to wishlist"
          >
            <Heart className="size-5" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default PriceCard;