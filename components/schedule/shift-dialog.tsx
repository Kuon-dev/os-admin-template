'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarPlus, Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  useEmployees,
  useEmployeeActions,
} from '@/stores/employee-store';
import type { Shift, ShiftType } from '@/types/employee';
import type { ShiftConflict } from '@/lib/utils/schedule-conflicts';
import { WarningDialog } from './warning-dialog';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ShiftFormData {
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  shiftType: ShiftType;
  location: string;
  notes: string;
}

interface ShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift?: Shift | null;
  defaultDate?: string;
  onSuccess?: () => void;
}

const shiftTypes: { value: ShiftType; label: string }[] = [
  { value: 'morning', label: 'Morning Shift' },
  { value: 'afternoon', label: 'Afternoon Shift' },
  { value: 'night', label: 'Night Shift' },
  { value: 'full-day', label: 'Full Day' },
];

const commonLocations = [
  'Office - Floor 1',
  'Office - Floor 2',
  'Office - Floor 3',
  'Office - Floor 4',
  'Remote',
];

export function ShiftDialog({
  open,
  onOpenChange,
  shift,
  defaultDate,
  onSuccess,
}: ShiftDialogProps) {
  const employees = useEmployees();
  const { createShift, updateShift, validateShiftConflicts } =
    useEmployeeActions();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflicts, setConflicts] = useState<ShiftConflict[]>([]);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [pendingShiftData, setPendingShiftData] = useState<ShiftFormData | null>(
    null
  );

  const isEditing = !!shift;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ShiftFormData>({
    defaultValues: {
      employeeId: shift?.employeeId || '',
      date: shift?.date || defaultDate || format(new Date(), 'yyyy-MM-dd'),
      startTime: shift?.startTime || '09:00',
      endTime: shift?.endTime || '17:00',
      shiftType: shift?.shiftType || 'full-day',
      location: shift?.location || '',
      notes: shift?.notes || '',
    },
  });

  // Watch form values for real-time validation
  const watchedValues = watch();

  // Reset form when dialog opens/closes or shift changes
  useEffect(() => {
    if (open) {
      reset({
        employeeId: shift?.employeeId || '',
        date: shift?.date || defaultDate || format(new Date(), 'yyyy-MM-dd'),
        startTime: shift?.startTime || '09:00',
        endTime: shift?.endTime || '17:00',
        shiftType: shift?.shiftType || 'full-day',
        location: shift?.location || '',
        notes: shift?.notes || '',
      });
      setConflicts([]);
    }
  }, [open, shift, defaultDate, reset]);

  // Real-time conflict validation (debounced)
  useEffect(() => {
    if (!open || !watchedValues.employeeId) return;

    const timer = setTimeout(() => {
      const employee = employees.find((e) => e.id === watchedValues.employeeId);
      if (!employee) return;

      const testShift: Shift = {
        id: shift?.id || 'temp',
        employeeId: watchedValues.employeeId,
        employeeName: employee.name,
        employeeAvatar: employee.avatar,
        date: watchedValues.date,
        startTime: watchedValues.startTime,
        endTime: watchedValues.endTime,
        shiftType: watchedValues.shiftType,
        department: employee.department,
        location: watchedValues.location,
        notes: watchedValues.notes,
      };

      const detectedConflicts = validateShiftConflicts(testShift, shift?.id);
      setConflicts(detectedConflicts);
    }, 500);

    return () => clearTimeout(timer);
  }, [
    watchedValues,
    open,
    employees,
    validateShiftConflicts,
    shift?.id,
  ]);

  const onSubmit = async (data: ShiftFormData) => {
    const employee = employees.find((e) => e.id === data.employeeId);
    if (!employee) {
      toast.error('Please select a valid employee');
      return;
    }

    const shiftData: Omit<Shift, 'id'> = {
      employeeId: data.employeeId,
      employeeName: employee.name,
      employeeAvatar: employee.avatar,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      shiftType: data.shiftType,
      department: employee.department,
      location: data.location,
      notes: data.notes,
    };

    setIsSubmitting(true);

    try {
      let result;

      if (isEditing && shift) {
        result = updateShift(shift.id, shiftData);
      } else {
        result = createShift(shiftData);
      }

      if (!result.success) {
        // Show warning dialog for conflicts
        setPendingShiftData(data);
        setShowWarningDialog(true);
        setIsSubmitting(false);
        return;
      }

      // Success (might have warnings but no errors)
      if (result.conflicts && result.conflicts.length > 0) {
        // Show warning dialog for non-blocking conflicts
        setPendingShiftData(data);
        setShowWarningDialog(true);
        setIsSubmitting(false);
        return;
      }

      // Complete success
      toast.success(
        isEditing ? 'Shift updated successfully' : 'Shift created successfully'
      );
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverrideWarning = async () => {
    // This would be called if we allow overriding warnings
    // For now, just close the dialogs
    setShowWarningDialog(false);
    onOpenChange(false);
    onSuccess?.();
    toast.success(
      isEditing ? 'Shift updated with warnings' : 'Shift created with warnings'
    );
  };

  const hasErrors = conflicts.some((c) => c.severity === 'error');
  const hasWarnings = conflicts.some((c) => c.severity === 'warning');

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5" />
              {isEditing ? 'Edit Shift' : 'Create New Shift'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update the shift details below.'
                : 'Fill in the details to create a new shift.'}
            </DialogDescription>
          </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
              {/* Real-time Conflict Alerts */}
              {conflicts.length > 0 && (
                <div>
                  <Alert
                    variant={hasErrors ? 'destructive' : 'default'}
                    className={cn(
                      !hasErrors &&
                        'border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900'
                    )}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="ml-6">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {hasErrors
                            ? 'Conflicts detected that prevent saving'
                            : 'Warnings detected'}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {hasErrors && (
                            <Badge variant="destructive" className="text-xs">
                              {conflicts.filter((c) => c.severity === 'error').length}{' '}
                              Error(s)
                            </Badge>
                          )}
                          {hasWarnings && (
                            <Badge
                              variant="outline"
                              className="text-xs text-orange-600"
                            >
                              {conflicts.filter((c) => c.severity === 'warning').length}{' '}
                              Warning(s)
                            </Badge>
                          )}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Employee Selection */}
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="employee">
                    Employee <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={watchedValues.employeeId}
                    onValueChange={(value) => setValue('employeeId', value)}
                  >
                    <SelectTrigger id="employee">
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees
                        .filter((emp) => emp.status === 'active')
                        .map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{employee.name}</span>
                              <span className="text-xs text-muted-foreground ml-4">
                                {employee.department}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.employeeId && (
                    <p className="text-sm text-destructive">
                      {errors.employeeId.message}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">
                    Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    {...register('date', { required: 'Date is required' })}
                  />
                  {errors.date && (
                    <p className="text-sm text-destructive">{errors.date.message}</p>
                  )}
                </div>

                {/* Shift Type */}
                <div className="space-y-2">
                  <Label htmlFor="shiftType">
                    Shift Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={watchedValues.shiftType}
                    onValueChange={(value) => setValue('shiftType', value as ShiftType)}
                  >
                    <SelectTrigger id="shiftType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {shiftTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Start Time */}
                <div className="space-y-2">
                  <Label htmlFor="startTime">
                    Start Time <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    {...register('startTime', { required: 'Start time is required' })}
                  />
                  {errors.startTime && (
                    <p className="text-sm text-destructive">
                      {errors.startTime.message}
                    </p>
                  )}
                </div>

                {/* End Time */}
                <div className="space-y-2">
                  <Label htmlFor="endTime">
                    End Time <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    {...register('endTime', { required: 'End time is required' })}
                  />
                  {errors.endTime && (
                    <p className="text-sm text-destructive">
                      {errors.endTime.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={watchedValues.location}
                    onValueChange={(value) => setValue('location', value)}
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select or enter a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonLocations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Or type a custom location"
                    {...register('location')}
                    className="mt-2"
                  />
                </div>

                {/* Notes */}
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional notes or instructions..."
                    rows={3}
                    {...register('notes')}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || hasErrors || !watchedValues.employeeId}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? 'Update Shift' : 'Create Shift'}
                </Button>
              </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

      {/* Warning Dialog for Conflicts */}
      {showWarningDialog && conflicts.length > 0 && (
        <WarningDialog
          open={showWarningDialog}
          onOpenChange={setShowWarningDialog}
          conflicts={conflicts}
          onCancel={() => {
            setShowWarningDialog(false);
            setPendingShiftData(null);
          }}
          onOverride={handleOverrideWarning}
          onEdit={() => {
            setShowWarningDialog(false);
            // Keep the shift dialog open for editing
          }}
          showEditButton={true}
        />
      )}
    </>
  );
}
