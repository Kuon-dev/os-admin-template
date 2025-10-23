'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeEntryTable } from '@/components/timesheet/time-entry-table';
import { Clock, LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import {
  useEmployees,
  useEmployeeActions,
  useTimeEntries,
} from '@/stores/employee-store';
import { format } from 'date-fns';
import NumberFlow from '@number-flow/react';

export default function TimesheetPage() {
  const employees = useEmployees();
  const timeEntries = useTimeEntries();
  const { clockIn, clockOut, updateTimeEntry, getTimeEntriesByEmployeeId } =
    useEmployeeActions();

  // For demo purposes, we'll use the first employee
  const currentEmployee = employees[0];
  const [currentTime, setCurrentTime] = useState(new Date());

  // Time component states for smooth transitions
  const [hours, setHours] = useState(currentTime.getHours());
  const [minutes, setMinutes] = useState(currentTime.getMinutes());
  const [seconds, setSeconds] = useState(currentTime.getSeconds());

  // Update time every second
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

  if (!currentEmployee) {
    return <div>Loading...</div>;
  }

  const employeeTimeEntries = getTimeEntriesByEmployeeId(currentEmployee.id);
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEntry = employeeTimeEntries.find((entry) => entry.date === today);
  const isClockedIn = todayEntry?.status === 'clocked-in';

  const handleClockIn = () => {
    clockIn(currentEmployee.id);
    toast.success('Clocked in successfully');
  };

  const handleClockOut = () => {
    clockOut(currentEmployee.id);
    toast.success('Clocked out successfully');
  };

  const calculateHoursToday = () => {
    if (!todayEntry) return 0;
    if (todayEntry.status === 'completed') return todayEntry.totalHours;

    // Calculate current hours if clocked in
    if (todayEntry.clockIn) {
      const clockInTime = new Date(`2000-01-01T${todayEntry.clockIn}`);
      const now = new Date();
      const currentTimeStr = now.toTimeString().slice(0, 5);
      const currentClockTime = new Date(`2000-01-01T${currentTimeStr}`);

      const diffMs = currentClockTime.getTime() - clockInTime.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return Math.max(0, diffHours);
    }

    return 0;
  };

  const hoursToday = calculateHoursToday();

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Clock className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Timesheet</h1>
          <p className="text-muted-foreground">
            Track your working hours and manage time entries
          </p>
        </div>
      </div>

      {/* Time Clock Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Time Clock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Current Time */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
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
                <p className="text-sm text-muted-foreground mt-1">
                  {format(currentTime, 'EEEE, MMMM d, yyyy')}
                </p>
              </div>

              {/* Clock In/Out Button */}
              <div>
                {isClockedIn ? (
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={handleClockOut}
                    className="w-full"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Clock Out
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleClockIn}
                    className="w-full"
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Clock In
                  </Button>
                )}
              </div>
            </div>

            {/* Today's Summary */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      isClockedIn ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                    }`}
                  />
                  <p className="text-lg font-semibold">
                    {isClockedIn ? 'Clocked In' : 'Clocked Out'}
                  </p>
                </div>
              </div>

              {todayEntry?.clockIn && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Clock In Time
                  </p>
                  <p className="text-2xl font-semibold tabular-nums">{todayEntry.clockIn}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Hours Today
                </p>
                <div className="text-2xl font-semibold tabular-nums">
                  <NumberFlow
                    value={hoursToday}
                    format={{
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    }}
                  />
                  <span> hrs</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              <NumberFlow
                value={employeeTimeEntries.reduce(
                  (sum, entry) => sum + entry.totalHours,
                  0
                )}
                format={{
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                }}
              />
              <span> hrs</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Total hours worked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Daily
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              <NumberFlow
                value={
                  employeeTimeEntries.reduce(
                    (sum, entry) => sum + entry.totalHours,
                    0
                  ) /
                    employeeTimeEntries.filter((e) => e.totalHours > 0).length ||
                  0
                }
                format={{
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                }}
              />
              <span> hrs</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Per day this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Worked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              <NumberFlow
                value={employeeTimeEntries.filter((e) => e.totalHours > 0).length}
              />
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Timesheet */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Weekly Timesheet</h2>
        <TimeEntryTable
          timeEntries={employeeTimeEntries}
          onUpdateEntry={updateTimeEntry}
        />
      </div>
    </div>
  );
}
