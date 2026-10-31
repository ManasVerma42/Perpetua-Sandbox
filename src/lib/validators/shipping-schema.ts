import { z } from "zod";

export const shippingSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State/Province is required" }),
  postalCode: z.string().min(1, { message: "Postal code is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }).regex(/^[\d\s\-+()]+$/, { message: "Invalid phone number" }),
});

export type ShippingValues = z.infer<typeof shippingSchema>;

export default shippingSchema;