import { CartItem as CartItemType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => Promise<void>;
  onRemove: (productId: string) => Promise<void>;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleQuantityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value, 10);
    const maxStock = item.product.stock ?? 999;
    if (quantity > 0 && quantity <= maxStock) {
      await onUpdateQuantity(item.product.id, quantity);
    }
  };

  const handleRemove = async () => {
    await onRemove(item.product.id);
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="font-medium">{item.product.name}</h3>
            <p className="text-sm text-muted-foreground">
              ${item.product.price.toFixed(2)}
            </p>
          </div>
          <Input
            type="number"
            min="1"
            max={item.product.stock ?? 999}
            value={item.quantity}
            onChange={handleQuantityChange}
            className="w-20"
          />
        </div>
        <Button variant="destructive" size="icon" onClick={handleRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default CartItem;