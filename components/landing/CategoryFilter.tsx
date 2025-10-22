'use client';

import { motion } from 'motion/react';
import { Category, CategoryInfo } from '@/types/product';
import { categories } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { duration, ease } from '@/lib/animations';

interface CategoryFilterProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="bg-flour border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto scrollbar-hide py-6">
          {categories.map((category) => (
            <CategoryTab
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onClick={() => onCategoryChange(category.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface CategoryTabProps {
  category: CategoryInfo;
  isSelected: boolean;
  onClick: () => void;
}

function CategoryTab({ category, isSelected, onClick }: CategoryTabProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'relative px-6 py-3 rounded-full font-medium text-sm whitespace-nowrap transition-colors',
        isSelected
          ? 'text-espresso'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      <span className="flex items-center gap-2">
        {category.icon && <span className="text-lg">{category.icon}</span>}
        <span>{category.name}</span>
      </span>

      {/* Animated background */}
      {isSelected && (
        <motion.div
          layoutId="category-indicator"
          className="absolute inset-0 bg-croissant rounded-full -z-10"
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 30,
          }}
        />
      )}
    </motion.button>
  );
}
