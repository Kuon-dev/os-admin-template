'use client';

import { motion } from 'motion/react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { staggerContainer, slideUp } from '@/lib/animations';

interface ProductGridProps {
  products: Product[];
  onQuickAdd?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export function ProductGrid({
  products,
  onQuickAdd,
  onViewDetails,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-muted-foreground">
          No products found in this category.
        </p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          key={products.map(p => p.id).join('-')}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={slideUp}>
              <ProductCard
                product={product}
                onQuickAdd={onQuickAdd}
                onViewDetails={onViewDetails}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
