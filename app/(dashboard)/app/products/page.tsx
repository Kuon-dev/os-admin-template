"use client";

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Edit,
  Trash,
  X,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BAKERY_PRODUCTS } from '@/lib/constants';
import { ProductsStats } from './_components/products-stats';
import { ProductsFilters } from './_components/products-filters';
import { ProductsDataTable } from './_components/products-data-table';
import { ProductDialog, type ProductFormData } from './_components/product-dialog';
import type { Product, ProductCategory } from "@/types/product";

export default function ProductsPage() {
  const t = useTranslations('products');

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ProductCategory>('all');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock' | 'date'>('date');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogProduct, setDeleteDialogProduct] = useState<Product | null>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // Load initial products
  useEffect(() => {
    setProducts(BAKERY_PRODUCTS);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + N - New Product
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        handleCreateNew();
      }

      // Cmd/Ctrl + K - Focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // Escape - Clear search if focused
      if (e.key === 'Escape') {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput && document.activeElement === searchInput) {
          setSearchQuery('');
          searchInput.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => {
          const ingredients = Array.isArray(p.ingredients)
            ? p.ingredients.join(' ').toLowerCase()
            : p.ingredients?.toLowerCase() || '';

          return (
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            ingredients.includes(query)
          );
        }
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'stock':
          return b.stockRemaining - a.stockRemaining;
        case 'date':
        default:
          // Mock date sorting - in real app, would use actual dates
          return 0;
      }
    });

    return filtered;
  }, [products, searchQuery, categoryFilter, sortBy]);

  // CRUD Operations
  const handleCreateNew = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setDeleteDialogProduct(product);
  };

  const confirmDelete = () => {
    if (!deleteDialogProduct) return;

    setProducts(products.filter((p) => p.id !== deleteDialogProduct.id));
    toast.success(t('messages.deleteSuccess'));
    setDeleteDialogProduct(null);
  };

  const handleSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      // Update existing product
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...data,
                image: data.image || undefined,
                ingredients: data.ingredients || undefined,
                allergens: data.allergens || undefined,
              }
            : p
        )
      );
      toast.success(t('messages.updateSuccess'));
    } else {
      // Create new product
      const newProduct: Product = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        image: data.image || undefined,
        ingredients: data.ingredients || undefined,
        allergens: data.allergens || undefined,
      };
      setProducts([newProduct, ...products]);
      toast.success(t('messages.createSuccess'));
    }

    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setSortBy('date');
  };

  const handleSelectionChange = (count: number, products: Product[]) => {
    setSelectedCount(count);
    setSelectedProducts(products);
  };

  const handleBulkDelete = () => {
    setProducts(products.filter(p => !selectedProducts.find(sp => sp.id === p.id)));
    toast.success(`Deleted ${selectedCount} product${selectedCount > 1 ? 's' : ''}`);
    setSelectedCount(0);
    setSelectedProducts([]);
  };

  const hasActiveFilters = searchQuery !== '' || categoryFilter !== 'all';

  return (
    <div className="mx-auto w-full max-w-5xl relative">
      {/* Bulk Actions Banner - Toast-like overlay */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
          >
            <div className="bg-background border border-border rounded-lg px-4 py-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {selectedCount} {selectedCount === 1 ? 'product' : 'products'} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 px-3 text-xs"
                  >
                    <Edit className="mr-1.5 h-3 w-3" />
                    Bulk Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={handleBulkDelete}
                  >
                    <Trash className="mr-1.5 h-3 w-3" />
                    Delete Selected
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 ml-2"
                    onClick={() => {
                      setSelectedCount(0);
                      setSelectedProducts([]);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="flex flex-col gap-3 pb-4 border-b border-border"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {t('title')}
              </h1>
              <p className="text-sm text-muted-foreground/80 max-w-2xl">
                {t('description')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <kbd className="hidden lg:inline-flex h-8 items-center gap-1 rounded border border-border bg-muted px-2 text-[10px] font-medium text-muted-foreground">
                <span>⌘N</span>
              </kbd>

              <Button
                onClick={handleCreateNew}
                size="default"
                className="h-9 px-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('newProduct')}
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Stats */}
        <ProductsStats products={products} />

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-10 pr-14 text-sm"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 text-[9px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <ProductsFilters
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <ProductsDataTable
            data={filteredAndSortedProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreateNew={handleCreateNew}
            onSelectionChange={handleSelectionChange}
          />
        </motion.div>
      </div>

      {/* Product Dialog (Create/Edit) */}
      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={editingProduct}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteDialogProduct}
        onOpenChange={(open) => !open && setDeleteDialogProduct(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteConfirm.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialogProduct &&
                t('deleteConfirm.description', { name: deleteDialogProduct.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('deleteConfirm.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('deleteConfirm.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
