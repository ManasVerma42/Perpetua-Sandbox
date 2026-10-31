import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/components/store/use-cart";
import { useAuth } from "@/lib/local-auth";
import { createOrderFromCart } from "@/lib/orders";
import { toast } from "@/hooks/use-toast";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { OrderSummaryCard } from "@/components/checkout/OrderSummaryCard";
import { ShippingValues } from "@/lib/validators/shipping-schema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lines, clear } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lines.length === 0) {
      navigate("/shop");
    }
  }, [lines.length, navigate]);

  async function onSubmit(values: ShippingValues) {
    if (!user?.email) {
      toast({
        title: "Authentication required",
        description: "Please log in to complete your order.",
        variant: "destructive",
      });
      return;
    }

    if (lines.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const cartItems = lines.map((line) => ({
        product: {
          id: line.item.id,
          name: line.item.name,
          price: line.item.price,
        },
        quantity: line.quantity,
      }));

      const shippingAddress = {
        fullName: values.fullName,
        addressLine1: values.address,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
        country: "United States",
        phone: values.phone,
      };

      const order = createOrderFromCart(user.id, cartItems, shippingAddress);

      clear();

      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!",
      });

      navigate("/order-confirmation", {
        state: { orderId: order.id },
        replace: true,
      });
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-semibold tracking-tight mb-8 text-center">
          Checkout
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <ShippingForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <OrderSummaryCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;