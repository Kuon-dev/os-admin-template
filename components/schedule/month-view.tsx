'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShiftCardEnhanced } from './shift-card-enhanced';
import { ShiftDialog } from './shift-dialog';
import {
  useCurrentDate,
  useEmployeeActions,
} from '@/stores/employee-store';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  getDay,
} from 'date-fns';
import type { Shift } from '@/types/employee';
import { cn } from '@/lib/utils';
import {
  fadeIn,
  slideLeft,
  slideRight,
  spring,
  staggerChildren,
  listItem,
} from '@/lib/utils/motion';
import { toast } from 'sonner';

const getShiftTypeColor = (shiftType: Shift['shiftType']) => {
  switch (shiftType) {
    case 'morning':
      return 'bg-blue-500';
    case 'afternoon':
      return 'bg-orange-500';
    case 'night':
      return 'bg-purple-500';
    case 'full-day':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export function MonthView() {
  const currentDate = useCurrentDate();
  const {
    setCurrentDate,
    getFilteredShifts,
    deleteShift,
    duplicateShift,
  } = useEmployeeActions();

  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const filteredShifts = getFilteredShifts();

  // Get month boundaries
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Get all days in the month
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate padding days to align with week grid
  const startDayOfWeek = getDay(monthStart); // 0 = Sunday
  const paddingStart = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Adjust for Monday start

  const getShiftsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredShifts.filter((shift) => shift.date === dateStr);
  };

  const handlePreviousMonth = () => {
    setDirection('right');
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setDirection('left');
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    const today = new Date();
    const isBefore = currentDate < today;
    setDirection(isBefore ? 'left' : 'right');
    setCurrentDate(today);
  };

  const handleAddShift = (date?: string) => {
    setSelectedDate(date || null);
    setEditingShift(null);
    setShiftDialogOpen(true);
  };

  const handleEditShift = (shift: Shift) => {
    setEditingShift(shift);
    setShiftDialogOpen(true);
  };

  const handleDeleteShift = (shift: Shift) => {
    if (confirm(`Are you sure you want to delete this shift for ${shift.employeeName}?`)) {
      deleteShift(shift.id);
      toast.success('Shift deleted successfully');
    }
  };

  const handleDuplicateShift = (shift: Shift) => {
    const newDate = prompt('Enter the new date (YYYY-MM-DD):', shift.date);
    if (newDate) {
      const result = duplicateShift(shift.id, newDate);
      if (result.success) {
        toast.success('Shift duplicated successfully');
      } else {
        toast.error('Failed to duplicate shift due to conflicts');
      }
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousMonth}
                  className="h-9 w-9 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Previous month</TooltipContent>
            </Tooltip>

            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextMonth}
                  className="h-9 w-9 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Next month</TooltipContent>
            </Tooltip>

            <div className="ml-4">
              <h2 className="text-lg font-semibold">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
            </div>
          </div>

          <Button onClick={() => handleAddShift()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Shift
          </Button>
        </div>

        {/* Month Grid */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={monthStart.toISOString()}
            initial={direction === 'left' ? slideLeft.initial : slideRight.initial}
            animate={direction === 'left' ? slideLeft.animate : slideRight.animate}
            exit={direction === 'left' ? slideLeft.exit : slideRight.exit}
            transition={spring.smooth}
          >
            <div className="border rounded-lg overflow-hidden">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 bg-muted/50 border-b">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center text-sm font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {/* Padding cells */}
                {Array.from({ length: paddingStart }).map((_, i) => (
                  <div
                    key={`padding-${i}`}
                    className="min-h-[100px] border-r border-b bg-muted/20"
                  />
                ))}

                {/* Month days */}
                {monthDays.map((day) => {
                  const dayShifts = getShiftsForDay(day);
                  const isToday = isSameDay(day, new Date());
                  const dateStr = format(day, 'yyyy-MM-dd');

                  // Group shifts by type for dots
                  const shiftTypes = new Set(dayShifts.map((s) => s.shiftType));

                  return (
                    <Popover key={day.toISOString()}>
                      <PopoverTrigger asChild>
                        <motion.div
                          {...fadeIn}
                          className={cn(
                            'min-h-[100px] border-r border-b p-2 hover:bg-accent/50 cursor-pointer transition-colors',
                            isToday && 'bg-primary/5'
                          )}
                        >
                          <div className="flex flex-col h-full">
                            {/* Date Number */}
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={cn(
                                  'text-sm font-medium',
                                  isToday &&
                                    'flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground'
                                )}
                              >
                                {format(day, 'd')}
                              </span>

                              {/* Shift Count Badge */}
                              {dayShifts.length > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="h-5 px-1.5 text-xs"
                                >
                                  {dayShifts.length}
                                </Badge>
                              )}
                            </div>

                            {/* Shift Type Dots */}
                            {shiftTypes.size > 0 && (
                              <div className="flex gap-1 flex-wrap mt-auto">
                                {Array.from(shiftTypes).map((type) => (
                                  <div
                                    key={type}
                                    className={cn(
                                      'w-2 h-2 rounded-full',
                                      getShiftTypeColor(type)
                                    )}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </PopoverTrigger>

                      {dayShifts.length > 0 && (
                        <PopoverContent
                          className="w-80 p-0"
                          align="start"
                          side="bottom"
                        >
                          <div className="p-3 border-b">
                            <h3 className="font-semibold">
                              {format(day, 'EEEE, MMMM d')}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {dayShifts.length} shift{dayShifts.length !== 1 ? 's' : ''}
                            </p>
                          </div>

                          <ScrollArea className="max-h-[400px]">
                            <motion.div
                              {...staggerChildren(20)}
                              className="p-3 space-y-2"
                            >
                              {dayShifts.map((shift) => (
                                <motion.div key={shift.id} {...listItem}>
                                  <ShiftCardEnhanced
                                    shift={shift}
                                    onClick={() => handleEditShift(shift)}
                                    onEdit={handleEditShift}
                                    onDelete={handleDeleteShift}
                                    onDuplicate={handleDuplicateShift}
                                  />
                                </motion.div>
                              ))}
                            </motion.div>
                          </ScrollArea>

                          <div className="p-2 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full gap-2"
                              onClick={() => handleAddShift(dateStr)}
                            >
                              <Plus className="h-4 w-4" />
                              Add Shift
                            </Button>
                          </div>
                        </PopoverContent>
                      )}
                    </Popover>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Shift Dialog */}
        <ShiftDialog
          open={shiftDialogOpen}
          onOpenChange={setShiftDialogOpen}
          shift={editingShift}
          defaultDate={selectedDate || undefined}
          onSuccess={() => {
            setShiftDialogOpen(false);
            setEditingShift(null);
            setSelectedDate(null);
          }}
        />
      </div>
    </TooltipProvider>
  );
}
