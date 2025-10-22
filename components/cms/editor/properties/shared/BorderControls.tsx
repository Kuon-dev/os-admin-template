"use client";

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DimensionInput } from './DimensionInput';

interface BorderControlsProps {
  label?: string;
  value: string | undefined;
  onChange: (value: string) => void;
}

type BorderStyle = 'none' | 'solid' | 'dashed' | 'dotted';

interface ParsedBorder {
  width: string;
  style: BorderStyle;
  color: string;
}

/**
 * Border controls component that breaks down CSS border into user-friendly inputs
 *
 * Features:
 * - Width slider with unit selector (0-20px)
 * - Style dropdown (none, solid, dashed, dotted)
 * - Color picker
 * - Parses existing border strings (e.g., "1px solid #000")
 * - Outputs combined CSS border value
 */
export function BorderControls({
  label = 'Border',
  value = '',
  onChange,
}: BorderControlsProps) {
  // Parse existing border value
  const parseBorder = (borderValue: string): ParsedBorder => {
    if (!borderValue || borderValue.trim() === '') {
      return { width: '0px', style: 'none', color: '#000000' };
    }

    // Try to parse: "1px solid #000" or similar patterns
    const match = borderValue.match(
      /^(\d+(?:\.\d+)?(?:px|em|rem)?)\s+(none|solid|dashed|dotted)(?:\s+(.+))?$/i
    );

    if (match) {
      return {
        width: match[1] || '1px',
        style: (match[2]?.toLowerCase() as BorderStyle) || 'solid',
        color: match[3] || '#000000',
      };
    }

    // Default fallback
    return { width: '1px', style: 'solid', color: '#000000' };
  };

  const border = parseBorder(value);

  const handleWidthChange = (newWidth: string) => {
    if (border.style === 'none') {
      // If style is none, set to solid when user adds width
      onChange(`${newWidth} solid ${border.color}`);
    } else {
      onChange(`${newWidth} ${border.style} ${border.color}`);
    }
  };

  const handleStyleChange = (newStyle: string) => {
    if (newStyle === 'none') {
      onChange('none');
    } else {
      onChange(`${border.width} ${newStyle} ${border.color}`);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (border.style === 'none') {
      onChange(`${border.width} solid ${newColor}`);
    } else {
      onChange(`${border.width} ${border.style} ${newColor}`);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-xs">{label}</Label>

      {/* Border Width */}
      <DimensionInput
        label="Width"
        value={border.width}
        onChange={handleWidthChange}
        min={0}
        max={20}
        step={1}
      />

      {/* Border Style */}
      <div className="space-y-1">
        <Label className="text-xs">Style</Label>
        <Select value={border.style} onValueChange={handleStyleChange}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Border Color */}
      {border.style !== 'none' && (
        <div className="space-y-1">
          <Label className="text-xs">Color</Label>
          <Input
            type="color"
            value={border.color}
            onChange={handleColorChange}
            className="h-8"
          />
        </div>
      )}
    </div>
  );
}
