"use client";

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface OpacityControlProps {
  label?: string;
  value: number | undefined;
  onChange: (value: number) => void;
}

/**
 * Opacity control component with slider and numeric input
 *
 * Features:
 * - Slider for visual adjustment (0-1 range)
 * - Numeric input for precise control
 * - Visual feedback with percentage labels
 * - User-friendly for non-technical users
 */
export function OpacityControl({
  label = 'Opacity',
  value = 1,
  onChange,
}: OpacityControlProps) {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow empty string or valid numbers between 0 and 1
    if (inputValue === '' || /^[0-1]?\.?\d*$/.test(inputValue)) {
      const numValue = inputValue === '' ? 0 : parseFloat(inputValue);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
        onChange(numValue);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          className="h-8 text-xs w-16 text-center"
        />
      </div>

      {/* Slider for easy adjustment */}
      <Slider
        value={[value]}
        onValueChange={handleSliderChange}
        min={0}
        max={1}
        step={0.01}
        className="w-full"
      />

      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>0% (Transparent)</span>
        <span>100% (Opaque)</span>
      </div>
    </div>
  );
}
