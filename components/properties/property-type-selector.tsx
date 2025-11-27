'use client';

import { Control, Controller } from 'react-hook-form';
import type { PropertyType } from '@/types/property';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PropertyTypeSelectorProps {
  control: Control<any>;
  name: string;
}

const propertyTypes: { value: PropertyType; label: string; icon: string }[] = [
  { value: 'apartment', label: 'Apartment', icon: '🏢' },
  { value: 'condo', label: 'Condo', icon: '🏘️' },
  { value: 'house', label: 'House', icon: '🏠' },
  { value: 'villa', label: 'Villa', icon: '🏰' },
  { value: 'townhouse', label: 'Townhouse', icon: '🏘️' },
  { value: 'studio', label: 'Studio', icon: '🏢' },
  { value: 'penthouse', label: 'Penthouse', icon: '🌆' },
  { value: 'land', label: 'Land', icon: '🏞️' },
];

export function PropertyTypeSelector({
  control,
  name,
}: PropertyTypeSelectorProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {propertyTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => field.onChange(type.value)}
              className={cn(
                'relative flex flex-col items-center justify-center rounded-lg border-2 px-4 py-4 transition-all duration-200',
                field.value === type.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-transparent hover:border-primary hover:bg-accent'
              )}
            >
              <span className="text-3xl mb-2">{type.icon}</span>
              <span
                className={cn(
                  'text-sm font-medium transition-colors',
                  field.value === type.value
                    ? 'text-primary'
                    : 'text-foreground'
                )}
              >
                {type.label}
              </span>
              {field.value === type.value && (
                <Check className="absolute top-2 right-2 h-5 w-5 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    />
  );
}
