"use client";

import type { DividerProps } from '@/types/page-builder';
import { SpacingControls, DimensionInput, OpacityControl, Label, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '../shared';

interface DividerPropertiesProps {
  props: DividerProps;
  updateProps: (updates: Partial<DividerProps>) => void;
}

/**
 * Divider component property panel - simplified without collapsible sections
 */
export function DividerProperties({ props, updateProps }: DividerPropertiesProps) {
  return (
    <div className="space-y-6">
      {/* Style */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Style
        </h5>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Line Style</Label>
            <Select
              value={props.style || 'solid'}
              onValueChange={(value: any) => updateProps({ style: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DimensionInput
            label="Thickness"
            value={props.thickness}
            onChange={(value) => updateProps({ thickness: value })}
            min={1}
            max={20}
            step={1}
          />

          <div className="space-y-1">
            <Label className="text-xs">Color</Label>
            <Input
              type="color"
              value={props.color || '#e5e7eb'}
              onChange={(e) => updateProps({ color: e.target.value })}
              className="h-8"
            />
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Layout
        </h5>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Width Type</Label>
            <Select
              value={props.widthType || 'full'}
              onValueChange={(value: any) => updateProps({ widthType: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Width</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="px">Pixels</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DimensionInput
            label="Width"
            value={props.width}
            onChange={(value) => updateProps({ width: value })}
            min={0}
            max={2000}
            step={10}
          />

          <div className="space-y-1">
            <Label className="text-xs">Alignment</Label>
            <Select
              value={props.alignment || 'center'}
              onValueChange={(value: any) => updateProps({ alignment: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Effects */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Effects
        </h5>
        <div className="space-y-3">
          <OpacityControl
            value={props.opacity}
            onChange={(value) => updateProps({ opacity: value })}
          />

          <div className="flex items-center space-x-2">
            <Switch
              checked={props.gradient || false}
              onCheckedChange={(checked) => updateProps({ gradient: checked })}
            />
            <Label className="text-xs">Gradient Effect</Label>
          </div>
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
