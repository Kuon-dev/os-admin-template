'use client';

import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { shimmer, fadeIn, staggerChildren, listItem } from '@/lib/utils/motion';
import { cn } from '@/lib/utils';

interface ShiftSkeletonProps {
  count?: number;
  className?: string;
}

export function ShiftSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('p-3 space-y-2 border-l-4 border-muted', className)}>
      <div className="flex items-start gap-3">
        {/* Avatar Skeleton */}
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />

        {/* Content Skeleton */}
        <div className="flex-1 space-y-2">
          {/* Name and Badge */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>

          {/* Time and Location */}
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ShiftSkeletonList({ count = 3, className }: ShiftSkeletonProps) {
  return (
    <motion.div
      {...staggerChildren(50)}
      className={cn('space-y-2', className)}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} {...listItem}>
          <ShiftSkeleton />
        </motion.div>
      ))}
    </motion.div>
  );
}

export function WeekViewSkeleton() {
  return (
    <motion.div {...fadeIn} className="space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9" /> {/* Prev button */}
          <Skeleton className="h-9 w-16" /> {/* Today button */}
          <Skeleton className="h-9 w-9" /> {/* Next button */}
          <div className="ml-4 space-y-1">
            <Skeleton className="h-5 w-32" /> {/* Month/Year */}
            <Skeleton className="h-4 w-48" /> {/* Week range */}
          </div>
        </div>
        <Skeleton className="h-9 w-48" /> {/* Department filter */}
      </div>

      {/* Calendar Grid Skeleton */}
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: 7 }).map((_, dayIndex) => (
          <div key={dayIndex} className="min-h-[200px]">
            {/* Day Header */}
            <div className="p-3 rounded-t-lg border-b bg-muted/50">
              <div className="text-center space-y-1">
                <Skeleton className="h-4 w-12 mx-auto" />
                <Skeleton className="h-6 w-8 mx-auto" />
              </div>
            </div>

            {/* Day Content */}
            <div className="border border-t-0 rounded-b-lg p-2 space-y-2 min-h-[150px] bg-card">
              {dayIndex % 3 === 0 && <ShiftSkeleton />}
              {dayIndex % 2 === 0 && <ShiftSkeleton />}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function SchedulePageSkeleton() {
  return (
    <motion.div {...fadeIn} className="space-y-6 p-8">
      {/* Page Header Skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Controls Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-96" /> {/* Search bar */}
        <Skeleton className="h-10 w-48" /> {/* View switcher */}
      </div>

      {/* Content Skeleton */}
      <WeekViewSkeleton />
    </motion.div>
  );
}
