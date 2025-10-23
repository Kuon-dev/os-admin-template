'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ShiftCardEnhanced } from './shift-card-enhanced';
import { ShiftDialog } from './shift-dialog';
import { NoShiftsEmptyState } from './empty-state';
import {
  useEmployees,
  useEmployeeActions,
} from '@/stores/employee-store';
import type { Shift } from '@/types/employee';
import { fadeIn, staggerChildren, listItem } from '@/lib/utils/motion';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

const getInitials = (name: string) => {
  const parts = name.split(' ');
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`
    : parts[0].slice(0, 2);
};

export function EmployeeView() {
  const employees = useEmployees();
  const { getFilteredShifts, deleteShift, duplicateShift } = useEmployeeActions();

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);
  const allShifts = getFilteredShifts();
  const employeeShifts = selectedEmployeeId
    ? allShifts
        .filter((shift) => shift.employeeId === selectedEmployeeId)
        .sort((a, b) => a.date.localeCompare(b.date))
    : [];

  const handleAddShift = () => {
    setEditingShift(null);
    setShiftDialogOpen(true);
  };

  const handleEditShift = (shift: Shift) => {
    setEditingShift(shift);
    setShiftDialogOpen(true);
  };

  const handleDeleteShift = (shift: Shift) => {
    if (confirm(`Are you sure you want to delete this shift?`)) {
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

  // Group shifts by date
  const shiftsByDate = employeeShifts.reduce((acc, shift) => {
    if (!acc[shift.date]) {
      acc[shift.date] = [];
    }
    acc[shift.date].push(shift);
    return acc;
  }, {} as Record<string, Shift[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
            <SelectTrigger>
              <SelectValue placeholder="Select an employee" />
            </SelectTrigger>
            <SelectContent>
              {employees
                .filter((emp) => emp.status === 'active')
                .map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{employee.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {employee.department}
                      </span>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEmployeeId && (
          <Button onClick={handleAddShift} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Shift
          </Button>
        )}
      </div>

      {/* Employee Info Card */}
      {selectedEmployee && (
        <motion.div {...fadeIn}>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {getInitials(selectedEmployee.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{selectedEmployee.name}</h2>
                <p className="text-muted-foreground">
                  {selectedEmployee.role} • {selectedEmployee.department}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Shifts</p>
                <p className="text-3xl font-bold">{employeeShifts.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Shifts Timeline */}
      {selectedEmployeeId && (
        <div className="space-y-6">
          {employeeShifts.length > 0 ? (
            <motion.div {...staggerChildren(50)} className="space-y-6">
              {Object.entries(shiftsByDate).map(([date, shifts]) => (
                <motion.div key={date} {...listItem} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 text-right w-24">
                      <p className="text-sm font-medium">
                        {format(parseISO(date), 'MMM d')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(date), 'EEEE')}
                      </p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {shifts.map((shift) => (
                        <ShiftCardEnhanced
                          key={shift.id}
                          shift={shift}
                          onClick={() => handleEditShift(shift)}
                          onEdit={handleEditShift}
                          onDelete={handleDeleteShift}
                          onDuplicate={handleDuplicateShift}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <NoShiftsEmptyState onAddShift={handleAddShift} />
          )}
        </div>
      )}

      {/* Empty State - No Employee Selected */}
      {!selectedEmployeeId && (
        <motion.div {...fadeIn}>
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-muted p-6">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Select an Employee</h3>
                <p className="text-muted-foreground">
                  Choose an employee from the dropdown above to view their schedule
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Shift Dialog */}
      <ShiftDialog
        open={shiftDialogOpen}
        onOpenChange={setShiftDialogOpen}
        shift={editingShift}
        onSuccess={() => {
          setShiftDialogOpen(false);
          setEditingShift(null);
        }}
      />
    </div>
  );
}
