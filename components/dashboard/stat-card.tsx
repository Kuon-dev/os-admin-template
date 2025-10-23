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

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink' | 'cyan';
  subtitle?: string;
  tooltip?: string;
  onClick?: () => void;
  decimals?: number;
}

const colorConfig = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500/20',
  },
  green: {
    bg: 'bg-green-500/10',
    text: 'text-green-600 dark:text-green-400',
    gradient: 'from-green-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-400',
    gradient: 'from-purple-500/20',
  },
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    gradient: 'from-orange-500/20',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
    gradient: 'from-red-500/20',
  },
  pink: {
    bg: 'bg-pink-500/10',
    text: 'text-pink-600 dark:text-pink-400',
    gradient: 'from-pink-500/20',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-600 dark:text-cyan-400',
    gradient: 'from-cyan-500/20',
  },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  prefix = '',
  suffix = '',
  trend,
  color = 'blue',
  subtitle,
  tooltip,
  onClick,
  decimals = 0,
}: StatCardProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);
  const [displayTrend, setDisplayTrend] = useState(0);
  const trendCount = useMotionValue(0);

  useEffect(() => {
    if (inView) {
      animate(count, value, {
        duration: 1,
        ease: [0.4, 0, 0.2, 1],
        onUpdate: (latest) => {
          const rounded =
            decimals === 0
              ? Math.round(latest)
              : Math.round(latest * Math.pow(10, decimals)) /
                Math.pow(10, decimals);
          setDisplayValue(rounded);
        },
      });
    }
  }, [inView, value, count, decimals]);

  useEffect(() => {
    if (inView && trend) {
      animate(trendCount, trend.value, {
        duration: 0.8,
        ease: 'easeOut',
        onUpdate: (latest) => setDisplayTrend(Math.round(latest * 10) / 10),
      });
    }
  }, [inView, trend, trendCount]);

  const content = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={onClick ? { scale: 1.02, y: -2 } : {}}
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md',
        onClick && 'cursor-pointer'
      )}
    >
      {/* Gradient background */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity group-hover:opacity-100',
          colorConfig[color].gradient
        )}
      />

      <div className="relative space-y-4">
        {/* Icon & Trend */}
        <div className="flex items-start justify-between">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              colorConfig[color].bg
            )}
          >
            <Icon className={cn('h-6 w-6', colorConfig[color].text)} />
          </div>
          {trend && (
            <div className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
              <motion.span
                className={cn(
                  'text-xs font-semibold tabular-nums',
                  trend.value > 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                )}
              >
                <NumberFlow
                  value={displayTrend}
                  format={{
                    signDisplay: 'exceptZero',
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }}
                />
                %
              </motion.span>
              <span className="text-xs text-muted-foreground">
                {trend.label}
              </span>
            </div>
          )}
        </div>

        {/* Value */}
        <div>
          <div className="flex items-baseline gap-1">
            {prefix && (
              <span className="text-2xl font-bold text-muted-foreground">
                {prefix}
              </span>
            )}
            <div className="text-3xl font-bold tracking-tight tabular-nums">
              <NumberFlow
                value={displayValue}
                format={{
                  minimumFractionDigits: decimals,
                  maximumFractionDigits: decimals,
                }}
              />
            </div>
            {suffix && (
              <span className="text-xl font-semibold text-muted-foreground">
                {suffix}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {label}
          </p>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-muted-foreground/80">{subtitle}</p>
        )}
      </div>

      {/* Bottom accent line */}
      {onClick && (
        <div
          className={cn(
            'absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r to-transparent opacity-0 transition-opacity group-hover:opacity-100',
            colorConfig[color].gradient
          )}
        />
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
