'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ShiftCard } from './shift-card';
import { useEmployeeStore, useEmployeeActions } from '@/stores/employee-store';
import {
  addDays,
  startOfWeek,
  format,
  isSameDay,
  addWeeks,
  subWeeks,
} from 'date-fns';
import { mockDepartments } from '@/lib/mock-data/employees';

export function ScheduleCalendar() {
  const currentDate = useEmployeeStore((state) => state.currentDate);
  const shifts = useEmployeeStore((state) => state.shifts);
  const { setCurrentDate, getShiftsByDate } = useEmployeeActions();

  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Get the start of the week (Monday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

  // Generate the 7 days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Filter shifts by department
  const filteredShifts = shifts.filter(
    (shift) =>
      selectedDepartment === 'all' || shift.department === selectedDepartment
  );

  const handlePreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getShiftsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredShifts.filter((shift) => shift.date === dateStr);
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="ml-4">
            <h2 className="text-lg font-semibold">
              {format(weekStart, 'MMMM yyyy')}
            </h2>
            <p className="text-sm text-muted-foreground">
              Week of {format(weekStart, 'MMM d')} -{' '}
              {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {mockDepartments.map((dept) => (
              <SelectItem key={dept.id} value={dept.name}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const dayShifts = getShiftsForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div key={day.toISOString()} className="min-h-[200px]">
              {/* Day Header */}
              <div
                className={`p-3 rounded-t-lg border-b ${
                  isToday
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50'
                }`}
              >
                <div className="text-center">
                  <p className="text-sm font-medium">
                    {format(day, 'EEE')}
                  </p>
                  <p className={`text-2xl font-bold ${isToday ? '' : 'text-muted-foreground'}`}>
                    {format(day, 'd')}
                  </p>
                </div>
              </div>

              {/* Day Content */}
              <div className="border border-t-0 rounded-b-lg p-2 space-y-2 min-h-[150px] bg-card">
                {dayShifts.length > 0 ? (
                  dayShifts.map((shift) => (
                    <ShiftCard key={shift.id} shift={shift} />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-xs text-muted-foreground">No shifts</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">Shift Types:</span>
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
    </div>
  );
}
