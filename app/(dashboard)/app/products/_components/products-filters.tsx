"use client";

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { ProductCategory } from "@/types/product";

interface ProductsFiltersProps {
  categoryFilter: 'all' | ProductCategory;
  onCategoryChange: (category: 'all' | ProductCategory) => void;
  sortBy: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock' | 'date';
  onSortChange: (sort: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock' | 'date') => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function ProductsFilters({
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
}: ProductsFiltersProps) {
  const t = useTranslations('products.filters');

  const categories: Array<{ value: 'all' | ProductCategory; label: string }> = [
    { value: 'all', label: t('all') },
    { value: 'breads', label: t('breads') },
    { value: 'pastries', label: t('pastries') },
    { value: 'viennoiseries', label: t('viennoiseries') },
    { value: 'cakes', label: t('cakes') },
    { value: 'specials', label: t('specials') },
  ];

  const sortOptions = [
    { value: 'name-asc', label: t('sortNameAsc') },
    { value: 'name-desc', label: t('sortNameDesc') },
    { value: 'price-asc', label: t('sortPriceAsc') },
    { value: 'price-desc', label: t('sortPriceDesc') },
    { value: 'stock', label: t('sortStock') },
    { value: 'date', label: t('sortDate') },
  ] as const;

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      {/* Category Tabs */}
      <Tabs value={categoryFilter} onValueChange={(v) => onCategoryChange(v as any)}>
        <TabsList className="h-9 p-0.5">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat.value}
              value={cat.value}
              className="text-xs px-3 h-8 data-[state=active]:shadow-sm transition-all duration-200"
            >
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Sort & Clear */}
      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 10 }}
              transition={{
                duration: 0.2,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-9 px-3 text-xs"
              >
                <X className="mr-1.5 h-3 w-3" />
                {t('clearFilters')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {t('sortBy')}:
          </span>
          <Select value={sortBy} onValueChange={(v) => onSortChange(v as any)}>
            <SelectTrigger className="h-9 w-[160px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-xs">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
