"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Product } from "@/lib/schema";
import { useProductStore } from "@/store/product-store";
import { useCartStore } from "@/store/cart-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AddProductDialog } from "@/components/add-product-dialog";
import {
  ArrowUpDown,
  Trash2,
  ShoppingBag,
  Heart,
  Search,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";

interface ProductTableProps {
  statusFilter?: "ALL" | "ACTIVE" | "DRAFT";
}

export function ProductTable({ statusFilter = "ALL" }: ProductTableProps) {
  const { products, toggleStatus, deleteProduct } = useProductStore();
  const { addToCart, toggleWishlist } = useCartStore();

  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const filteredProducts = React.useMemo(() => {
    if (statusFilter === "ALL") return products;
    return products.filter((p) => p.status === statusFilter);
  }, [products, statusFilter]);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    toggleStatus(id);
    const nextStatus = currentStatus === "ACTIVE" ? "DRAFT" : "ACTIVE";
    toast.success(`Product status updated to ${nextStatus}`);
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-semibold"
        >
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.images[0] || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80"}
            alt={row.original.name}
            className="h-10 w-10 rounded-md object-cover border"
          />
          <div>
            <div className="font-medium text-sm">{row.original.name}</div>
            <div className="text-xs text-muted-foreground">{row.original.sku}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge>,
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-semibold"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-semibold text-emerald-600 dark:text-emerald-400">
          ${row.original.price.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const product = row.original;
        const isActive = product.status === "ACTIVE";

        return (
          <div
            className="flex items-center gap-2.5"
            onClick={(e) => e.stopPropagation()}
          >
            <Switch
              checked={isActive}
              onCheckedChange={() => handleToggleStatus(product.id!, product.status)}
            />
            <span
              className={`text-xs font-semibold ${
                isActive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {product.status}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div
            className="flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-blue-600 hover:text-blue-700 cursor-pointer"
              onClick={() => setEditingProduct(product)}
              title="Edit Product"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-rose-500 hover:text-rose-600 cursor-pointer"
              onClick={() => {
                toggleWishlist(product);
                toast.success(`Wishlist updated for ${product.name}`);
              }}
              title="Add to Wishlist"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-emerald-600 hover:text-emerald-700 cursor-pointer"
              onClick={() => {
                addToCart(product);
                toast.success(`${product.name} added to cart!`);
              }}
              title="Add to Cart"
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 cursor-pointer"
              onClick={() => {
                deleteProduct(product.id!);
                toast.error(`${product.name} removed from inventory`);
              }}
              title="Delete Product"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredProducts,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="space-y-4">
      {editingProduct && (
        <AddProductDialog
          productToEdit={editingProduct}
          isOpenExternal={!!editingProduct}
          onCloseExternal={() => setEditingProduct(null)}
        />
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-9"
          />
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          Showing {table.getRowModel().rows.length} of {filteredProducts.length} products
        </div>
      </div>

      <div className="rounded-lg border bg-card shadow-xs">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}