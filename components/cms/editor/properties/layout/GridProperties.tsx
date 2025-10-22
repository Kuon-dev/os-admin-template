"use client";

import type { GridProps } from '@/types/page-builder';
import { SpacingControls, DimensionInput, Label, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shared';

interface GridPropertiesProps {
  props: GridProps;
  updateProps: (updates: Partial<GridProps>) => void;
}

/**
 * Grid component property panel - simplified without collapsible sections
 */
export function GridProperties({ props, updateProps }: GridPropertiesProps) {
  return (
    <div className="space-y-6">
      {/* Grid Layout */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Grid Layout
        </h5>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Columns</Label>
            <Input
              type="number"
              min="1"
              max="12"
              value={props.columns}
              onChange={(e) => updateProps({ columns: parseInt(e.target.value) || 1 })}
              className="h-8 text-xs"
            />
          </div>

          <DimensionInput
            label="Gap (All)"
            value={props.gap}
            onChange={(value) => updateProps({ gap: value })}
            min={0}
            max={200}
            step={4}
          />

          <div className="grid grid-cols-2 gap-2">
            <DimensionInput
              label="Row Gap"
              value={props.rowGap}
              onChange={(value) => updateProps({ rowGap: value })}
              min={0}
              max={200}
              step={4}
            />
            <DimensionInput
              label="Column Gap"
              value={props.columnGap}
              onChange={(value) => updateProps({ columnGap: value })}
              min={0}
              max={200}
              step={4}
            />
          </div>
        </div>
      </div>

      {/* Alignment */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Alignment
        </h5>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Align Items</Label>
            <Select
              value={props.alignItems || 'start'}
              onValueChange={(value: any) => updateProps({ alignItems: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Justify Items</Label>
            <Select
              value={props.justifyItems || 'start'}
              onValueChange={(value: any) => updateProps({ justifyItems: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Responsive
        </h5>
        <div className="space-y-2">
          <DimensionInput
            label="Min Column Width"
            value={props.minColumnWidth}
            onChange={(value) => updateProps({ minColumnWidth: value })}
            min={50}
            max={1000}
            step={10}
          />
          <p className="text-xs text-muted-foreground -mt-1">
            Auto-fit columns based on this minimum width
          </p>

          <DimensionInput
            label="Auto Rows"
            value={props.autoRows}
            onChange={(value) => updateProps({ autoRows: value })}
            min={0}
            max={1000}
            step={10}
          />
          <p className="text-xs text-muted-foreground -mt-1">
            Height of auto-generated rows
          </p>
        </div>
      </div>

      {/* Styling */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Styling
        </h5>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Background Color</Label>
            <Input
              type="color"
              value={props.backgroundColor || '#ffffff'}
              onChange={(e) => updateProps({ backgroundColor: e.target.value })}
              className="h-8"
            />
          </div>

          <DimensionInput
            label="Border Radius"
            value={props.borderRadius}
            onChange={(value) => updateProps({ borderRadius: value })}
            min={0}
            max={50}
            step={1}
          />
        </div>
      </div>

      {/* Spacing */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Spacing
        </h5>
        <SpacingControls props={props} updateProps={updateProps} />
      </div>
    </div>
  );
}
