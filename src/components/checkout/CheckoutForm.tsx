import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const checkoutSchema = z.object({
  shippingAddress: z.string().min(1, {
    message: "Shipping address is required",
  }),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmit: (shippingAddress: string) => Promise<void>;
}

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: "",
    },
  });

  function handleSubmit(values: CheckoutValues) {
    onSubmit(values.shippingAddress);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="shippingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your shipping address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Place Order
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default CheckoutForm;