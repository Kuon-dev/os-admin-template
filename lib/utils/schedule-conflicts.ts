/**
 * Schedule Conflict Detection Utilities
 *
 * Detects and validates scheduling conflicts for employee shifts
 */

import type { Shift, Employee, LeaveRequest } from '@/types/employee';
import { parse, isWithinInterval, areIntervalsOverlapping } from 'date-fns';

export type ConflictType =
  | 'overlapping-shift'
  | 'leave-conflict'
  | 'max-hours-exceeded'
  | 'back-to-back-shifts'
  | 'insufficient-rest';

export interface ShiftConflict {
  type: ConflictType;
  severity: 'error' | 'warning';
  message: string;
  conflictingShift?: Shift;
  conflictingLeave?: LeaveRequest;
  details?: string;
}

/**
 * Parse time string to Date object for comparison
 */
function parseTime(dateStr: string, timeStr: string): Date {
  return parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', new Date());
}

/**
 * Check if two time intervals overlap
 */
function doShiftsOverlap(shift1: Shift, shift2: Shift): boolean {
  if (shift1.date !== shift2.date) return false;

  const start1 = parseTime(shift1.date, shift1.startTime);
  const end1 = parseTime(shift1.date, shift1.endTime);
  const start2 = parseTime(shift2.date, shift2.startTime);
  const end2 = parseTime(shift2.date, shift2.endTime);

  // Handle shifts that span midnight
  let interval1End = end1;
  let interval2End = end2;

  if (end1 < start1) {
    interval1End = new Date(end1.getTime() + 24 * 60 * 60 * 1000);
  }
  if (end2 < start2) {
    interval2End = new Date(end2.getTime() + 24 * 60 * 60 * 1000);
  }

  try {
    return areIntervalsOverlapping(
      { start: start1, end: interval1End },
      { start: start2, end: interval2End },
      { inclusive: false }
    );
  } catch {
    return false;
  }
}

/**
 * Calculate shift duration in hours
 */
function getShiftDuration(shift: Shift): number {
  const start = parseTime(shift.date, shift.startTime);
  const end = parseTime(shift.date, shift.endTime);

  let duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  // Handle shifts that span midnight
  if (duration < 0) {
    duration += 24;
  }

  return duration;
}

/**
 * Check if employee has a leave request on the shift date
 */
function checkLeaveConflict(
  shift: Shift,
  leaveRequests: LeaveRequest[]
): ShiftConflict | null {
  const employeeLeaves = leaveRequests.filter(
    (leave) =>
      leave.employeeId === shift.employeeId &&
      (leave.status === 'approved' || leave.status === 'pending')
  );

  for (const leave of employeeLeaves) {
    try {
      const shiftDate = parse(shift.date, 'yyyy-MM-dd', new Date());
      const leaveStart = parse(leave.startDate, 'yyyy-MM-dd', new Date());
      const leaveEnd = parse(leave.endDate, 'yyyy-MM-dd', new Date());

      if (
        isWithinInterval(shiftDate, {
          start: leaveStart,
          end: leaveEnd,
        })
      ) {
        return {
          type: 'leave-conflict',
          severity: leave.status === 'approved' ? 'error' : 'warning',
          message:
            leave.status === 'approved'
              ? 'Employee has approved leave on this date'
              : 'Employee has pending leave request for this date',
          conflictingLeave: leave,
          details: `${leave.leaveType}: ${leave.startDate} to ${leave.endDate}`,
        };
      }
    } catch {
      // Invalid date format, skip
      continue;
    }
  }

  return null;
}

/**
 * Check if shift overlaps with existing shifts
 */
function checkOverlappingShifts(
  shift: Shift,
  existingShifts: Shift[],
  excludeShiftId?: string
): ShiftConflict | null {
  const employeeShifts = existingShifts.filter(
    (s) =>
      s.employeeId === shift.employeeId &&
      s.id !== excludeShiftId &&
      s.id !== shift.id
  );

  for (const existingShift of employeeShifts) {
    if (doShiftsOverlap(shift, existingShift)) {
      return {
        type: 'overlapping-shift',
        severity: 'error',
        message: 'Shift overlaps with another scheduled shift',
        conflictingShift: existingShift,
        details: `Conflicts with shift from ${existingShift.startTime} to ${existingShift.endTime}`,
      };
    }
  }

  return null;
}

/**
 * Check if employee exceeds maximum weekly hours
 */
