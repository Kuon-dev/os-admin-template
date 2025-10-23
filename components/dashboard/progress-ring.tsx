'use client';

import { useEffect, useState } from 'react';
import { motion, animate, useMotionValue } from 'motion/react';
import NumberFlow from '@number-flow/react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  value: number;
  max: number;
  label: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  thickness?: number;
}

const colorConfig = {
  blue: {
    stroke: 'stroke-blue-600 dark:stroke-blue-400',
    text: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    stroke: 'stroke-green-600 dark:stroke-green-400',
    text: 'text-green-600 dark:text-green-400',
  },
  purple: {
    stroke: 'stroke-purple-600 dark:stroke-purple-400',
    text: 'text-purple-600 dark:text-purple-400',
  },
  orange: {
    stroke: 'stroke-orange-600 dark:stroke-orange-400',
    text: 'text-orange-600 dark:text-orange-400',
  },
  red: {
    stroke: 'stroke-red-600 dark:stroke-red-400',
    text: 'text-red-600 dark:text-red-400',
  },
  pink: {
    stroke: 'stroke-pink-600 dark:stroke-pink-400',
    text: 'text-pink-600 dark:text-pink-400',
  },
  cyan: {
    stroke: 'stroke-cyan-600 dark:stroke-cyan-400',
    text: 'text-cyan-600 dark:text-cyan-400',
  },
};

const sizeConfig = {
  sm: { diameter: 80, fontSize: 'text-lg' },
  md: { diameter: 120, fontSize: 'text-2xl' },
  lg: { diameter: 160, fontSize: 'text-3xl' },
};

export function ProgressRing({
  value,
  max,
  label,
  color = 'blue',
  size = 'md',
  showPercentage = true,
  thickness = 8,
}: ProgressRingProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const progress = useMotionValue(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  const percentage = (value / max) * 100;
  const { diameter, fontSize } = sizeConfig[size];
  const radius = (diameter - thickness * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (inView) {
      animate(progress, percentage, {
        duration: 1.5,
        ease: [0.4, 0, 0.2, 1],
        onUpdate: (latest) => setDisplayProgress(latest),
      });
    }
  }, [inView, percentage, progress]);

  const strokeDashoffset = circumference - (displayProgress / 100) * circumference;

  return (
    <div ref={ref} className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: diameter, height: diameter }}>
        <svg
          width={diameter}
          height={diameter}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            className="stroke-muted"
            strokeWidth={thickness}
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            className={cn(colorConfig[color].stroke)}
            strokeWidth={thickness}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={cn('font-bold tabular-nums', fontSize)}>
            {showPercentage ? (
              <>
                <NumberFlow
                  value={displayProgress}
                  format={{ maximumFractionDigits: 0 }}
                />
                %
              </>
            ) : (
              <>
                <NumberFlow value={value * (displayProgress / percentage)} />
                <span className="text-sm text-muted-foreground">/{max}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <p className="text-center text-sm font-medium text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
