"use client";

import * as React from "react";
import { Navbar } from "@/components/navbar";
import { ProductTable } from "@/components/product-table";
import { AddProductDialog } from "@/components/add-product-dialog";
import { useProductStore } from "@/store/product-store";
import { Package, CheckCircle, DollarSign, Layers } from "lucide-react";

export default function DashboardPage() {
  const { products } = useProductStore();
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "ACTIVE" | "DRAFT">("ALL");

  const totalProducts = products.length;
  const activeCount = products.filter((p) => p.status === "ACTIVE").length;
  const draftCount = products.filter((p) => p.status === "DRAFT").length;
  const catalogWorth = products.reduce((acc, p) => acc + (p.price || 0), 0);

  // Toggle filter on card click: agar dobara click karein toh filter wapis "ALL" ho jaye
  const handleCardClick = (type: "ACTIVE" | "DRAFT") => {
    setStatusFilter((prev) => (prev === type ? "ALL" : type));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-8 py-8 max-w-7xl space-y-8">
        {/* Title & Add Product Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Product Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage, curate and monitor your catalog with real-time status updates.
            </p>
          </div>
          <AddProductDialog />
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Products */}
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer shadow-xs hover:shadow-md ${
              statusFilter === "ALL"
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "bg-card hover:bg-muted/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Products
              </span>
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-black mt-2 tracking-tight">{totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">Items cataloged in store</p>
          </button>

          {/* 2. Active Listings */}
          <button
            type="button"
            onClick={() => handleCardClick("ACTIVE")}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer shadow-xs hover:shadow-md ${
              statusFilter === "ACTIVE"
                ? "border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                : "bg-card hover:bg-muted/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Active Listings
              </span>
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black mt-2 tracking-tight text-emerald-600">
              {activeCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {statusFilter === "ACTIVE" ? "Click to view all" : "Filter active listings"}
            </p>
          </button>

          {/* 3. Draft Items */}
          <button
            type="button"
            onClick={() => handleCardClick("DRAFT")}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer shadow-xs hover:shadow-md ${
              statusFilter === "DRAFT"
                ? "border-amber-600 bg-amber-500/10 ring-2 ring-amber-500/20"
                : "bg-card hover:bg-muted/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Draft Items
              </span>
              <Layers className="h-5 w-5 text-amber-600" />
            </div>
            <div className="text-3xl font-black mt-2 tracking-tight text-amber-600">
              {draftCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {statusFilter === "DRAFT" ? "Click to view all" : "Filter draft items"}
            </p>
          </button>

          {/* 4. Catalog Worth */}
          <div className="p-5 rounded-2xl border bg-card text-left shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Catalog Worth
              </span>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-black mt-2 tracking-tight">
              ${catalogWorth.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Combined unit valuation</p>
          </div>
        </div>

        {/* Catalog Inventory Section */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Catalog Inventory</h2>
              {statusFilter !== "ALL" ? (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Showing <span className="font-semibold text-foreground">{statusFilter}</span> items. (Click{" "}
                  <button
                    onClick={() => setStatusFilter("ALL")}
                    className="text-primary underline font-medium cursor-pointer"
                  >
                    View All
                  </button>{" "}
                  to show complete inventory)
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Showing all products in catalog
                </p>
              )}
            </div>
          </div>

          <ProductTable statusFilter={statusFilter} />
        </section>
      </main>
    </div>
  );
}