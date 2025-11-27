'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

interface MiniChartProps {
  data: number[];
  type?: 'line' | 'bar';
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink' | 'cyan';
  height?: number;
  showGradient?: boolean;
}

const colorConfig = {
  blue: {
    stroke: 'stroke-blue-500',
    fill: 'fill-blue-500',
    gradient: ['#3b82f6', '#3b82f610'],
  },
  green: {
    stroke: 'stroke-green-500',
    fill: 'fill-green-500',
    gradient: ['#22c55e', '#22c55e10'],
  },
  purple: {
    stroke: 'stroke-purple-500',
    fill: 'fill-purple-500',
    gradient: ['#a855f7', '#a855f710'],
  },
  orange: {
    stroke: 'stroke-orange-500',
    fill: 'fill-orange-500',
    gradient: ['#f97316', '#f9731610'],
  },
  red: {
    stroke: 'stroke-red-500',
    fill: 'fill-red-500',
    gradient: ['#ef4444', '#ef444410'],
  },
  pink: {
    stroke: 'stroke-pink-500',
    fill: 'fill-pink-500',
    gradient: ['#ec4899', '#ec489910'],
  },
  cyan: {
    stroke: 'stroke-cyan-500',
    fill: 'fill-cyan-500',
    gradient: ['#06b6d4', '#06b6d410'],
  },
};

export function MiniChart({
  data,
  type = 'line',
  color = 'blue',
  height = 60,
  showGradient = true,
}: MiniChartProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [mounted, setMounted] = useState(false);
  const [animatedData, setAnimatedData] = useState(data.map(() => 0));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (inView && mounted) {
      setTimeout(() => setAnimatedData(data), 100);
    }
  }, [inView, data, mounted]);

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  const width = 200;
  const padding = 4;

  const points = animatedData.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
    const y =
      height -
      padding -
      ((value - min) / (range || 1)) * (height - padding * 2);
    return { x, y, value };
  });

  if (type === 'bar') {
    const barWidth = (width - padding * 2) / data.length - 2;
    return (
      <div ref={ref} className="overflow-hidden rounded-lg">
        <svg width={width} height={height} className="w-full" suppressHydrationWarning>
          {points.map((point, index) => (
            <motion.rect
              key={index}
              x={point.x - barWidth / 2}
              y={point.y}
              width={barWidth}
              height={height - padding - point.y}
              className={cn(colorConfig[color].fill, 'opacity-80')}
              initial={{ height: 0, y: height - padding }}
              animate={{ height: height - padding - point.y, y: point.y }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
                ease: [0.4, 0, 0.2, 1],
              }}
              rx={2}
            />
          ))}
        </svg>
      </div>
    );
  }

  // Line chart
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

  const areaPath = showGradient
    ? `${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`
    : '';

  return (
    <div ref={ref} className="overflow-hidden rounded-lg">
      <svg width={width} height={height} className="w-full" suppressHydrationWarning>
        {showGradient && (
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={colorConfig[color].gradient[0]} />
              <stop offset="100%" stopColor={colorConfig[color].gradient[1]} />
            </linearGradient>
          </defs>
        )}

        {/* Area fill */}
        {showGradient && (
          <motion.path
            d={areaPath}
            fill={`url(#gradient-${color})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          />
        )}

        {/* Line */}
        <motion.path
          d={pathData}
          className={cn(colorConfig[color].stroke)}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: inView ? 1 : 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Points */}
        {points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={3}
            className={cn(colorConfig[color].fill)}
            initial={{ scale: 0 }}
            animate={{ scale: inView ? 1 : 0 }}
            transition={{
              duration: 0.3,
              delay: 0.5 + index * 0.05,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        ))}
      </svg>
    </div>
  );
}
