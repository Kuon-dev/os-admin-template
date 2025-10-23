'use client';

import { useState, useEffect } from 'react';
import { motion, animate, useMotionValue } from 'motion/react';
import { format } from 'date-fns';
import NumberFlow from '@number-flow/react';
import { Clock, LogIn, LogOut } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TimeClockWidgetProps {
  isClockedIn: boolean;
  clockInTime?: string;
  todayHours: number;
  weekHours?: number;
  avgDayHours?: number;
  onClockIn: () => void;
  onClockOut: () => void;
  nextShift?: {
    date: string;
    startTime: string;
    endTime: string;
  };
}

export function TimeClockWidget({
  isClockedIn,
  clockInTime,
  todayHours,
  weekHours = 32.5,
  avgDayHours = 7.8,
  onClockIn,
  onClockOut,
  nextShift,
}: TimeClockWidgetProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Motion values for animated numbers
  const todayCount = useMotionValue(0);
  const weekCount = useMotionValue(0);
  const avgCount = useMotionValue(0);

  // Display states
  const [displayToday, setDisplayToday] = useState(0);
  const [displayWeek, setDisplayWeek] = useState(0);
  const [displayAvg, setDisplayAvg] = useState(0);

  // Time component states for smooth transitions
  const [hours, setHours] = useState(currentTime.getHours());
  const [minutes, setMinutes] = useState(currentTime.getMinutes());
  const [seconds, setSeconds] = useState(currentTime.getSeconds());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setHours(now.getHours());
      setMinutes(now.getMinutes());
      setSeconds(now.getSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Animate today's hours
  useEffect(() => {
    if (inView) {
      animate(todayCount, todayHours, {
        duration: 0.5,
        ease: 'easeOut',
        onUpdate: (latest) => setDisplayToday(Math.round(latest * 10) / 10),
      });
    }
  }, [inView, todayHours, todayCount]);

  // Animate week hours
  useEffect(() => {
    if (inView) {
      animate(weekCount, weekHours, {
        duration: 0.5,
        ease: 'easeOut',
        onUpdate: (latest) => setDisplayWeek(Math.round(latest * 10) / 10),
      });
    }
  }, [inView, weekHours, weekCount]);

  // Animate average hours
  useEffect(() => {
    if (inView) {
      animate(avgCount, avgDayHours, {
        duration: 0.5,
        ease: 'easeOut',
        onUpdate: (latest) => setDisplayAvg(Math.round(latest * 10) / 10),
      });
    }
  }, [inView, avgDayHours, avgCount]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background via-background to-muted/20 p-8"
    >
      {/* Decorative elements */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative grid gap-8 md:grid-cols-2">
        {/* Left: Clock Display */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Current Time
              </p>
              <div className="flex items-center gap-0.5 text-4xl font-bold tabular-nums tracking-tight">
                <NumberFlow
                  value={hours}
                  format={{ minimumIntegerDigits: 2 }}
                />
                <span>:</span>
                <NumberFlow
                  value={minutes}
                  format={{ minimumIntegerDigits: 2 }}
                />
                <span>:</span>
                <NumberFlow
                  value={seconds}
                  format={{ minimumIntegerDigits: 2 }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{format(currentTime, 'EEEE, MMMM d, yyyy')}</span>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-3 rounded-lg border bg-background/50 p-4 backdrop-blur-sm">
            <div className="relative">
              <div
                className={cn(
                  'h-3 w-3 rounded-full',
                  isClockedIn ? 'bg-green-500' : 'bg-gray-300'
                )}
              />
              {isClockedIn && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-green-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {isClockedIn ? 'Clocked In' : 'Clocked Out'}
              </p>
              {isClockedIn && clockInTime && (
                <p className="text-xs text-muted-foreground">
                  Since {clockInTime}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold tabular-nums">
                <NumberFlow
                  value={displayToday}
                  format={{
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">hours today</p>
            </div>
          </div>
        </div>

        {/* Right: Actions & Next Shift */}
        <div className="flex flex-col justify-center space-y-6">
          {/* Clock In/Out Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className={cn(
                      'h-16 w-full text-lg font-semibold shadow-lg',
                      isClockedIn
                        ? 'bg-destructive hover:bg-destructive/90'
                        : 'bg-primary hover:bg-primary/90'
                    )}
                    onClick={isClockedIn ? onClockOut : onClockIn}
                  >
                    {isClockedIn ? (
                      <>
                        <LogOut className="mr-2 h-5 w-5" />
                        Clock Out
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-5 w-5" />
                        Clock In
                      </>
                    )}
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isClockedIn
                    ? 'End your shift and record your hours'
                    : 'Start your shift and begin tracking time'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Next Shift Info */}
          {nextShift && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border bg-background/50 p-4 backdrop-blur-sm"
            >
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Next Scheduled Shift
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    {format(new Date(nextShift.date), 'EEEE, MMM d')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {nextShift.startTime} - {nextShift.endTime}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl font-bold text-primary">
                  {format(new Date(nextShift.date), 'd')}
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-background/30 p-3 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">This Week</p>
              <div className="text-xl font-bold tabular-nums">
                <NumberFlow
                  value={displayWeek}
                  format={{
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }}
                />
                <span>h</span>
              </div>
            </div>
            <div className="rounded-lg border bg-background/30 p-3 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">Avg/Day</p>
              <div className="text-xl font-bold tabular-nums">
                <NumberFlow
                  value={displayAvg}
                  format={{
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }}
                />
                <span>h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
