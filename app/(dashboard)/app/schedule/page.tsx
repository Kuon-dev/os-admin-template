'use client';

import { Calendar } from 'lucide-react';
import { ScheduleSearchBar } from '@/components/schedule/schedule-search-bar';
import { ViewSwitcher } from '@/components/schedule/view-switcher';
import { WeekViewEnhanced } from '@/components/schedule/week-view-enhanced';
import { MonthView } from '@/components/schedule/month-view';
import { EmployeeView } from '@/components/schedule/employee-view';
import { useScheduleView } from '@/stores/employee-store';

export default function SchedulePage() {
  const currentView = useScheduleView();

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-primary/10">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Schedule</h1>
          <p className="text-muted-foreground text-sm mt-1">
            View and manage employee work schedules across your organization
          </p>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          {/* Search and Filters - takes most space */}
          <div className="flex-1">
            <ScheduleSearchBar />
          </div>

          {/* View Switcher - right aligned */}
          <div className="flex-shrink-0">
            <ViewSwitcher />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[600px]">
        {currentView === 'week' && <WeekViewEnhanced />}
        {currentView === 'month' && <MonthView />}
        {currentView === 'employee' && <EmployeeView />}
      </div>
    </div>
  );
}
