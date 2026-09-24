import { z } from "zod";

export const productSchema = z.object({
  id: z.string().optional(),
  // Step 1: Details
  name: z.string().min(3, "Product name must be at least 3 characters long"),
  category: z.enum(["Electronics", "Clothing", "Home", "Accessories"]),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),

  // Step 2: Pricing (Numeric validations)
  price: z.coerce.number().positive("Price must be greater than 0"),
  costPrice: z.coerce.number().positive("Cost price must be greater than 0"),
  discount: z.coerce.number().min(0, "Discount cannot be negative").max(100, "Max discount is 100%").default(0),
  taxRate: z.coerce.number().min(0, "Tax cannot be negative").default(5),

  // Step 3: Images
  images: z.array(z.string().url("Must be a valid image URL")).min(1, "At least one image is required"),

  // Metadata
  status: z.enum(["ACTIVE", "DRAFT"]).default("ACTIVE"),
  createdAt: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;