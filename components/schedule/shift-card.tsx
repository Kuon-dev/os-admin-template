'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, MapPin } from 'lucide-react';
import type { Shift } from '@/types/employee';

interface ShiftCardProps {
  shift: Shift;
  onClick?: () => void;
}

const getShiftTypeColor = (shiftType: Shift['shiftType']) => {
  switch (shiftType) {
    case 'morning':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
    case 'afternoon':
      return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
    case 'night':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
    case 'full-day':
      return 'bg-green-500/10 text-green-700 dark:text-green-400';
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
  }
};

const getInitials = (name: string) => {
  const parts = name.split(' ');
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`
    : parts[0].slice(0, 2);
};

export function ShiftCard({ shift, onClick }: ShiftCardProps) {
  return (
    <Card
      className="p-3 hover:shadow-md transition-shadow cursor-pointer border-l-4"
      style={{
        borderLeftColor:
          shift.shiftType === 'morning'
            ? '#3b82f6'
            : shift.shiftType === 'afternoon'
              ? '#f97316'
              : shift.shiftType === 'night'
                ? '#a855f7'
                : '#22c55e',
      }}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="text-sm">
            {getInitials(shift.employeeName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="font-medium text-sm truncate">
              {shift.employeeName}
            </p>
            <Badge
              variant="secondary"
              className={`text-xs ${getShiftTypeColor(shift.shiftType)}`}
            >
              {shift.shiftType.replace('-', ' ')}
            </Badge>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <Clock className="h-3 w-3" />
            <span>
              {shift.startTime} - {shift.endTime}
            </span>
          </div>

          {shift.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{shift.location}</span>
            </div>
          )}

          {shift.notes && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {shift.notes}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
