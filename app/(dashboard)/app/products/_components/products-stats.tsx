"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { Card, CardContent } from "@/components/ui/card";
import { Package, Layers, AlertTriangle, XCircle, TrendingUp, TrendingDown } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductsStatsProps {
  products: Product[];
}

export function ProductsStats({ products }: ProductsStatsProps) {
  const t = useTranslations('products.stats');

  const totalProducts = products.length;
  const uniqueCategories = new Set(products.map((p) => p.category)).size;
  const lowStockProducts = products.filter((p) => p.stockRemaining > 0 && p.stockRemaining <= 20).length;
  const outOfStockProducts = products.filter((p) => p.stockRemaining === 0).length;

  const stats = [
    {
      title: t('totalProducts'),
      value: totalProducts,
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
      trend: { value: 12, isPositive: true }, // Mock trend data
    },
    {
      title: t('categories'),
      value: uniqueCategories,
      icon: Layers,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10',
      trend: null,
    },
    {
      title: t('lowStock'),
      value: lowStockProducts,
      icon: AlertTriangle,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-500/10',
      trend: { value: 8, isPositive: false }, // Mock trend data
    },
    {
      title: t('outOfStock'),
      value: outOfStockProducts,
      icon: XCircle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-500/10',
      trend: { value: 3, isPositive: false }, // Mock trend data
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend?.isPositive ? TrendingUp : TrendingDown;

        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.05,
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={{
              y: -2,
              transition: { duration: 0.15 }
            }}
          >
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                      {stat.trend && (
                        <div className={`flex items-center gap-0.5 text-xs font-medium ${
                          stat.trend.isPositive
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          <TrendIcon className="h-3 w-3" />
                          <span>{stat.trend.value}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
