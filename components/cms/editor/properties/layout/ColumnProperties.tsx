"use client";

import type { ColumnProps } from '@/types/page-builder';
import { SpacingControls, DimensionInput, BorderControls, ShadowControls, Label, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shared';

interface ColumnPropertiesProps {
  props: ColumnProps;
  updateProps: (updates: Partial<ColumnProps>) => void;
}

/**
 * Column component property panel - simplified without collapsible sections
 */
export function ColumnProperties({ props, updateProps }: ColumnPropertiesProps) {
  return (
    <div className="space-y-6">
      {/* Column Span */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Column Span
        </h5>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Span (Columns)</Label>
            <Input
              type="number"
              min="1"
              max="12"
              value={props.span || 1}
              onChange={(e) => updateProps({ span: parseInt(e.target.value) || 1 })}
              className="h-8 text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Number of grid columns to span
            </p>
          </div>
        </div>
      </div>

      {/* Positioning */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Positioning
        </h5>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Offset</Label>
            <Input
              type="number"
              min="0"
              max="12"
              value={props.offset || 0}
              onChange={(e) => updateProps({ offset: parseInt(e.target.value) || 0 })}
              className="h-8 text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Number of columns to skip before this column
            </p>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Order</Label>
            <Input
              type="number"
              value={props.order || 0}
              onChange={(e) => updateProps({ order: parseInt(e.target.value) || 0 })}
              className="h-8 text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Visual order of column (use negative values to move earlier)
            </p>
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
            <Label className="text-xs">Align Self</Label>
            <Select
              value={props.alignSelf || 'auto'}
              onValueChange={(value: any) => updateProps({ alignSelf: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Justify Self</Label>
            <Select
              value={props.justifySelf || 'auto'}
              onValueChange={(value: any) => updateProps({ justifySelf: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Styling */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Styling
        </h5>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs">Background Color</Label>
            <Input
              type="color"
              value={props.backgroundColor || '#ffffff'}
              onChange={(e) => updateProps({ backgroundColor: e.target.value })}
              className="h-8"
            />
          </div>

          <BorderControls
            value={props.border}
            onChange={(value) => updateProps({ border: value })}
          />

          <DimensionInput
            label="Border Radius"
            value={props.borderRadius}
            onChange={(value) => updateProps({ borderRadius: value })}
            min={0}
            max={50}
            step={1}
          />

          <ShadowControls
            value={props.shadow}
            onChange={(value) => updateProps({ shadow: value })}
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
