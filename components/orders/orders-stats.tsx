'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { ShoppingCart, Clock, Truck, DollarSign } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Order } from '@/types/order';
import { calculateOrderStats } from '@/lib/mock-data/orders';

interface OrdersStatsProps {
  orders: Order[];
}

// Animated counter component
function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const spring = useSpring(0, { stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    spring.set(value);
    const unsubscribe = display.on('change', (latest) => setDisplayValue(latest));
    return () => unsubscribe();
  }, [value, spring, display]);

  return <span>{prefix}{displayValue}{suffix}</span>;
}

const statVariants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      delay: custom * 0.05,
    },
  }),
};

export function OrdersStats({ orders }: OrdersStatsProps) {
  const stats = calculateOrderStats(orders);

  const statsData = [
    {
      icon: ShoppingCart,
      label: 'Total Orders',
      value: stats.total,
      detail: `${stats.pending} pending, ${stats.processing} processing`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      icon: Clock,
      label: 'Pending',
      value: stats.pending,
      detail: 'Orders awaiting confirmation',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-500/10',
    },
    {
      icon: Truck,
      label: 'In Transit',
      value: stats.shipped,
      detail: `${stats.delivered} delivered this period`,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-500/10',
    },
    {
      icon: DollarSign,
      label: 'Revenue',
      value: Math.round(stats.totalRevenue / 1000),
      prefix: '$',
      suffix: 'K',
      detail: `Avg order: $${stats.averageOrderValue.toFixed(0)}`,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <TooltipProvider key={stat.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  custom={index}
                  variants={statVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{
                    scale: 1.02,
                    transition: { type: 'spring', stiffness: 400, damping: 17 },
                  }}
                  className="group relative overflow-hidden rounded-lg border bg-card p-4 transition-shadow hover:shadow-md cursor-help"
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/20 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="relative flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground">
                        {stat.label}
                      </span>
                      <span className="text-2xl font-bold tabular-nums">
                        <AnimatedCounter
                          value={stat.value}
                          prefix={stat.prefix}
                          suffix={stat.suffix}
                        />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[200px]">
                <p className="text-xs">{stat.detail}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}
