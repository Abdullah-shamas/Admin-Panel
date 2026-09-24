import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/schema";

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Noise-Cancelling Studio Headphones",
    category: "Electronics",
    description: "High-fidelity wireless sound with adaptive ANC.",
    sku: "AUD-HD-002",
    price: 349.99,
    costPrice: 210,
    taxRate: 5,
    discount: 10,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"],
    status: "ACTIVE",
  },
  {
    id: "prod-2",
    name: "Minimalist Leather Backpack",
    category: "Accessories",
    description: "Full-grain waterproof travel backpack.",
    sku: "BAG-LTH-003",
    price: 129.5,
    costPrice: 65,
    taxRate: 8,
    discount: 0,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"],
    status: "DRAFT",
  },
];

export interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
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
              id: product.id || "prod-" + Math.floor(1000 + Math.random() * 9000),
            },
            ...state.products,
          ],
        })),
      updateProduct: (id, updated) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updated } : p
          ),
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
      name: "nexus-product-storage",
    }
  )
);