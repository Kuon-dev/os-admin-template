import { Shift } from '@/types/employee';
import { addDays, format, subDays, startOfWeek } from 'date-fns';

const today = new Date();
const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday

// Helper function to generate a date for the current week
const weekDay = (offset: number) => format(addDays(currentWeekStart, offset), 'yyyy-MM-dd');

export const mockShifts: Shift[] = [
  // CURRENT WEEK - Monday (offset 0)
  {
    id: 'SH101',
    employeeId: 'EMP001',
    employeeName: 'John Smith',
    date: weekDay(0),
    startTime: '09:00',
    endTime: '17:00',
    shiftType: 'full-day',
    department: 'Engineering',
    location: 'Office - Floor 3',
  },
  {
    id: 'SH102',
    employeeId: 'EMP003',
    employeeName: 'Michael Chen',
    date: weekDay(0),
    startTime: '09:00',
    endTime: '17:00',
    shiftType: 'full-day',
    department: 'Engineering',
    location: 'Remote',
  },

  // CURRENT WEEK - Tuesday (offset 1)
  {
    id: 'SH103',
    employeeId: 'EMP002',
    employeeName: 'Sarah Johnson',
    date: weekDay(1),
    startTime: '10:00',
    endTime: '18:00',
    shiftType: 'full-day',
    department: 'Design',
    location: 'Office - Floor 2',
  },
  {
    id: 'SH104',
    employeeId: 'EMP004',
    employeeName: 'Emily Davis',
    date: weekDay(1),
    startTime: '08:00',
    endTime: '16:00',
    shiftType: 'morning',
    department: 'Marketing',
    location: 'Office - Floor 1',
  },

  // CURRENT WEEK - Wednesday (offset 2)
  {
    id: 'SH105',
    employeeId: 'EMP007',
    employeeName: 'Robert Taylor',
    date: weekDay(2),
    startTime: '10:00',
    endTime: '18:00',
    shiftType: 'full-day',
    department: 'Engineering',
    location: 'Office - Floor 3',
  },
  {
    id: 'SH106',
    employeeId: 'EMP008',
    employeeName: 'Jennifer Martinez',
    date: weekDay(2),
    startTime: '09:00',
    endTime: '17:00',
    shiftType: 'full-day',
    department: 'Design',
    location: 'Office - Floor 2',
  },

  // CURRENT WEEK - Thursday (offset 3)
  {
    id: 'SH107',
    employeeId: 'EMP001',
    employeeName: 'John Smith',
    date: weekDay(3),
    startTime: '09:00',
    endTime: '17:00',
    shiftType: 'full-day',
    department: 'Engineering',
    location: 'Office - Floor 3',
  },
  {
    id: 'SH108',
    employeeId: 'EMP010',
    employeeName: 'Maria Garcia',
    date: weekDay(3),
    startTime: '14:00',
    endTime: '22:00',
    shiftType: 'afternoon',
    department: 'Customer Support',
    location: 'Office - Floor 1',
  },
  {
    id: 'SH109',
    employeeId: 'EMP006',
    employeeName: 'Lisa Anderson',
    date: weekDay(3),
    startTime: '09:00',
    endTime: '17:00',
    shiftType: 'full-day',
    department: 'Sales',
    location: 'Office - Floor 1',
  },

  // CURRENT WEEK - Friday (offset 4)
  {
    id: 'SH110',
    employeeId: 'EMP003',
    employeeName: 'Michael Chen',
    date: weekDay(4),
    startTime: '09:00',
    endTime: '17:00',
    shiftType: 'full-day',
    department: 'Engineering',
    location: 'Remote',
  },
  {
    id: 'SH111',
    employeeId: 'EMP002',
    employeeName: 'Sarah Johnson',
    date: weekDay(4),
    startTime: '10:00',
    endTime: '18:00',
    shiftType: 'full-day',
    department: 'Design',
    location: 'Office - Floor 2',
  },
  {
    id: 'SH112',
    employeeId: 'EMP005',
    employeeName: 'David Wilson',
    date: weekDay(4),
    startTime: '08:00',
    endTime: '16:00',
    shiftType: 'morning',
    department: 'HR',
    location: 'Office - Floor 1',
  },

  // CURRENT WEEK - Saturday (offset 5)
  {
    id: 'SH113',
    employeeId: 'EMP010',
    employeeName: 'Maria Garcia',
    date: weekDay(5),
    startTime: '22:00',
    endTime: '06:00',
    shiftType: 'night',
    department: 'Customer Support',
    location: 'Office - Floor 1',
    notes: 'Weekend night shift',
  },

  // CURRENT WEEK - Sunday (offset 6)
  {
    id: 'SH114',
    employeeId: 'EMP009',
    employeeName: 'James Brown',
    date: weekDay(6),
    startTime: '09:00',
    endTime: '17:00',
    shiftType: 'full-day',
    department: 'Finance',
    location: 'Office - Floor 4',
  },

  // NEXT WEEK - for testing navigation (Monday)
  {
    id: 'SH201',
    employeeId: 'EMP001',
    employeeName: 'John Smith',
    date: format(addDays(currentWeekStart, 7), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '17:00',
    shiftType: 'full-day',
    department: 'Engineering',
    location: 'Office - Floor 3',
  },
  {
    id: 'SH202',
    employeeId: 'EMP003',
    employeeName: 'Michael Chen',
    date: format(addDays(currentWeekStart, 7), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '17:00',
    shiftType: 'full-day',
    department: 'Engineering',
    location: 'Remote',
  },
  {
    id: 'SH203',
    employeeId: 'EMP002',
    employeeName: 'Sarah Johnson',
    date: format(addDays(currentWeekStart, 8), 'yyyy-MM-dd'),
    startTime: '10:00',
    endTime: '18:00',
    shiftType: 'full-day',
    department: 'Design',
    location: 'Office - Floor 2',
  },

  // PREVIOUS WEEK - for testing navigation (Monday)
  {
    id: 'SH301',
    employeeId: 'EMP001',
    employeeName: 'John Smith',
    date: format(subDays(currentWeekStart, 7), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '17:00',
    shiftType: 'full-day',
    department: 'Engineering',
    location: 'Office - Floor 3',
  },
  {
    id: 'SH302',
    employeeId: 'EMP004',
    employeeName: 'Emily Davis',
    date: format(subDays(currentWeekStart, 6), 'yyyy-MM-dd'),
    startTime: '08:00',
    endTime: '16:00',
    shiftType: 'morning',
    department: 'Marketing',
    location: 'Office - Floor 1',
  },
];
