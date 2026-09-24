"use client";

import * as React from "react";
import { useCartStore } from "@/store/cart-store";
import { X, Trash2, ShoppingBag, Heart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartWishlistModalProps {
  type: "cart" | "wishlist" | null;
  onClose: () => void;
}

export function CartWishlistModal({ type, onClose }: CartWishlistModalProps) {
  const { cart, wishlist, removeFromCart, updateQuantity, toggleWishlist, addToCart } =
    useCartStore();

  if (!type) return null;

  const isCart = type === "cart";
  const items = isCart ? cart : wishlist;
  const totalPrice = isCart
    ? cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-card border text-card-foreground shadow-2xl rounded-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            {isCart ? (
              <ShoppingBag className="h-5 w-5 text-emerald-600" />
            ) : (
              <Heart className="h-5 w-5 text-rose-500" />
            )}
            <h2 className="text-xl font-bold tracking-tight">
              {isCart ? "Shopping Cart" : "Wishlist Items"}
            </h2>
            <span className="text-xs text-muted-foreground ml-1">
              ({items.length} {items.length === 1 ? "item" : "items"})
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Product Items List */}
        <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
          {items.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              {isCart ? (
                <ShoppingBag className="h-10 w-10 mx-auto opacity-30" />
              ) : (
                <Heart className="h-10 w-10 mx-auto opacity-30" />
              )}
              <p className="text-sm font-medium">
                Your {isCart ? "cart" : "wishlist"} is empty!
              </p>
              <p className="text-xs">Add items from the catalog table below.</p>
            </div>
          ) : (
            items.map((item: any, idx: number) => {
              const itemId = item.id || item.sku || String(idx);
              const currentQty = item.quantity || 1;

              return (
                <div
                  key={itemId}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border bg-muted/20"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        item.images?.[0] ||
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80"
                      }
                      alt={item.name}
                      className="h-14 w-14 object-cover rounded-lg border shrink-0"
                    />
                    <div className="space-y-0.5">
                      <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.category} • {item.sku}
                      </p>
                      <p className="text-sm font-bold text-emerald-600">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCart ? (
                      <div className="flex items-center border rounded-lg bg-background">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(itemId, Math.max(1, currentQty - 1));
                          }}
                          className="p-1 hover:bg-muted rounded-l cursor-pointer"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-2 text-xs font-semibold">{currentQty}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(itemId, currentQty + 1);
                          }}
                          className="p-1 hover:bg-muted rounded-r cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1.5 h-8 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                          toggleWishlist(item);
                        }}
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Move
                      </Button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCart) {
                          removeFromCart(itemId);
                        } else {
                          toggleWishlist(item);
                        }
                      }}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {isCart && items.length > 0 && (
          <div className="border-t pt-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Subtotal</p>
              <p className="text-lg font-bold">${totalPrice.toFixed(2)}</p>
            </div>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}