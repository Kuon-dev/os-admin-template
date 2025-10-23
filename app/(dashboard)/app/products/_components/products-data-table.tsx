"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpDown,
  Package,
  Edit,
  Trash,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StockBadge } from './stock-badge';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductsDataTableProps {
  data: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onCreateNew: () => void;
  onSelectionChange?: (selectedCount: number, selectedProducts: Product[]) => void;
}

export function ProductsDataTable({
  data,
  onEdit,
  onDelete,
  onCreateNew,
  onSelectionChange,
}: ProductsDataTableProps) {
  const t = useTranslations('products');
  const tableT = useTranslations('products.table');
  const badgeT = useTranslations('products.badges');

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "image",
      header: tableT('image'),
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="relative h-10 w-10 overflow-hidden rounded-md flex-shrink-0">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <Package className="h-5 w-5 text-muted-foreground/50" />
              </div>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 h-auto py-2 hover:bg-muted/50"
          >
            {tableT('name')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex flex-col gap-1.5 min-w-[180px]">
            <div className="font-medium text-sm">{product.name}</div>
            <div className="flex gap-1 flex-wrap">
              {product.isNew && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-blue-500/10 text-blue-700 dark:text-blue-400">
                  {badgeT('new')}
                </Badge>
              )}
              {product.isSpecial && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-purple-500/10 text-purple-700 dark:text-purple-400">
                  {badgeT('special')}
                </Badge>
              )}
              {product.limitedQuantity && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-orange-500/10 text-orange-700 dark:text-orange-400">
                  {badgeT('limited')}
                </Badge>
              )}
              {product.bakedToday && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-green-500/10 text-green-700 dark:text-green-400">
                  {badgeT('bakedToday')}
                </Badge>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: tableT('category'),
      cell: ({ row }) => {
        const product = row.original;
        const category = PRODUCT_CATEGORIES.find(c => c.id === product.category);
        const CategoryIcon = category?.icon;
        return (
          <div className="flex items-center gap-2">
            {CategoryIcon && <CategoryIcon className="h-4 w-4 text-muted-foreground" />}
            <span className="capitalize">{category?.name || product.category}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 h-auto py-2 hover:bg-muted/50"
          >
            {tableT('price')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="font-medium text-sm">{formatted}</div>;
      },
    },
    {
      accessorKey: "stockRemaining",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 h-auto py-2 hover:bg-muted/50"
          >
            {tableT('stock')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const stock = row.getValue("stockRemaining") as number;
        return <StockBadge stock={stock} />;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Edit className="mr-2 h-4 w-4" />
                {t('actions.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(product)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                {t('actions.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  // Notify parent of selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      const selectedProducts = selectedRows.map(row => row.original);
      onSelectionChange(selectedRows.length, selectedProducts);
    }
  }, [rowSelection]);

  // Empty state
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 px-4">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Package className="h-12 w-12 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {t('noProductsFound')}
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
            {t('noProducts')}
          </p>
          <Button onClick={onCreateNew} className="h-9">
            <Package className="mr-2 h-4 w-4" />
            {t('createFirstProduct')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent border-b">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="h-10 font-medium text-[11px] uppercase tracking-wide text-muted-foreground"
                      >
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
                <AnimatePresence mode="popLayout">
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row, index) => (
                      <motion.tr
                        key={row.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{
                          layout: { duration: 0.15 },
                          opacity: { duration: 0.15 },
                          x: { duration: 0.15, delay: index * 0.01 }
                        }}
                        className={cn(
                          "group h-14 transition-colors duration-100 border-b",
                          "hover:bg-muted/30",
                          row.getIsSelected() && "bg-primary/5"
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="py-2"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-64 text-center"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
                          <p className="text-muted-foreground">{t('noProductsFound')}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
        <div className="text-xs text-muted-foreground">
          Showing{" "}
          <strong className="font-medium text-foreground">
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          </strong>{" "}
          to{" "}
          <strong className="font-medium text-foreground">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </strong>{" "}
          of{" "}
          <strong className="font-medium text-foreground">
            {table.getFilteredRowModel().rows.length}
          </strong>{" "}
          products
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 px-3 text-xs"
          >
            Previous
          </Button>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: Math.min(table.getPageCount(), 5) }, (_, i) => {
              const currentPage = table.getState().pagination.pageIndex;
              let pageNumber = i;

              // Show pages around current page
              if (table.getPageCount() > 5) {
                if (currentPage < 3) {
                  pageNumber = i;
                } else if (currentPage > table.getPageCount() - 3) {
                  pageNumber = table.getPageCount() - 5 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
              }

              return (
                <Button
                  key={pageNumber}
                  variant={table.getState().pagination.pageIndex === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => table.setPageIndex(pageNumber)}
                  className="h-8 w-8 p-0 text-xs"
                >
                  {pageNumber + 1}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 px-3 text-xs"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
