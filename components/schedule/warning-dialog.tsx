'use client';

import {
  AlertTriangle,
  AlertCircle,
  Clock,
  Calendar,
  User,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ShiftConflict } from '@/lib/utils/schedule-conflicts';
import { groupConflictsBySeverity } from '@/lib/utils/schedule-conflicts';
import { cn } from '@/lib/utils';

interface WarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conflicts: ShiftConflict[];
  onCancel: () => void;
  onOverride: () => void;
  onEdit?: () => void;
  title?: string;
  description?: string;
  overrideLabel?: string;
  showEditButton?: boolean;
}

export function WarningDialog({
  open,
  onOpenChange,
  conflicts,
  onCancel,
  onOverride,
  onEdit,
  title = 'Schedule Conflicts Detected',
  description = 'The following conflicts were found with this shift. Please review and choose how to proceed.',
  overrideLabel = 'Override Warning',
  showEditButton = true,
}: WarningDialogProps) {
  const { errors, warnings } = groupConflictsBySeverity(conflicts);
  const hasErrors = errors.length > 0;

  const getConflictIcon = (type: ShiftConflict['type']) => {
    switch (type) {
      case 'overlapping-shift':
        return Clock;
      case 'leave-conflict':
        return Calendar;
      case 'max-hours-exceeded':
        return AlertTriangle;
      case 'insufficient-rest':
        return Clock;
      default:
        return AlertCircle;
    }
  };

  const getConflictColor = (severity: 'error' | 'warning') => {
    return severity === 'error'
      ? 'text-destructive'
      : 'text-orange-500 dark:text-orange-400';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle
              className={cn(
                'h-5 w-5',
                hasErrors ? 'text-destructive' : 'text-orange-500'
              )}
            />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

          <div className="py-4">
            <ScrollArea className="max-h-[400px] pr-4">
              <div className="space-y-4">
                {/* Error Conflicts */}
                {errors.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <h4 className="font-semibold text-sm text-destructive">
                        Errors ({errors.length})
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {errors.map((conflict, index) => {
                        const Icon = getConflictIcon(conflict.type);
                        return (
                          <div key={index}>
                            <Alert variant="destructive" className="relative">
                              <Icon className="h-4 w-4" />
                              <AlertDescription className="ml-6">
                                <div className="space-y-1">
                                  <p className="font-medium">
                                    {conflict.message}
                                  </p>
                                  {conflict.details && (
                                    <p className="text-sm opacity-90">
                                      {conflict.details}
                                    </p>
                                  )}
                                  {conflict.conflictingShift && (
                                    <div className="flex items-center gap-2 mt-2 text-xs">
                                      <User className="h-3 w-3" />
                                      <span>
                                        {conflict.conflictingShift.employeeName}
                                      </span>
                                      <Separator
                                        orientation="vertical"
                                        className="h-3"
                                      />
                                      <Clock className="h-3 w-3" />
                                      <span>
                                        {conflict.conflictingShift.startTime} -{' '}
                                        {conflict.conflictingShift.endTime}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </AlertDescription>
                            </Alert>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Warning Conflicts */}
                {warnings.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <h4 className="font-semibold text-sm text-orange-500">
                        Warnings ({warnings.length})
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {warnings.map((conflict, index) => {
                        const Icon = getConflictIcon(conflict.type);
                        return (
                          <div key={index}>
                            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900">
                              <Icon className="h-4 w-4 text-orange-500" />
                              <AlertDescription className="ml-6 text-orange-900 dark:text-orange-100">
                                <div className="space-y-1">
                                  <p className="font-medium">
                                    {conflict.message}
                                  </p>
                                  {conflict.details && (
                                    <p className="text-sm opacity-90">
                                      {conflict.details}
                                    </p>
                                  )}
                                  {conflict.conflictingShift && (
                                    <div className="flex items-center gap-2 mt-2 text-xs">
                                      <User className="h-3 w-3" />
                                      <span>
                                        {conflict.conflictingShift.employeeName}
                                      </span>
                                      <Separator
                                        orientation="vertical"
                                        className="h-3"
                                      />
                                      <Clock className="h-3 w-3" />
                                      <span>
                                        {conflict.conflictingShift.startTime} -{' '}
                                        {conflict.conflictingShift.endTime}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </AlertDescription>
                            </Alert>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter className="flex-row justify-between sm:justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.length} {errors.length === 1 ? 'Error' : 'Errors'}
              </Badge>
              {warnings.length > 0 && (
                <Badge variant="outline" className="gap-1 text-orange-500">
                  <AlertTriangle className="h-3 w-3" />
                  {warnings.length}{' '}
                  {warnings.length === 1 ? 'Warning' : 'Warnings'}
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              {showEditButton && onEdit && (
                <Button variant="outline" onClick={onEdit}>
                  Edit Shift
                </Button>
              )}

              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>

              {!hasErrors && (
                <Button
                  onClick={onOverride}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {overrideLabel}
                </Button>
              )}
            </div>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