function checkMaxHours(
  shift: Shift,
  existingShifts: Shift[],
  maxWeeklyHours: number = 48
): ShiftConflict | null {
  // Get all shifts for this employee in the same week
  const shiftDate = parse(shift.date, 'yyyy-MM-dd', new Date());
  const weekStart = new Date(shiftDate);
  weekStart.setDate(shiftDate.getDate() - shiftDate.getDay()); // Sunday

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // Saturday

  const weekShifts = existingShifts.filter((s) => {
    if (s.employeeId !== shift.employeeId || s.id === shift.id) return false;
    try {
      const sDate = parse(s.date, 'yyyy-MM-dd', new Date());
      return sDate >= weekStart && sDate <= weekEnd;
    } catch {
      return false;
    }
  });

  // Calculate total hours including the new shift
  let totalHours = getShiftDuration(shift);
  weekShifts.forEach((s) => {
    totalHours += getShiftDuration(s);
  });

  if (totalHours > maxWeeklyHours) {
    return {
      type: 'max-hours-exceeded',
      severity: 'warning',
      message: `Weekly hours (${totalHours.toFixed(1)}h) exceed maximum (${maxWeeklyHours}h)`,
      details: `Employee would work ${totalHours.toFixed(1)} hours this week`,
    };
  }

  return null;
}

/**
 * Check if employee has insufficient rest between shifts
 */
function checkRestPeriod(
  shift: Shift,
  existingShifts: Shift[],
  minRestHours: number = 11
): ShiftConflict | null {
  const employeeShifts = existingShifts.filter(
    (s) => s.employeeId === shift.employeeId && s.id !== shift.id
  );

  for (const existingShift of employeeShifts) {
    try {
      const shiftStart = parseTime(shift.date, shift.startTime);
      const existingEnd = parseTime(
        existingShift.date,
        existingShift.endTime
      );

      // Calculate hours between shifts
      const hoursBetween = Math.abs(
        (shiftStart.getTime() - existingEnd.getTime()) / (1000 * 60 * 60)
      );

      // Only check if shifts are within 24 hours of each other
      if (hoursBetween < 24 && hoursBetween < minRestHours) {
        return {
          type: 'insufficient-rest',
          severity: 'warning',
          message: `Less than ${minRestHours} hours rest between shifts`,
          conflictingShift: existingShift,
          details: `Only ${hoursBetween.toFixed(1)} hours between shifts`,
        };
      }
    } catch {
      continue;
    }
  }

  return null;
}

/**
 * Validate shift and return all conflicts
 */
export function validateShift(
  shift: Shift,
  existingShifts: Shift[],
  leaveRequests: LeaveRequest[],
  options: {
    excludeShiftId?: string;
    maxWeeklyHours?: number;
    minRestHours?: number;
    checkLeave?: boolean;
  } = {}
): ShiftConflict[] {
  const {
    excludeShiftId,
    maxWeeklyHours = 48,
    minRestHours = 11,
    checkLeave = true,
  } = options;

  const conflicts: ShiftConflict[] = [];

  // Check overlapping shifts (error)
  const overlapConflict = checkOverlappingShifts(
    shift,
    existingShifts,
    excludeShiftId
  );
  if (overlapConflict) {
    conflicts.push(overlapConflict);
  }

  // Check leave conflicts (error/warning)
  if (checkLeave) {
    const leaveConflict = checkLeaveConflict(shift, leaveRequests);
    if (leaveConflict) {
      conflicts.push(leaveConflict);
    }
  }

  // Check max hours (warning)
  const maxHoursConflict = checkMaxHours(
    shift,
    existingShifts,
    maxWeeklyHours
  );
  if (maxHoursConflict) {
    conflicts.push(maxHoursConflict);
  }

  // Check rest period (warning)
  const restConflict = checkRestPeriod(shift, existingShifts, minRestHours);
  if (restConflict) {
    conflicts.push(restConflict);
  }

  return conflicts;
}

/**
 * Check if conflicts prevent saving the shift
 */
export function hasBlockingConflicts(conflicts: ShiftConflict[]): boolean {
  return conflicts.some((c) => c.severity === 'error');
}

/**
 * Group conflicts by severity
 */
export function groupConflictsBySeverity(conflicts: ShiftConflict[]): {
  errors: ShiftConflict[];
  warnings: ShiftConflict[];
} {
  return {
    errors: conflicts.filter((c) => c.severity === 'error'),
    warnings: conflicts.filter((c) => c.severity === 'warning'),
  };
}

/**
 * Get a summary message for conflicts
 */
export function getConflictSummary(conflicts: ShiftConflict[]): string {
  if (conflicts.length === 0) return 'No conflicts detected';

  const { errors, warnings } = groupConflictsBySeverity(conflicts);

  const parts: string[] = [];

  if (errors.length > 0) {
    parts.push(
      `${errors.length} ${errors.length === 1 ? 'error' : 'errors'}`
    );
  }

  if (warnings.length > 0) {
    parts.push(
      `${warnings.length} ${warnings.length === 1 ? 'warning' : 'warnings'}`
    );
  }

  return parts.join(' and ');
}
