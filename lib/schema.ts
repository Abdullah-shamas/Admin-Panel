import { z } from "zod";

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  category: z.enum(["Electronics", "Clothing", "Home", "Accessories"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  sku: z.string().min(3, "SKU is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  costPrice: z.coerce.number().positive("Cost price must be greater than 0"),
  taxRate: z.coerce.number().min(0),
  discount: z.coerce.number().min(0),
  images: z.array(z.string()).min(1, "At least one image is required"),
  status: z.enum(["ACTIVE", "DRAFT"]),
  createdAt: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;