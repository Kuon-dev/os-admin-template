'use client';

import { motion } from 'motion/react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Shift } from '@/types/employee';

interface TimelineItemProps {
  shift: Shift;
  index: number;
  isToday?: boolean;
}

const shiftTypeColors = {
  morning: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  afternoon: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  night: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  'full-day': 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
};

export function TimelineItem({ shift, index, isToday }: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="group relative flex gap-4 pb-8 last:pb-0"
    >
      {/* Timeline line */}
      <div className="relative flex flex-col items-center">
        {/* Dot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.3,
            delay: index * 0.1 + 0.2,
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          className={cn(
            'z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-background',
            isToday
              ? 'border-primary'
              : 'border-muted-foreground/30 group-hover:border-primary'
          )}
        >
          {isToday && (
            <motion.div
              className="h-2 w-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </motion.div>

        {/* Vertical line */}
        <div className="h-full w-px bg-border group-last:bg-transparent" />
      </div>

      {/* Content */}
      <motion.div
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        className="flex-1 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {/* Date */}
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">
                {format(new Date(shift.date), 'EEEE')}
              </p>
              <Badge variant="outline" className="text-xs">
                {format(new Date(shift.date), 'MMM d')}
              </Badge>
              {isToday && (
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                  Today
                </Badge>
              )}
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="tabular-nums">
                {shift.startTime} - {shift.endTime}
              </span>
            </div>

            {/* Location */}
            {shift.location && (
              <p className="text-xs text-muted-foreground">{shift.location}</p>
            )}
          </div>

          {/* Shift Type Badge */}
          <Badge
            variant="outline"
            className={cn('text-xs font-medium', shiftTypeColors[shift.shiftType])}
          >
            {shift.shiftType.replace('-', ' ')}
          </Badge>
        </div>

        {/* Notes */}
        {shift.notes && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            whileHover={{ height: 'auto', opacity: 1 }}
            className="mt-2 overflow-hidden border-t pt-2"
          >
            <p className="text-xs text-muted-foreground">{shift.notes}</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
