'use client';

import { useEffect, useState } from 'react';
import { motion, animate, useMotionValue } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import NumberFlow from '@number-flow/react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface QuickStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  tooltip?: string;
  onClick?: () => void;
}

const colorConfig = {
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  green: 'bg-green-500/10 text-green-600 dark:text-green-400',
  purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

export function QuickStatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
  color = 'blue',
  tooltip,
  onClick,
}: QuickStatCardProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Extract numeric value if it's a string with numbers
  const extractNumber = (val: string | number): number | null => {
    if (typeof val === 'number') return val;
    const match = val.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
  };

  const numericValue = extractNumber(value);
  const hasNumericValue = numericValue !== null;

  // Motion value and display state for number animation
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);
  const [displayTrend, setDisplayTrend] = useState(0);
  const trendCount = useMotionValue(0);

  useEffect(() => {
    if (inView && hasNumericValue) {
      animate(count, numericValue, {
        duration: 0.6,
        ease: 'easeOut',
        onUpdate: (latest) => setDisplayValue(Math.round(latest * 10) / 10),
      });
    }
  }, [inView, numericValue, count, hasNumericValue]);

  useEffect(() => {
    if (inView && trend) {
      animate(trendCount, trend.value, {
        duration: 0.4,
        ease: 'easeOut',
        onUpdate: (latest) => setDisplayTrend(Math.round(latest)),
      });
    }
  }, [inView, trend, trendCount]);

  const content = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{
        y: -2,
        transition: { duration: 0.2 },
      }}
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg',
        onClick && 'cursor-pointer'
      )}
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative space-y-3">
        {/* Icon & Label */}
        <div className="flex items-center justify-between">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              colorConfig[color]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1">
              <span
                className={cn(
                  'text-xs font-medium tabular-nums',
                  trend.value > 0 ? 'text-green-600' : 'text-red-600'
                )}
              >
                <NumberFlow
                  value={displayTrend}
                  format={{ signDisplay: 'exceptZero' }}
                />
                %
              </span>
              <span className="text-xs text-muted-foreground">
                {trend.label}
              </span>
            </div>
          )}
        </div>

        {/* Value */}
        <div>
          <div className="text-3xl font-bold tracking-tight tabular-nums">
            {hasNumericValue && inView ? (
              <NumberFlow value={displayValue} />
            ) : (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={
                  inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }
                }
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {value}
              </motion.span>
            )}
          </div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {/* Hover indicator */}
      {onClick && (
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </motion.div>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}
