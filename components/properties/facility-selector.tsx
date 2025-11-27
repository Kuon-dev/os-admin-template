'use client';

import { Control, Controller } from 'react-hook-form';
import type { Facility } from '@/types/property';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface FacilitySelectorProps {
  control: Control<any>;
  name: string;
}

const facilities: { value: Facility; label: string; icon: string }[] = [
  { value: 'pool', label: 'Swimming Pool', icon: '🏊' },
  { value: 'gym', label: 'Gym', icon: '🏋️' },
  { value: 'security', label: '24/7 Security', icon: '🔒' },
  { value: 'garden', label: 'Garden', icon: '🌳' },
  { value: 'balcony', label: 'Balcony', icon: '🏞️' },
  { value: 'elevator', label: 'Elevator', icon: '🛗' },
  { value: 'air_conditioning', label: 'Air Conditioning', icon: '❄️' },
  { value: 'heating', label: 'Heating', icon: '🔥' },
  { value: 'furnished', label: 'Furnished', icon: '🛋️' },
  { value: 'pet_friendly', label: 'Pet Friendly', icon: '🐕' },
  { value: 'internet', label: 'Internet', icon: '📡' },
  { value: 'cable_tv', label: 'Cable TV', icon: '📺' },
  { value: 'laundry', label: 'Laundry', icon: '🧺' },
  { value: 'storage', label: 'Storage', icon: '📦' },
  { value: 'fireplace', label: 'Fireplace', icon: '🔥' },
  { value: 'view', label: 'View', icon: '🌊' },
  { value: 'playground', label: 'Playground', icon: '🎪' },
  { value: 'bbq', label: 'BBQ Area', icon: '🍖' },
  { value: 'concierge', label: 'Concierge', icon: '🎩' },
  { value: 'guest_parking', label: 'Guest Parking', icon: '🅿️' },
];

export function FacilitySelector({
  control,
  name,
}: FacilitySelectorProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {facilities.map((facility) => {
            const isSelected = field.value.includes(facility.value);
            return (
              <button
                key={facility.value}
                type="button"
                onClick={() => {
                  const newValue = isSelected
                    ? field.value.filter((f: Facility) => f !== facility.value)
                    : [...field.value, facility.value];
                  field.onChange(newValue);
                }}
                className={cn(
                  'relative flex flex-col items-center justify-center rounded-lg border-2 px-3 py-4 transition-all duration-200 min-h-[100px]',
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-transparent hover:border-primary hover:bg-accent'
                )}
              >
                <span className="text-2xl mb-2">{facility.icon}</span>
                <span
                  className={cn(
                    'text-xs font-medium text-center transition-colors line-clamp-2',
                    isSelected ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {facility.label}
                </span>
                {isSelected && (
                  <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    />
  );
}
