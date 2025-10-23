'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import {
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  FileText,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { TimeClockWidget } from '@/components/employees/time-clock-widget';
import { QuickStatCard } from '@/components/employees/quick-stat-card';
import { StatsRing } from '@/components/employees/stats-ring';
import { ActionButton } from '@/components/employees/action-button';
import { TimelineItem } from '@/components/employees/timeline-item';
import { toast } from 'sonner';
import {
  useEmployees,
  useShifts,
  useLeaveRequests,
  usePayslips,
  useTimeEntries,
  useEmployeeActions,
} from '@/stores/employee-store';
import { useRouter } from 'next/navigation';

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const employees = useEmployees();
  const shifts = useShifts();
  const leaveRequests = useLeaveRequests();
  const payslips = usePayslips();
  const timeEntries = useTimeEntries();
  const {
    getPendingLeaveRequests,
    getShiftsByDateRange,
    getTimeEntriesByEmployeeId,
    clockIn,
    clockOut,
  } = useEmployeeActions();

  // For demo purposes, we'll use the first employee
  const currentEmployee = employees[0];

  if (!currentEmployee) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const pendingRequests = getPendingLeaveRequests().filter(
    (req) => req.employeeId === currentEmployee.id
  );

  // Get upcoming shifts (next 7 days)
  const today = new Date();
  const nextWeek = addDays(today, 7);
  const upcomingShifts = getShiftsByDateRange(
    format(today, 'yyyy-MM-dd'),
    format(nextWeek, 'yyyy-MM-dd')
  )
    .filter((shift) => shift.employeeId === currentEmployee.id)
    .slice(0, 5);

  const nextShift = upcomingShifts[0];

  // Get latest payslip
  const latestPayslip = payslips
    .filter((p) => p.employeeId === currentEmployee.id)
    .sort(
      (a, b) => new Date(b.payDate).getTime() - new Date(a.payDate).getTime()
    )[0];

  // Time tracking
  const employeeTimeEntries = getTimeEntriesByEmployeeId(currentEmployee.id);
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayEntry = employeeTimeEntries.find(
    (entry) => entry.date === todayStr
  );
  const isClockedIn = todayEntry?.status === 'clocked-in';

  const calculateHoursToday = () => {
    if (!todayEntry) return 0;
    if (todayEntry.status === 'completed') return todayEntry.totalHours;

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

  // Calculate weekly hours (last 7 days)
  const calculateWeeklyHours = () => {
    const sevenDaysAgo = subDays(new Date(), 7);
    const weeklyEntries = employeeTimeEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= sevenDaysAgo && entry.status === 'completed';
    });
    return weeklyEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
  };

  // Calculate average daily hours (based on last 30 days of completed entries)
  const calculateAvgDailyHours = () => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    const recentEntries = employeeTimeEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= thirtyDaysAgo && entry.status === 'completed';
    });
    if (recentEntries.length === 0) return 0;
    const totalHours = recentEntries.reduce(
      (sum, entry) => sum + entry.totalHours,
      0
    );
    return totalHours / recentEntries.length;
  };

  const weekHours = calculateWeeklyHours();
  const avgDayHours = calculateAvgDailyHours();

  // Calculate total leave balance
  const totalLeaveBalance = currentEmployee.leaveBalances.reduce(
    (sum, bal) => sum + bal.remaining,
    0
  );

  const handleClockIn = () => {
    clockIn(currentEmployee.id);
    toast.success('Clocked in successfully!');
  };

  const handleClockOut = () => {
    clockOut(currentEmployee.id);
    toast.success('Clocked out successfully!');
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`
      : parts[0].slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-4 ring-primary/10">
              <AvatarFallback className="text-xl font-semibold">
                {getInitials(currentEmployee.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {currentEmployee.name.split(' ')[0]}!
              </h1>
              <p className="text-muted-foreground">
                {currentEmployee.role} • {currentEmployee.department}
              </p>
            </div>
          </div>
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium text-muted-foreground">
              Employee ID
            </p>
            <p className="text-lg font-bold">{currentEmployee.employeeNumber}</p>
          </div>
        </motion.div>

        {/* Zone 1: Glance Zone - Time Clock Widget (Hero) */}
        <TimeClockWidget
          isClockedIn={isClockedIn}
          clockInTime={todayEntry?.clockIn}
          todayHours={hoursToday}
          weekHours={weekHours}
          avgDayHours={avgDayHours}
          onClockIn={handleClockIn}
          onClockOut={handleClockOut}
          nextShift={
            nextShift
              ? {
                  date: nextShift.date,
                  startTime: nextShift.startTime,
                  endTime: nextShift.endTime,
                }
              : undefined
          }
        />

        {/* Zone 2: Quick Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="mb-4 text-lg font-semibold">Overview</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickStatCard
              icon={Briefcase}
              label="Leave Balance"
              value={`${totalLeaveBalance} days`}
              subtitle="Available across all types"
              color="blue"
              tooltip="Total remaining leave days you can use"
              onClick={() => router.push('/app/leave')}
            />
            <QuickStatCard
              icon={Clock}
              label="Pending Requests"
              value={pendingRequests.length}
              subtitle={
                pendingRequests.length === 1
                  ? '1 request awaiting approval'
                  : `${pendingRequests.length} requests awaiting approval`
              }
              color="orange"
              tooltip="Leave requests waiting for manager approval"
              onClick={() => router.push('/app/leave')}
            />
            <QuickStatCard
              icon={TrendingUp}
              label="This Week"
              value={`${employeeTimeEntries
                .reduce((sum, entry) => sum + entry.totalHours, 0)
                .toFixed(1)}h`}
              subtitle="Total hours logged"
              trend={{ value: 5, label: 'vs last week' }}
              color="green"
              tooltip="Total hours worked this week"
              onClick={() => router.push('/app/timesheet')}
            />
            <QuickStatCard
              icon={DollarSign}
              label="Last Payslip"
              value={`$${latestPayslip?.netPay.toLocaleString()}`}
              subtitle={latestPayslip?.period}
              color="purple"
              tooltip="Your most recent net pay"
              onClick={() => router.push('/app/payroll')}
            />
          </div>
        </motion.div>

        {/* Zone 3: Action Zone & Details */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <div className="space-y-3">
              <ActionButton
                icon={Calendar}
                label="Request Leave"
                onClick={() => router.push('/app/leave')}
                tooltip="Submit a new leave request"
              />
              <ActionButton
                icon={Users}
                label="View Team Schedule"
                onClick={() => router.push('/app/schedule')}
                tooltip="See your team's work schedule"
              />
              <ActionButton
                icon={FileText}
                label="View Payslips"
                onClick={() => router.push('/app/payroll')}
                tooltip="Access your payment history"
              />
              <ActionButton
                icon={Clock}
                label="Timesheet"
                onClick={() => router.push('/app/timesheet')}
                tooltip="View and edit your time entries"
              />
            </div>

            {/* Leave Balance Rings */}
            <Separator className="my-6" />
            <h3 className="text-sm font-semibold text-muted-foreground">
              Leave Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {currentEmployee.leaveBalances.slice(0, 2).map((balance) => (
                <StatsRing
                  key={balance.leaveType}
                  value={balance.remaining}
                  max={balance.total}
                  label={balance.leaveType.replace(' Leave', '')}
                  color={
                    balance.leaveType === 'Annual Leave'
                      ? 'blue'
                      : balance.leaveType === 'Sick Leave'
                        ? 'red'
                        : 'purple'
                  }
                  size="sm"
                />
              ))}
            </div>
          </motion.div>

          {/* Right Column: Upcoming Schedule */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Upcoming Schedule</h2>
              <Link
                href="/app/schedule"
                className="text-sm text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="rounded-2xl border bg-card/50 p-6 backdrop-blur-sm">
              {upcomingShifts.length > 0 ? (
                <div className="space-y-0">
                  {upcomingShifts.map((shift, index) => (
                    <TimelineItem
                      key={shift.id}
                      shift={shift}
                      index={index}
                      isToday={isSameDay(new Date(shift.date), new Date())}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    No upcoming shifts scheduled
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Employee Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-xl border bg-card/30 p-6 backdrop-blur-sm"
        >
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Employment Details
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Department</p>
              <p className="font-semibold">{currentEmployee.department}</p>
            </div>
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Position</p>
              <p className="font-semibold">{currentEmployee.role}</p>
            </div>
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Join Date</p>
              <p className="font-semibold">
                {format(new Date(currentEmployee.joinDate), 'MMM d, yyyy')}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Status</p>
              <p className="font-semibold capitalize">
                {currentEmployee.status.replace('-', ' ')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
