"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import Image from 'next/image';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Leaf, Sprout, Wheat, Milk, Nut, Sparkles } from "lucide-react";
import { StockBadge } from './stock-badge';
import { ProductActions } from './product-actions';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import type { Product } from "@/types/product";

interface ProductRowProps {
  product: Product;
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const dietaryIcons = {
  vegan: Leaf,
  vegetarian: Sprout,
  'gluten-free': Wheat,
  'dairy-free': Milk,
  'nut-free': Nut,
  organic: Sparkles,
} as const;

export function ProductRow({ product, index, onEdit, onDelete }: ProductRowProps) {
  const t = useTranslations('products');
  const badgeT = useTranslations('products.badges');
  const dietaryT = useTranslations('products.dietaryTags');

  const category = PRODUCT_CATEGORIES.find(c => c.id === product.category);
  const CategoryIcon = category?.icon;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group hover:bg-muted/50 transition-colors"
    >
      {/* Image */}
      <TableCell>
        <div className="relative h-12 w-12 overflow-hidden rounded-md">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      </TableCell>

      {/* Name with badges */}
      <TableCell>
        <div className="flex flex-col gap-1.5">
          <div className="font-medium">{product.name}</div>
          <div className="flex gap-1 flex-wrap">
            {product.isNew && (
              <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-400">
                {badgeT('new')}
              </Badge>
            )}
            {product.isSpecial && (
              <Badge variant="secondary" className="text-xs bg-purple-500/10 text-purple-700 dark:text-purple-400">
                {badgeT('special')}
              </Badge>
            )}
            {product.limitedQuantity && (
              <Badge variant="secondary" className="text-xs bg-orange-500/10 text-orange-700 dark:text-orange-400">
                {badgeT('limited')}
              </Badge>
            )}
            {product.bakedToday && (
              <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400">
                {badgeT('bakedToday')}
              </Badge>
            )}
          </div>
        </div>
      </TableCell>

      {/* Category */}
      <TableCell>
        <div className="flex items-center gap-2">
          {CategoryIcon && <CategoryIcon className="h-4 w-4 text-muted-foreground" />}
          <span className="capitalize">{category?.name || product.category}</span>
        </div>
      </TableCell>

      {/* Price */}
      <TableCell className="font-medium">
        ${product.price.toFixed(2)}
      </TableCell>

      {/* Stock */}
      <TableCell>
        <StockBadge stock={product.stockRemaining} />
      </TableCell>

      {/* Dietary Tags */}
      <TableCell>
        <div className="flex gap-1">
          <TooltipProvider>
            {product.dietaryTags.slice(0, 3).map((tag) => {
              const Icon = dietaryIcons[tag as keyof typeof dietaryIcons];
              if (!Icon) return null;

              // Convert kebab-case to camelCase for i18n key (gluten-free -> glutenFree)
              const i18nKey = tag.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

              return (
                <Tooltip key={tag}>
                  <TooltipTrigger>
                    <div className="p-1.5 rounded bg-green-500/10 text-green-700 dark:text-green-400">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize">{dietaryT(i18nKey as any)}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
            {product.dietaryTags.length > 3 && (
              <Tooltip>
                <TooltipTrigger>
                  <div className="p-1.5 rounded bg-muted text-muted-foreground text-xs font-medium flex items-center justify-center min-w-[24px]">
                    +{product.dietaryTags.length - 3}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-col gap-1">
                    {product.dietaryTags.slice(3).map(tag => {
                      // Convert kebab-case to camelCase for i18n key
                      const i18nKey = tag.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                      return (
                        <p key={tag} className="capitalize">
                          {dietaryT(i18nKey as any)}
                        </p>
                      );
                    })}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <ProductActions
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </motion.tr>
  );
}

// Fix import
import { Package } from "lucide-react";
