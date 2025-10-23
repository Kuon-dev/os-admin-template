'use client';

import { motion } from 'motion/react';
import { Calendar, CalendarDays, User } from 'lucide-react';
import { useScheduleView, useEmployeeActions } from '@/stores/employee-store';
import type { ScheduleView } from '@/stores/employee-store';
import { cn } from '@/lib/utils';
import { spring } from '@/lib/utils/motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const views: {
  value: ScheduleView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
}[] = [
  { value: 'week', label: 'Week', icon: Calendar, shortcut: '1' },
  { value: 'month', label: 'Month', icon: CalendarDays, shortcut: '2' },
  { value: 'employee', label: 'Employee', icon: User, shortcut: '3' },
];

export function ViewSwitcher() {
  const currentView = useScheduleView();
  const { setScheduleView } = useEmployeeActions();

  // Get the index of the current view for indicator positioning
  const currentIndex = views.findIndex((v) => v.value === currentView);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="relative inline-flex items-center bg-muted/50 rounded-lg p-1 gap-1">
        {/* Animated Background Indicator */}
        <motion.div
          className="absolute inset-y-1 bg-background rounded-md shadow-sm"
          initial={false}
          animate={{
            x: currentIndex * 88 + 4, // 88px per button (80px width + 8px gap)
            width: 80,
          }}
          transition={spring.snappy}
          style={{
            zIndex: 0,
          }}
        />

        {/* View Buttons */}
        {views.map((view) => {
          const Icon = view.icon;
          const isActive = currentView === view.value;

          return (
            <Tooltip key={view.value}>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => setScheduleView(view.value)}
                  className={cn(
                    'relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors w-20',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  whileTap={{ scale: 0.97 }}
                  transition={spring.snappy}
                  aria-label={`Switch to ${view.label} view`}
                  aria-pressed={isActive}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isActive && 'scale-110'
                    )}
                  />
                  <span className="hidden sm:inline">{view.label}</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="flex items-center gap-2">
                <span>{view.label} View</span>
                {view.shortcut && (
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    {view.shortcut}
                  </kbd>
                )}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
