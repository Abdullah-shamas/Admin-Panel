import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/schema";

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      addToCart: (product) =>
        set((state) => {
          const id = product.id!;
          const existingItem = state.cart.find((item) => item.id === id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart:
            quantity <= 0
              ? state.cart.filter((item) => item.id !== productId)
              : state.cart.map((item) =>
                  item.id === productId ? { ...item, quantity } : item
                ),
        })),
      toggleWishlist: (product) =>
        set((state) => {
          const id = product.id!;
          const exists = state.wishlist.some((item) => item.id === id);
          return {
            wishlist: exists
              ? state.wishlist.filter((item) => item.id !== id)
              : [...state.wishlist, product],
          };
        }),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "nexus-cart-storage",
    }
  )
);