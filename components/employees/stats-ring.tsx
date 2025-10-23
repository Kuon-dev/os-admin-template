'use client';

import { useEffect, useState } from 'react';
import { motion, animate, useMotionValue } from 'motion/react';
import NumberFlow from '@number-flow/react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

interface StatsRingProps {
  value: number;
  max: number;
  label: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { radius: 32, stroke: 6, fontSize: 'text-sm' },
  md: { radius: 48, stroke: 8, fontSize: 'text-lg' },
  lg: { radius: 64, stroke: 10, fontSize: 'text-2xl' },
};

const colorConfig: Record<string, string> = {
  blue: 'stroke-blue-500',
  green: 'stroke-green-500',
  purple: 'stroke-purple-500',
  orange: 'stroke-orange-500',
  red: 'stroke-red-500',
};

export function StatsRing({
  value,
  max,
  label,
  color = 'blue',
  size = 'md',
  showValue = true,
  className,
}: StatsRingProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const config = sizeConfig[size];
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Motion value and display state for number animation
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (inView) {
      animate(count, value, {
        duration: 0.8,
        ease: 'easeOut',
        onUpdate: (latest) => setDisplayValue(Math.round(latest)),
      });
    } else {
      setDisplayValue(0);
    }
  }, [inView, value, count]);

  return (
    <div ref={ref} className={cn('flex flex-col items-center gap-3', className)}>
      <div
        className="relative"
        style={{
          width: config.radius * 2 + 20,
          height: config.radius * 2 + 20,
        }}
      >
        <svg
          width={config.radius * 2 + 20}
          height={config.radius * 2 + 20}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.radius + 10}
            cy={config.radius + 10}
            r={config.radius}
            className="stroke-muted"
            strokeWidth={config.stroke}
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx={config.radius + 10}
            cy={config.radius + 10}
            r={config.radius}
            className={colorConfig[color]}
            strokeWidth={config.stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={
              inView
                ? { strokeDashoffset }
                : { strokeDashoffset: circumference }
            }
            transition={{
              duration: 1,
              ease: 'easeOut',
              delay: 0.2,
            }}
          />
        </svg>

        {/* Center value */}
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={cn('font-bold tabular-nums', config.fontSize)}>
              <NumberFlow value={displayValue} />
            </div>
            <span className="text-xs text-muted-foreground">/ {max}</span>
          </div>
        )}
      </div>

      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
}
