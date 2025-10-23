'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ShiftCardEnhanced } from './shift-card-enhanced';
import { ShiftDialog } from './shift-dialog';
import { NoShiftsEmptyState, FilteredEmptyState } from './empty-state';
import { WeekViewSkeleton } from './shift-skeleton';
import {
  useEmployeeStore,
  useEmployeeActions,
  useCurrentDate,
  useScheduleFilters,
  useIsLoading,
} from '@/stores/employee-store';
import {
  addDays,
  startOfWeek,
  format,
  isSameDay,
  addWeeks,
  subWeeks,
} from 'date-fns';
import type { Shift } from '@/types/employee';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function WeekViewEnhanced() {
  const currentDate = useCurrentDate();
  const filters = useScheduleFilters();
  const isLoading = useIsLoading();
  const {
    setCurrentDate,
    getFilteredShifts,
    deleteShift,
    duplicateShift,
    clearScheduleFilters,
  } = useEmployeeActions();

  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Get the start of the week (Monday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

  // Generate the 7 days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Get filtered shifts
  const filteredShifts = getFilteredShifts();

  // Check if filters are active
  const hasActiveFilters =
    filters.search ||
    filters.departments.length > 0 ||
    filters.shiftTypes.length > 0 ||
    filters.locations.length > 0;

  const getShiftsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredShifts.filter((shift) => shift.date === dateStr);
  };

  const handlePreviousWeek = () => {
    setDirection('right');
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setDirection('left');
    setCurrentDate(addWeeks(currentDate, 1));
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

  if (isLoading) {
    return <WeekViewSkeleton />;
  }

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
                  onClick={handlePreviousWeek}
                  className="h-9 w-9 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Previous week</p>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-2">
                  ←
                </kbd>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleToday}>
                  Today
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Jump to today</p>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-2">
                  T
                </kbd>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextWeek}
                  className="h-9 w-9 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Next week</p>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-2">
                  →
                </kbd>
              </TooltipContent>
            </Tooltip>

            <div className="ml-4 space-y-1">
              <h2 className="text-lg font-semibold leading-none">
                {format(weekStart, 'MMMM yyyy')}
              </h2>
              <p className="text-sm text-muted-foreground leading-none">
                Week of {format(weekStart, 'MMM d')} -{' '}
                {format(addDays(weekStart, 6), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          <Button onClick={() => handleAddShift()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Shift
          </Button>
        </div>

        {/* Calendar Grid */}
        <div key={weekStart.toISOString()}>
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day) => {
              const dayShifts = getShiftsForDay(day);
              const isToday = isSameDay(day, new Date());
              const dateStr = format(day, 'yyyy-MM-dd');

              return (
                <div key={day.toISOString()} className="min-h-[200px] flex flex-col">
                  {/* Day Header */}
                  <div
                    className={cn(
                      'p-3 rounded-t-lg border-b flex-shrink-0',
                      isToday
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50'
                    )}
                  >
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        {format(day, 'EEE')}
                      </p>
                      <p
                        className={cn(
                          'text-2xl font-bold',
                          !isToday && 'text-muted-foreground'
                        )}
                      >
                        {format(day, 'd')}
                      </p>
                    </div>
                  </div>

                  {/* Day Content */}
                  <div className="border border-t-0 rounded-b-lg p-2 flex-1 bg-card overflow-hidden">
                    {dayShifts.length > 0 ? (
                      <div className="space-y-2 h-full">
                        {dayShifts.map((shift) => (
                          <div key={shift.id}>
                            <ShiftCardEnhanced
                              shift={shift}
                              onClick={() => handleEditShift(shift)}
                              onEdit={handleEditShift}
                              onDelete={handleDeleteShift}
                              onDuplicate={handleDuplicateShift}
                            />
                          </div>
                        ))}
                      </div>
                    ) : hasActiveFilters ? (
                      <div className="h-full">
                        <FilteredEmptyState
                          onClearFilters={clearScheduleFilters}
                          onAddShift={() => handleAddShift(dateStr)}
                          compact
                        />
                      </div>
                    ) : (
                      <div className="h-full">
                        <NoShiftsEmptyState
                          onAddShift={() => handleAddShift(dateStr)}
                          compact
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-sm">
          <span className="text-muted-foreground font-medium">Shift Types:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span>Morning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span>Afternoon</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-500" />
            <span>Night</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>Full Day</span>
          </div>
        </div>

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
