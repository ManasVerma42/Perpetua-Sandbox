import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/store/use-cart";
import { toStoreItem } from "@/lib/store-item";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { add } = useCart();

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      add(toStoreItem(product));
    }
  };

  // Get the first tag to display as a pill
  const tagPill = product.tags?.[0];

  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        {tagPill && (
          <Badge 
            variant="secondary" 
            className="absolute top-3 left-3 rounded-full text-xs"
          >
            {tagPill}
          </Badge>
        )}
        {product.category && (
          <Badge 
            variant="outline" 
            className="absolute top-3 right-3 rounded-full text-xs bg-background/80"
          >
            {product.category}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
          
          {/* Color dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5">
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="size-3 rounded-full border border-muted"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          
          <Button
            onClick={handleAddToCart}
            className="w-full rounded-full"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;