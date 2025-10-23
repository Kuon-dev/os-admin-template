'use client';

import { useState } from 'react';
import {
  Clock,
  MapPin,
  GripVertical,
  Edit,
  Trash2,
  Copy,
  AlertTriangle,
  CalendarDays,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Shift } from '@/types/employee';
import { cn } from '@/lib/utils';

interface ShiftCardEnhancedProps {
  shift: Shift;
  onClick?: () => void;
  onEdit?: (shift: Shift) => void;
  onDelete?: (shift: Shift) => void;
  onDuplicate?: (shift: Shift) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
  hasConflict?: boolean;
  conflictMessage?: string;
}

const getShiftTypeColor = (shiftType: Shift['shiftType']) => {
  switch (shiftType) {
    case 'morning':
      return {
        badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        border: '#3b82f6',
      };
    case 'afternoon':
      return {
        badge: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
        border: '#f97316',
      };
    case 'night':
      return {
        badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
        border: '#a855f7',
      };
    case 'full-day':
      return {
        badge: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
        border: '#22c55e',
      };
    default:
      return {
        badge: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800',
        border: '#6b7280',
      };
  }
};

const getInitials = (name: string) => {
  const parts = name.split(' ');
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`
    : parts[0].slice(0, 2);
};

export function ShiftCardEnhanced({
  shift,
  onClick,
  onEdit,
  onDelete,
  onDuplicate,
  isDragging = false,
  dragHandleProps,
  hasConflict = false,
  conflictMessage,
}: ShiftCardEnhancedProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const colors = getShiftTypeColor(shift.shiftType);
  const canInteract = onEdit || onDelete || onDuplicate;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger onClick if clicking on buttons or dropdown
    if (
      e.target instanceof HTMLElement &&
      (e.target.closest('button') || e.target.closest('[role="menuitem"]'))
    ) {
      return;
    }
    onClick?.();
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowActions(false);
        }}
        className="group relative"
      >
        <Card
          className={cn(
            'relative overflow-hidden border-l-4 transition-all cursor-pointer',
            'hover:shadow-md',
            isDragging && 'opacity-50 cursor-grabbing',
            hasConflict && 'ring-2 ring-orange-500 ring-offset-2'
          )}
          style={{
            borderLeftColor: colors.border,
          }}
          onClick={handleCardClick}
        >
          {/* Conflict Warning Badge */}
          {hasConflict && (
            <div className="absolute top-2 right-2 z-10">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className="bg-orange-500/10 border-orange-500 text-orange-700 dark:text-orange-400 gap-1"
                  >
                    <AlertTriangle className="h-3 w-3" />
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  {conflictMessage || 'This shift has scheduling conflicts'}
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          <div className="p-3 space-y-2">
            {/* Header with Avatar and Shift Type */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Drag Handle */}
                {dragHandleProps && (
                  <div
                    {...dragHandleProps}
                    className="cursor-grab active:cursor-grabbing transition-opacity"
                    style={{ opacity: isHovered ? 1 : 0 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-muted-foreground hover:text-foreground transition-colors">
                          <GripVertical className="h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        Drag to reschedule
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}

                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="text-sm font-medium">
                    {getInitials(shift.employeeName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {shift.employeeName}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn('text-xs mt-1', colors.badge)}
                  >
                    {shift.shiftType.replace('-', ' ')}
                  </Badge>
                </div>
              </div>

              {/* Quick Actions Menu */}
              {canInteract && (isHovered || showActions) && (
                <div>
                  <DropdownMenu
                    open={showActions}
                    onOpenChange={setShowActions}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActions(!showActions);
                        }}
                      >
                        <span className="sr-only">Open menu</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      {onEdit && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(shift);
                            setShowActions(false);
                          }}
                          className="gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                      )}
                      {onDuplicate && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate(shift);
                            setShowActions(false);
                          }}
                          className="gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          <span>Duplicate</span>
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(shift);
                              setShowActions(false);
                            }}
                            className="gap-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {/* Shift Details */}
            <div className="space-y-1.5 pl-13">
              {/* Time */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                <span>
                  {shift.startTime} - {shift.endTime}
                </span>
              </div>

              {/* Location */}
              {shift.location && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{shift.location}</span>
                </div>
              )}

              {/* Notes */}
              {shift.notes && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground line-clamp-2 cursor-help">
                      {shift.notes}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-sm">{shift.notes}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Hover Indicator */}
          {isHovered && !isDragging && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </Card>
      </div>
    </TooltipProvider>
  );
}
