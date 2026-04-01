import * as z from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  short_description: z.string().min(5, "Short description must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  stock_quantity: z.coerce.number().int().min(0, "Stock must be at least 0"),
  category_id: z.string().uuid("Please select a valid category"),
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(true),
  features: z.array(z.string()).default([]),
  specs: z.record(z.string(), z.any()).default({}),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export type ProductFormValues = {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: string;
  is_featured: boolean;
  is_new: boolean;
  features: string[];
  specs: Record<string, any>;
};

export const checkoutSchema = z.object({
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(5, "Required"),
  city: z.string().min(2, "Required"),
  zip: z.string().min(5, "Required"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
