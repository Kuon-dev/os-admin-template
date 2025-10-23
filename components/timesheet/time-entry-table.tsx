'use client';

import { format, startOfWeek, addDays } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { TimeEntry } from '@/types/employee';

interface TimeEntryTableProps {
  timeEntries: TimeEntry[];
  onUpdateEntry?: (id: string, updates: Partial<TimeEntry>) => void;
}

export function TimeEntryTable({
  timeEntries,
  onUpdateEntry,
}: TimeEntryTableProps) {
  // Get current week
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Get entries for the current week
  const weekEntries = weekDays.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return (
      timeEntries.find((entry) => entry.date === dateStr) || {
        id: `temp-${dateStr}`,
        employeeId: '',
        date: dateStr,
        clockIn: null,
        clockOut: null,
        breakMinutes: 0,
        totalHours: 0,
        status: 'completed' as const,
      }
    );
  });

  const totalWeeklyHours = weekEntries.reduce(
    (sum, entry) => sum + (entry.totalHours || 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Clock In</TableHead>
              <TableHead>Clock Out</TableHead>
              <TableHead>Break (mins)</TableHead>
              <TableHead>Total Hours</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {weekEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">
                  {format(new Date(entry.date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{format(new Date(entry.date), 'EEEE')}</TableCell>
                <TableCell>
                  {entry.clockIn ? (
                    <Input
                      type="time"
                      value={entry.clockIn}
                      onChange={(e) =>
                        onUpdateEntry?.(entry.id, { clockIn: e.target.value })
                      }
                      className="w-32"
                      disabled={!entry.clockIn}
                    />
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {entry.clockOut ? (
                    <Input
                      type="time"
                      value={entry.clockOut}
                      onChange={(e) =>
                        onUpdateEntry?.(entry.id, { clockOut: e.target.value })
                      }
                      className="w-32"
                      disabled={!entry.clockOut}
                    />
                  ) : entry.status === 'clocked-in' ? (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                      In Progress
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {entry.clockIn ? (
                    <Input
                      type="number"
                      value={entry.breakMinutes}
                      onChange={(e) =>
                        onUpdateEntry?.(entry.id, {
                          breakMinutes: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-20"
                      disabled={entry.status === 'clocked-in'}
                    />
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="font-semibold">
                  {entry.totalHours > 0
                    ? entry.totalHours.toFixed(2)
                    : '-'}
                </TableCell>
                <TableCell>
                  {entry.status === 'clocked-in' ? (
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-700">
                      Clocked In
                    </Badge>
                  ) : entry.status === 'completed' && entry.clockIn ? (
                    <Badge variant="secondary" className="bg-gray-500/10">
                      Completed
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {/* Total Row */}
            <TableRow className="bg-muted/50 font-semibold">
              <TableCell colSpan={5} className="text-right">
                Weekly Total
              </TableCell>
              <TableCell>{totalWeeklyHours.toFixed(2)} hours</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
