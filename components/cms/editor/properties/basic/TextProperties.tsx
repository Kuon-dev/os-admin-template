"use client";

import type { TextProps } from '@/types/page-builder';
import { SpacingControls, DimensionInput, Label, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Textarea } from '../shared';

interface TextPropertiesProps {
  props: TextProps;
  updateProps: (updates: Partial<TextProps>) => void;
}

/**
 * Text component property panel - simplified without collapsible sections
 */
export function TextProperties({ props, updateProps }: TextPropertiesProps) {
  return (
    <div className="space-y-6">
      {/* Content */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Content
        </h5>
        <div className="space-y-2">
          <Label>Text</Label>
          <Textarea
            value={props.content}
            onChange={(e) => updateProps({ content: e.target.value })}
            placeholder="Enter text..."
            rows={3}
          />
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Typography
        </h5>
        <div className="space-y-3">
          <DimensionInput
            label="Font Size"
            value={props.fontSize}
            onChange={(value) => updateProps({ fontSize: value })}
            min={8}
            max={100}
            step={1}
          />

          <div className="space-y-1">
            <Label className="text-xs">Font Weight</Label>
            <Select
              value={props.fontWeight || 'normal'}
              onValueChange={(value) => updateProps({ fontWeight: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="lighter">Lighter</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
                <SelectItem value="300">300</SelectItem>
                <SelectItem value="400">400</SelectItem>
                <SelectItem value="500">500</SelectItem>
                <SelectItem value="600">600</SelectItem>
                <SelectItem value="700">700</SelectItem>
                <SelectItem value="800">800</SelectItem>
                <SelectItem value="900">900</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Color</Label>
            <Input
              type="color"
              value={props.color || '#000000'}
              onChange={(e) => updateProps({ color: e.target.value })}
              className="h-8"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Alignment</Label>
            <Select
              value={props.alignment || 'left'}
              onValueChange={(value: any) => updateProps({ alignment: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="justify">Justify</SelectItem>
              </SelectContent>
            </Select>
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
              value={props.link || ''}
              onChange={(e) => updateProps({ link: e.target.value })}
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
