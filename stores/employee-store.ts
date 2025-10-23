import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  Employee,
  Shift,
  LeaveRequest,
  Payslip,
  TimeEntry,
  ShiftType,
} from '@/types/employee';
import { mockEmployees } from '@/lib/mock-data/employees';
import { mockShifts } from '@/lib/mock-data/shifts';
import { mockLeaveRequests } from '@/lib/mock-data/leave-requests';
import { mockPayslips } from '@/lib/mock-data/payslips';
import { mockTimeEntries } from '@/lib/mock-data/time-entries';
import { validateShift, type ShiftConflict } from '@/lib/utils/schedule-conflicts';

// Schedule view types
export type ScheduleView = 'week' | 'month' | 'employee';

// Schedule filter state
export interface ScheduleFilters {
  search: string;
  departments: string[];
  shiftTypes: ShiftType[];
  locations: string[];
  employeeIds: string[];
}

interface EmployeeStore {
  // Data
  employees: Employee[];
  shifts: Shift[];
  leaveRequests: LeaveRequest[];
  payslips: Payslip[];
  timeEntries: TimeEntry[];

  // UI State
  selectedEmployeeId: string | null;
  currentDate: Date;
  scheduleView: ScheduleView;
  scheduleFilters: ScheduleFilters;
  isLoading: boolean;

  // Actions
  actions: {
    // Employee actions
    getEmployeeById: (id: string) => Employee | undefined;
    getEmployeesByDepartment: (department: string) => Employee[];

    // Shift actions - Read
    getShiftsByDate: (date: string) => Shift[];
    getShiftsByEmployeeId: (employeeId: string) => Shift[];
    getShiftsByDateRange: (startDate: string, endDate: string) => Shift[];
    getFilteredShifts: () => Shift[];

    // Shift actions - Create/Update/Delete
    createShift: (shift: Omit<Shift, 'id'>) => { success: boolean; conflicts?: ShiftConflict[]; shiftId?: string };
    updateShift: (id: string, updates: Partial<Shift>) => { success: boolean; conflicts?: ShiftConflict[] };
    deleteShift: (id: string) => void;
    duplicateShift: (id: string, newDate: string) => { success: boolean; conflicts?: ShiftConflict[]; shiftId?: string };
    validateShiftConflicts: (shift: Shift, excludeId?: string) => ShiftConflict[];

    // Leave request actions
    getLeaveRequestsByEmployeeId: (employeeId: string) => LeaveRequest[];
    getPendingLeaveRequests: () => LeaveRequest[];
    approveLeaveRequest: (id: string) => void;
    rejectLeaveRequest: (id: string) => void;
    createLeaveRequest: (
      request: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>
    ) => void;

    // Payslip actions
    getPayslipsByEmployeeId: (employeeId: string) => Payslip[];
    getPayslipById: (id: string) => Payslip | undefined;

    // Time entry actions
    getTimeEntriesByEmployeeId: (employeeId: string) => TimeEntry[];
    clockIn: (employeeId: string) => void;
    clockOut: (employeeId: string) => void;
    updateTimeEntry: (id: string, entry: Partial<TimeEntry>) => void;

    // UI actions
    setSelectedEmployee: (id: string | null) => void;
    setCurrentDate: (date: Date) => void;
    setScheduleView: (view: ScheduleView) => void;
    setScheduleFilters: (filters: Partial<ScheduleFilters>) => void;
    clearScheduleFilters: () => void;
    setLoading: (loading: boolean) => void;
  };
}

