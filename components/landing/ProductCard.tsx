'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Product } from '@/types/product';
import { cardHover, duration } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { Clock, Flame } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickAdd?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export function ProductCard({
  product,
  onQuickAdd,
  onViewDetails,
}: ProductCardProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={cardHover}
      transition={{ duration: duration.normal / 1000 }}
      className="group relative overflow-hidden rounded-lg bg-card shadow-sm cursor-pointer"
      onClick={() => onViewDetails?.(product)}
    >
      {/* Tags */}
      <div className="absolute top-3 left-3 z-10 flex gap-2 flex-col">
        <div className="flex gap-2">
          {product.isNew && (
            <span className="px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full">
              New
            </span>
          )}
          {product.isSpecial && (
            <span className="px-2 py-1 text-xs font-medium bg-croissant text-espresso rounded-full">
              Special
            </span>
          )}
        </div>
        {product.bakedToday && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-croissant/90 text-espresso rounded-full backdrop-blur-sm">
            <Clock className="w-3 h-3" />
            Baked Today
          </span>
        )}
        {product.limitedQuantity && product.stockRemaining && product.stockRemaining <= 10 && (
          <motion.span
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full"
          >
            <Flame className="w-3 h-3" />
            Only {product.stockRemaining} left!
          </motion.span>
        )}
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-warm-beige">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick Add Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-flour text-espresso rounded-full text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onQuickAdd?.(product);
          }}
        >
          Quick Add
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
            {product.name}
          </h3>
          <span className="text-lg font-bold text-croissant whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Dietary Tags */}
        {product.dietaryTags && product.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.dietaryTags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "px-2 py-0.5 text-xs rounded-full",
                  tag === 'vegan' && "bg-sage/20 text-sage",
                  tag === 'vegetarian' && "bg-sage/20 text-sage",
                  tag === 'gluten-free' && "bg-butter/30 text-espresso",
                  tag === 'dairy-free' && "bg-butter/30 text-espresso"
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
