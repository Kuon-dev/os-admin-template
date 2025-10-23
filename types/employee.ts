// Employee Management System Types

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  avatar?: string;
  joinDate: string;
  phoneNumber?: string;
  employeeNumber: string;
  status: 'active' | 'inactive' | 'on-leave';
  leaveBalances: LeaveBalance[];
}

export interface LeaveBalance {
  leaveType: string;
  total: number;
  used: number;
  remaining: number;
}

export interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  date: string;
  startTime: string;
  endTime: string;
  shiftType: 'morning' | 'afternoon' | 'night' | 'full-day';
  department: string;
  location?: string;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  isHalfDay: boolean;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  department: string;
  period: string; // "January 2025"
  payDate: string;
  earnings: {
    basicSalary: number;
    overtime: number;
    bonus: number;
    allowances: number;
  };
  deductions: {
    incomeTax: number;
    socialSecurity: number;
    healthInsurance: number;
    other: number;
  };
  netPay: number;
  ytd: {
    grossPay: number;
    deductions: number;
    netPay: number;
  };
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  breakMinutes: number;
  totalHours: number;
  status: 'clocked-in' | 'clocked-out' | 'completed';
  notes?: string;
}

export interface Department {
  id: string;
  name: string;
  managerName?: string;
  employeeCount: number;
}

export type LeaveType =
  | 'Annual Leave'
  | 'Sick Leave'
  | 'Personal Leave'
  | 'Parental Leave'
  | 'Unpaid Leave';

export type ShiftType = 'morning' | 'afternoon' | 'night' | 'full-day';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';
