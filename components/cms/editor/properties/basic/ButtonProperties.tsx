"use client";

import type { ButtonProps } from '@/types/page-builder';
import { SpacingControls, DimensionInput, Label, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '../shared';

interface ButtonPropertiesProps {
  props: ButtonProps;
  updateProps: (updates: Partial<ButtonProps>) => void;
}

/**
 * Button component property panel - simplified without collapsible sections
 */
export function ButtonProperties({ props, updateProps }: ButtonPropertiesProps) {
  return (
    <div className="space-y-6">
      {/* Content */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Content
        </h5>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Button Text</Label>
            <Input
              value={props.text}
              onChange={(e) => updateProps({ text: e.target.value })}
              placeholder="Button"
              className="h-8 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Variant</Label>
              <Select
                value={props.variant || 'default'}
                onValueChange={(value: any) => updateProps({ variant: value })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="destructive">Destructive</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Size</Label>
              <Select
                value={props.size || 'default'}
                onValueChange={(value: any) => updateProps({ size: value })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={props.fullWidth || false}
              onCheckedChange={(checked) => updateProps({ fullWidth: checked })}
            />
            <Label className="text-xs">Full Width</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={props.disabled || false}
              onCheckedChange={(checked) => updateProps({ disabled: checked })}
            />
            <Label className="text-xs">Disabled</Label>
          </div>
        </div>
      </div>

      {/* Link */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Link
        </h5>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">URL</Label>
            <Input
              value={props.href || ''}
              onChange={(e) => updateProps({ href: e.target.value })}
              placeholder="https://..."
              className="h-8 text-xs"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={props.openInNewTab || false}
              onCheckedChange={(checked) => updateProps({ openInNewTab: checked })}
            />
            <Label className="text-xs">Open in new tab</Label>
          </div>
        </div>
      </div>

      {/* Icon */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Icon
        </h5>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Icon (emoji or text)</Label>
            <Input
              value={props.icon || ''}
              onChange={(e) => updateProps({ icon: e.target.value })}
              placeholder="🚀"
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Icon Position</Label>
            <Select
              value={props.iconPosition || 'left'}
              onValueChange={(value: any) => updateProps({ iconPosition: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Custom Styling */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Custom Styling
        </h5>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Background Color</Label>
            <Input
              type="color"
              value={props.backgroundColor || '#000000'}
              onChange={(e) => updateProps({ backgroundColor: e.target.value })}
              className="h-8"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Text Color</Label>
            <Input
              type="color"
              value={props.textColor || '#ffffff'}
              onChange={(e) => updateProps({ textColor: e.target.value })}
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

          <div className="grid grid-cols-2 gap-2">
            <DimensionInput
              label="Padding X"
              value={props.paddingX}
              onChange={(value) => updateProps({ paddingX: value })}
              min={0}
              max={200}
              step={1}
            />
            <DimensionInput
              label="Padding Y"
              value={props.paddingY}
              onChange={(value) => updateProps({ paddingY: value })}
              min={0}
              max={200}
              step={1}
            />
          </div>
        </div>
      </div>

      {/* Hover States */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Hover States
        </h5>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Hover Background Color</Label>
            <Input
              type="color"
              value={props.hoverBackgroundColor || '#000000'}
              onChange={(e) => updateProps({ hoverBackgroundColor: e.target.value })}
              className="h-8"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Hover Text Color</Label>
            <Input
              type="color"
              value={props.hoverTextColor || '#ffffff'}
              onChange={(e) => updateProps({ hoverTextColor: e.target.value })}
              className="h-8"
            />
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
