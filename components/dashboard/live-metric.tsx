'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import NumberFlow from '@number-flow/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveMetricProps {
  label: string;
  value: number;
  icon?: LucideIcon;
  updateInterval?: number; // in ms
  variance?: number; // percentage variance for live updates
  prefix?: string;
  suffix?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  decimals?: number;
}

const colorConfig = {
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-green-600 dark:text-green-400',
  purple: 'text-purple-600 dark:text-purple-400',
  orange: 'text-orange-600 dark:text-orange-400',
  red: 'text-red-600 dark:text-red-400',
  pink: 'text-pink-600 dark:text-pink-400',
};

const sizeConfig = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl',
};

export function LiveMetric({
  label,
  value: initialValue,
  icon: Icon,
  updateInterval = 3000,
  variance = 5,
  prefix = '',
  suffix = '',
  color = 'blue',
  size = 'md',
  decimals = 0,
}: LiveMetricProps) {
  const [value, setValue] = useState(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      // Simulate live data updates with variance
      const change = (Math.random() - 0.5) * 2 * (variance / 100) * initialValue;
      setValue((prev) => Math.max(0, prev + change));

      setTimeout(() => setIsUpdating(false), 300);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [initialValue, variance, updateInterval]);

  return (
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="relative">
          <Icon className={cn('h-5 w-5', colorConfig[color])} />
          {isUpdating && (
            <motion.div
              className={cn(
                'absolute inset-0 rounded-full',
                colorConfig[color]
              )}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>
      )}
      <div>
        <div className={cn('font-bold tabular-nums', sizeConfig[size])}>
          {prefix}
          <NumberFlow
            value={value}
            format={{
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            }}
          />
          {suffix}
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
