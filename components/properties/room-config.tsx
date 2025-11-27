'use client';

import { Control, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, Minus } from 'lucide-react';

interface RoomConfigProps {
  control: Control<any>;
}

const rooms = [
  { field: 'bedrooms', label: 'Bedrooms', icon: '🛏️' },
  { field: 'bathrooms', label: 'Bathrooms', icon: '🚿' },
  { field: 'halfBathrooms', label: 'Half Bathrooms', icon: '🚽' },
  { field: 'livingRooms', label: 'Living Rooms', icon: '🛋️' },
  { field: 'kitchens', label: 'Kitchens', icon: '🍳' },
  { field: 'parkingSpaces', label: 'Parking Spaces', icon: '🚗' },
];

export function RoomConfig({ control }: RoomConfigProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <Controller
          key={room.field}
          control={control}
          name={room.field}
          render={({ field }) => (
            <div
              className={cn(
                'flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors',
                'border-border bg-background hover:bg-accent/50'
              )}
            >
              <span className="text-xl">{room.icon}</span>
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground">
                  {room.label}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    field.onChange(Math.max(0, (field.value || 0) - 1))
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="0"
                  max="99"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  className="h-8 w-12 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    field.onChange(Math.min(99, (field.value || 0) + 1))
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        />
      ))}
    </div>
  );
}
