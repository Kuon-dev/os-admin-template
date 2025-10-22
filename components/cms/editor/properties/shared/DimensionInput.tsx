"use client";

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface DimensionInputProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
}

const UNITS = ['px', 'em', 'rem', '%', 'vw', 'vh'] as const;
type Unit = typeof UNITS[number];

/**
 * A dimension input component that combines a slider with a unit selector
 *
 * Features:
 * - Slider for numeric value adjustment (0-200 by default)
 * - Dropdown for unit selection (px, em, rem, %, vw, vh)
 * - Parses existing values to extract number and unit
 * - Small text input for precise value entry
 */
export function DimensionInput({
  label,
  value = '0px',
  onChange,
  min = 0,
  max = 200,
  step = 1,
}: DimensionInputProps) {
  // Parse the value to extract number and unit
  const parseValue = (val: string | undefined): { number: number; unit: Unit } => {
    if (!val) return { number: 0, unit: 'px' };

    const match = val.match(/^(-?\d+(?:\.\d+)?)(px|em|rem|%|vw|vh)?$/);
    if (match) {
      return {
        number: parseFloat(match[1]),
        unit: (match[2] as Unit) || 'px',
      };
    }
    return { number: 0, unit: 'px' };
  };

  const { number, unit } = parseValue(value);

  const handleNumberChange = (newNumbers: number[]) => {
    onChange(`${newNumbers[0]}${unit}`);
  };

  const handleUnitChange = (newUnit: string) => {
    onChange(`${number}${newUnit}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow empty string or valid numbers (including negatives and decimals)
    if (inputValue === '' || /^-?\d*\.?\d*$/.test(inputValue)) {
      const numValue = inputValue === '' ? 0 : parseFloat(inputValue);
      if (!isNaN(numValue)) {
        onChange(`${numValue}${unit}`);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>

      <div className="flex gap-2 items-center">
        {/* Numeric input for precise control */}
        <Input
          type="text"
          value={number}
          onChange={handleInputChange}
          className="h-8 text-xs w-16"
        />

        {/* Unit selector */}
        <Select value={unit} onValueChange={handleUnitChange}>
          <SelectTrigger className="h-8 w-[70px] text-xs" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UNITS.map((u) => (
              <SelectItem key={u} value={u} className="text-xs">
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Slider for easy adjustment */}
      <Slider
        value={[Math.max(min, Math.min(max, number))]}
        onValueChange={handleNumberChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />

      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