export const useEmployeeStore = create<EmployeeStore>()(
  devtools(
    (set, get) => ({
      // Initial data from mock files
      employees: mockEmployees,
      shifts: mockShifts,
      leaveRequests: mockLeaveRequests,
      payslips: mockPayslips,
      timeEntries: mockTimeEntries,

      // UI state
      selectedEmployeeId: null,
      currentDate: new Date(),
      scheduleView: 'week',
      scheduleFilters: {
        search: '',
        departments: [],
        shiftTypes: [],
        locations: [],
        employeeIds: [],
      },
      isLoading: false,

      actions: {
        // Get employee by ID
        getEmployeeById: (id) => {
          return get().employees.find((emp) => emp.id === id);
        },

        // Get employees by department
        getEmployeesByDepartment: (department) => {
          return get().employees.filter((emp) => emp.department === department);
        },

        // Get shifts by date
        getShiftsByDate: (date) => {
          return get().shifts.filter((shift) => shift.date === date);
        },

        // Get shifts by employee ID
        getShiftsByEmployeeId: (employeeId) => {
          return get().shifts.filter((shift) => shift.employeeId === employeeId);
        },

        // Get shifts by date range
        getShiftsByDateRange: (startDate, endDate) => {
          return get().shifts.filter(
            (shift) => shift.date >= startDate && shift.date <= endDate
          );
        },

        // Get filtered shifts based on current filters
        getFilteredShifts: () => {
          const { shifts, scheduleFilters, employees } = get();
          let filtered = [...shifts];

          // Search filter (employee name)
          if (scheduleFilters.search) {
            const searchLower = scheduleFilters.search.toLowerCase();
            filtered = filtered.filter((shift) =>
              shift.employeeName.toLowerCase().includes(searchLower)
            );
          }

          // Department filter
          if (scheduleFilters.departments.length > 0) {
            filtered = filtered.filter((shift) =>
              scheduleFilters.departments.includes(shift.department)
            );
          }

          // Shift type filter
          if (scheduleFilters.shiftTypes.length > 0) {
            filtered = filtered.filter((shift) =>
              scheduleFilters.shiftTypes.includes(shift.shiftType)
            );
          }

          // Location filter
          if (scheduleFilters.locations.length > 0) {
            filtered = filtered.filter(
              (shift) =>
                shift.location &&
                scheduleFilters.locations.includes(shift.location)
            );
          }

          // Employee ID filter
          if (scheduleFilters.employeeIds.length > 0) {
            filtered = filtered.filter((shift) =>
              scheduleFilters.employeeIds.includes(shift.employeeId)
            );
          }

          return filtered;
        },

        // Validate shift for conflicts
        validateShiftConflicts: (shift, excludeId) => {
          const { shifts, leaveRequests } = get();
          return validateShift(shift, shifts, leaveRequests, {
            excludeShiftId: excludeId,
          });
        },

        // Create a new shift
        createShift: (shiftData) => {
          const newShift: Shift = {
            ...shiftData,
            id: `SH${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          };

          // Validate for conflicts
          const conflicts = get().actions.validateShiftConflicts(newShift);

          // If there are blocking errors, return failure
          const hasErrors = conflicts.some((c) => c.severity === 'error');
          if (hasErrors) {
            return { success: false, conflicts };
          }

          // Add the shift
          set((state) => ({
            shifts: [...state.shifts, newShift],
          }));

          return {
            success: true,
            conflicts: conflicts.length > 0 ? conflicts : undefined,
            shiftId: newShift.id,
          };
        },

        // Update an existing shift
        updateShift: (id, updates) => {
          const currentShift = get().shifts.find((s) => s.id === id);
          if (!currentShift) {
            return { success: false };
          }

          const updatedShift = { ...currentShift, ...updates };

          // Validate for conflicts (excluding the current shift)
          const conflicts = get().actions.validateShiftConflicts(
            updatedShift,
            id
          );

          // If there are blocking errors, return failure
          const hasErrors = conflicts.some((c) => c.severity === 'error');
          if (hasErrors) {
            return { success: false, conflicts };
          }

          // Update the shift
          set((state) => ({
            shifts: state.shifts.map((shift) =>
              shift.id === id ? updatedShift : shift
            ),
          }));

          return {
            success: true,
            conflicts: conflicts.length > 0 ? conflicts : undefined,
          };
        },

        // Delete a shift
        deleteShift: (id) => {
          set((state) => ({
            shifts: state.shifts.filter((shift) => shift.id !== id),
          }));
        },

        // Duplicate a shift to a new date
        duplicateShift: (id, newDate) => {
          const originalShift = get().shifts.find((s) => s.id === id);
          if (!originalShift) {
            return { success: false };
          }

          const duplicatedShift: Shift = {
            ...originalShift,
            id: `SH${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
            date: newDate,
          };

          // Validate for conflicts
          const conflicts =
            get().actions.validateShiftConflicts(duplicatedShift);

          // If there are blocking errors, return failure
          const hasErrors = conflicts.some((c) => c.severity === 'error');
          if (hasErrors) {
            return { success: false, conflicts };
          }

          // Add the duplicated shift
          set((state) => ({
            shifts: [...state.shifts, duplicatedShift],
          }));

          return {
            success: true,
            conflicts: conflicts.length > 0 ? conflicts : undefined,
            shiftId: duplicatedShift.id,
          };
        },

        // Get leave requests by employee ID
        getLeaveRequestsByEmployeeId: (employeeId) => {
          return get().leaveRequests.filter(
            (req) => req.employeeId === employeeId
          );
        },

        // Get pending leave requests
        getPendingLeaveRequests: () => {
          return get().leaveRequests.filter((req) => req.status === 'pending');
        },

        // Approve leave request
        approveLeaveRequest: (id) => {
          set((state) => ({
            leaveRequests: state.leaveRequests.map((req) =>
              req.id === id
                ? {
                    ...req,
                    status: 'approved' as const,
                    approvedBy: 'Admin',
                    approvedDate: new Date().toISOString().split('T')[0],
                  }
                : req
            ),
          }));
        },

        // Reject leave request
        rejectLeaveRequest: (id) => {
          set((state) => ({
            leaveRequests: state.leaveRequests.map((req) =>
              req.id === id ? { ...req, status: 'rejected' as const } : req
            ),
          }));
        },

        // Create leave request
        createLeaveRequest: (request) => {
          const newRequest: LeaveRequest = {
            ...request,
            id: `LR${Date.now()}`,
            appliedDate: new Date().toISOString().split('T')[0],
            status: 'pending',
          };

          set((state) => ({
            leaveRequests: [newRequest, ...state.leaveRequests],
          }));
        },

        // Get payslips by employee ID
        getPayslipsByEmployeeId: (employeeId) => {
          return get().payslips.filter((pay) => pay.employeeId === employeeId);
        },

        // Get payslip by ID
        getPayslipById: (id) => {
          return get().payslips.find((pay) => pay.id === id);
        },

        // Get time entries by employee ID
        getTimeEntriesByEmployeeId: (employeeId) => {
          return get().timeEntries.filter(
            (entry) => entry.employeeId === employeeId
          );
        },

        // Clock in
        clockIn: (employeeId) => {
          const now = new Date();
          const today = now.toISOString().split('T')[0];
          const currentTime = now.toTimeString().slice(0, 5);

          // Check if already clocked in today
          const existingEntry = get().timeEntries.find(
            (entry) =>
              entry.employeeId === employeeId &&
              entry.date === today &&
              entry.status === 'clocked-in'
          );

          if (existingEntry) return;

          const newEntry: TimeEntry = {
            id: `TE${Date.now()}`,
            employeeId,
            date: today,
            clockIn: currentTime,
            clockOut: null,
            breakMinutes: 0,
            totalHours: 0,
            status: 'clocked-in',
          };

          set((state) => ({
            timeEntries: [newEntry, ...state.timeEntries],
          }));
        },

        // Clock out
        clockOut: (employeeId) => {
          const now = new Date();
          const today = now.toISOString().split('T')[0];
          const currentTime = now.toTimeString().slice(0, 5);

          set((state) => ({
            timeEntries: state.timeEntries.map((entry) => {
              if (
                entry.employeeId === employeeId &&
                entry.date === today &&
                entry.status === 'clocked-in'
              ) {
                // Calculate total hours
                const clockInTime = new Date(`2000-01-01T${entry.clockIn}`);
                const clockOutTime = new Date(`2000-01-01T${currentTime}`);
                const diffMs = clockOutTime.getTime() - clockInTime.getTime();
                const diffHours = diffMs / (1000 * 60 * 60);
                const totalHours =
                  Math.round((diffHours - entry.breakMinutes / 60) * 100) / 100;

                return {
                  ...entry,
                  clockOut: currentTime,
                  totalHours,
                  status: 'completed' as const,
                };
              }
              return entry;
            }),
          }));
        },

        // Update time entry
        updateTimeEntry: (id, updates) => {
          set((state) => ({
            timeEntries: state.timeEntries.map((entry) =>
              entry.id === id ? { ...entry, ...updates } : entry
            ),
          }));
        },

        // Set selected employee
        setSelectedEmployee: (id) => {
          set({ selectedEmployeeId: id });
        },

        // Set current date (for calendar navigation)
        setCurrentDate: (date) => {
          set({ currentDate: date });
        },

        // Set schedule view
        setScheduleView: (view) => {
          set({ scheduleView: view });
        },

        // Set schedule filters
        setScheduleFilters: (filters) => {
          set((state) => ({
            scheduleFilters: { ...state.scheduleFilters, ...filters },
          }));
        },

        // Clear all schedule filters
        clearScheduleFilters: () => {
          set({
            scheduleFilters: {
              search: '',
              departments: [],
              shiftTypes: [],
              locations: [],
              employeeIds: [],
            },
          });
        },

        // Set loading state
        setLoading: (loading) => {
          set({ isLoading: loading });
        },
      },
    }),
    { name: 'EmployeeStore' }
  )
);

// Selector hooks for better performance
export const useEmployees = () => useEmployeeStore((state) => state.employees);
export const useShifts = () => useEmployeeStore((state) => state.shifts);
export const useLeaveRequests = () =>
  useEmployeeStore((state) => state.leaveRequests);
export const usePayslips = () => useEmployeeStore((state) => state.payslips);
export const useTimeEntries = () =>
  useEmployeeStore((state) => state.timeEntries);
export const useSelectedEmployeeId = () =>
  useEmployeeStore((state) => state.selectedEmployeeId);
export const useCurrentDate = () =>
  useEmployeeStore((state) => state.currentDate);
export const useScheduleView = () =>
  useEmployeeStore((state) => state.scheduleView);
export const useScheduleFilters = () =>
  useEmployeeStore((state) => state.scheduleFilters);
export const useIsLoading = () => useEmployeeStore((state) => state.isLoading);
export const useEmployeeActions = () =>
  useEmployeeStore((state) => state.actions);
