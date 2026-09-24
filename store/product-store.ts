import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/schema";

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "MacBook Pro M3 Max",
    category: "Electronics",
    description: "High-performance laptop for developers and creatives.",
    sku: "LAP-MAC-001",
    price: 2499.0,
    costPrice: 1900.0,
    discount: 5,
    taxRate: 8,
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80"],
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Noise-Cancelling Studio Headphones",
    category: "Electronics",
    description: "Premium over-ear wireless audio with active noise cancellation.",
    sku: "AUD-HD-002",
    price: 349.99,
    costPrice: 180.0,
    discount: 10,
    taxRate: 5,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"],
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Minimalist Leather Backpack",
    category: "Accessories",
    description: "Handcrafted water-resistant leather backpack with laptop sleeve.",
    sku: "BAG-LTH-003",
    price: 129.5,
    costPrice: 65.0,
    discount: 0,
    taxRate: 5,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"],
    status: "DRAFT",
    createdAt: new Date().toISOString(),
  },
];

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleStatus: (id: string) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: INITIAL_PRODUCTS,
      addProduct: (product) =>
        set((state) => ({
          products: [
            {
              ...product,
              id: `prod-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
            ...state.products,
          ],
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      toggleStatus: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? { ...p, status: p.status === "ACTIVE" ? "DRAFT" : "ACTIVE" }
              : p
          ),
        })),
    }),
    {
      name: "nexus-admin-products",
    }
  )
);