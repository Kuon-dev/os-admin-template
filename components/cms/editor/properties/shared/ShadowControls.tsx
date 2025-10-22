"use client";

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ShadowControlsProps {
  label?: string;
  value: string | undefined;
  onChange: (value: string) => void;
}

interface ParsedShadow {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
}

/**
 * Shadow controls component that breaks down CSS box-shadow into user-friendly sliders
 *
 * Features:
 * - Horizontal offset slider (-50 to 50px)
 * - Vertical offset slider (-50 to 50px)
 * - Blur radius slider (0-100px)
 * - Spread radius slider (-50 to 50px)
 * - Color picker
 * - "None" preset button to clear shadow
 * - Parses existing shadow strings (e.g., "0 4px 6px rgba(0,0,0,0.1)")
 * - Outputs combined CSS box-shadow value
 */
export function ShadowControls({
  label = 'Shadow',
  value = '',
  onChange,
}: ShadowControlsProps) {
  // Parse existing shadow value
  const parseShadow = (shadowValue: string): ParsedShadow => {
    if (!shadowValue || shadowValue.trim() === '' || shadowValue === 'none') {
      return { x: 0, y: 0, blur: 0, spread: 0, color: 'rgba(0, 0, 0, 0.1)' };
    }

    // Try to parse: "0px 4px 6px 0px rgba(0,0,0,0.1)" or similar patterns
    // Pattern: h-offset v-offset blur spread color
    const match = shadowValue.match(
      /^(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)(?:\s+(-?\d+(?:\.\d+)?(?:px)?))?(?:\s+(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|[a-z]+))?$/
    );

    if (match) {
      return {
        x: parseFloat(match[1]) || 0,
        y: parseFloat(match[2]) || 0,
        blur: parseFloat(match[3]) || 0,
        spread: match[4] ? parseFloat(match[4]) : 0,
        color: match[5] || 'rgba(0, 0, 0, 0.1)',
      };
    }

    // Default fallback
    return { x: 0, y: 4, blur: 6, spread: 0, color: 'rgba(0, 0, 0, 0.1)' };
  };

  const shadow = parseShadow(value);

  const buildShadowString = (s: ParsedShadow): string => {
    if (s.x === 0 && s.y === 0 && s.blur === 0 && s.spread === 0) {
      return 'none';
    }
    return `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`;
  };

  const handleXChange = (values: number[]) => {
    onChange(buildShadowString({ ...shadow, x: values[0] }));
  };

  const handleYChange = (values: number[]) => {
    onChange(buildShadowString({ ...shadow, y: values[0] }));
  };

  const handleBlurChange = (values: number[]) => {
    onChange(buildShadowString({ ...shadow, blur: values[0] }));
  };

  const handleSpreadChange = (values: number[]) => {
    onChange(buildShadowString({ ...shadow, spread: values[0] }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert hex to rgba for consistency
    const hex = e.target.value;
    onChange(buildShadowString({ ...shadow, color: hex }));
  };

  const handleClearShadow = () => {
    onChange('none');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearShadow}
          className="h-7 text-xs"
        >
          Clear
        </Button>
      </div>

      {/* Horizontal Offset (X) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Horizontal (X)</Label>
          <span className="text-xs text-muted-foreground">{shadow.x}px</span>
        </div>
        <Slider
          value={[shadow.x]}
          onValueChange={handleXChange}
          min={-50}
          max={50}
          step={1}
          className="w-full"
        />
      </div>

      {/* Vertical Offset (Y) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Vertical (Y)</Label>
          <span className="text-xs text-muted-foreground">{shadow.y}px</span>
        </div>
        <Slider
          value={[shadow.y]}
          onValueChange={handleYChange}
          min={-50}
          max={50}
          step={1}
          className="w-full"
        />
      </div>

      {/* Blur Radius */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Blur</Label>
          <span className="text-xs text-muted-foreground">{shadow.blur}px</span>
        </div>
        <Slider
          value={[shadow.blur]}
          onValueChange={handleBlurChange}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Spread Radius */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Spread</Label>
          <span className="text-xs text-muted-foreground">{shadow.spread}px</span>
        </div>
        <Slider
          value={[shadow.spread]}
          onValueChange={handleSpreadChange}
          min={-50}
          max={50}
          step={1}
          className="w-full"
        />
      </div>

      {/* Shadow Color */}
      <div className="space-y-1">
        <Label className="text-xs">Color</Label>
        <Input
          type="color"
          value={shadow.color.startsWith('#') ? shadow.color : '#000000'}
          onChange={handleColorChange}
          className="h-8"
        />
      </div>
    </div>
  );
}
