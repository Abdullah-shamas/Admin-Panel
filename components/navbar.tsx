"use client";

import * as React from "react";
import { ShoppingBag, Heart, Store } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { CartWishlistModal } from "@/components/cart-wishlist-modal";

export function Navbar() {
  const { cart, wishlist } = useCartStore();
  const [mounted, setMounted] = React.useState(false);
  const [activeModal, setActiveModal] = React.useState<"cart" | "wishlist" | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background shadow-xs">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-lg">Nexus Studio</span>
              <Badge variant="outline" className="ml-2 text-[10px] py-0 px-1.5">
                Admin v1.0
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Wishlist Button with Modal Trigger */}
            <button
              type="button"
              onClick={() => setActiveModal("wishlist")}
              className="relative inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium bg-background hover:bg-muted transition-colors cursor-pointer"
            >
              <Heart className="h-4 w-4 text-rose-500" />
              <span>Wishlist</span>
              <Badge variant="secondary" className="h-5 px-1.5 text-[11px] ml-1">
                {mounted ? wishlist.length : 0}
              </Badge>
            </button>

            {/* Cart Button with Modal Trigger */}
            <button
              type="button"
              onClick={() => setActiveModal("cart")}
              className="relative inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium bg-background hover:bg-muted transition-colors cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4 text-emerald-600" />
              <span>Cart</span>
              <Badge variant="secondary" className="h-5 px-1.5 text-[11px] ml-1">
                {mounted ? totalCartCount : 0}
              </Badge>
            </button>

            <div className="border-l pl-2 ml-1">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Modal */}
      <CartWishlistModal
        type={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
}