"use client";

import type { HeadingProps } from '@/types/page-builder';
import { SpacingControls, DimensionInput, Label, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shared';

interface HeadingPropertiesProps {
  props: HeadingProps;
  updateProps: (updates: Partial<HeadingProps>) => void;
}

/**
 * Heading component property panel - simplified without collapsible sections
 */
export function HeadingProperties({ props, updateProps }: HeadingPropertiesProps) {
  return (
    <div className="space-y-6">
      {/* Content */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Content
        </h5>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Text</Label>
            <Textarea
              value={props.content}
              onChange={(e) => updateProps({ content: e.target.value })}
              placeholder="Enter heading text..."
              rows={2}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Heading Level</Label>
            <Select
              value={props.level}
              onValueChange={(value: any) => updateProps({ level: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">H1 (Largest)</SelectItem>
                <SelectItem value="h2">H2</SelectItem>
                <SelectItem value="h3">H3</SelectItem>
                <SelectItem value="h4">H4</SelectItem>
                <SelectItem value="h5">H5</SelectItem>
                <SelectItem value="h6">H6 (Smallest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            min={12}
            max={100}
            step={1}
          />

          <div className="space-y-1">
            <Label className="text-xs">Font Weight</Label>
            <Select
              value={props.fontWeight || 'bold'}
              onValueChange={(value) => updateProps({ fontWeight: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="lighter">Lighter</SelectItem>
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

      {/* SEO */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          SEO
        </h5>
        <div className="space-y-1">
          <Label className="text-xs">Anchor ID</Label>
          <Input
            value={props.anchorId || ''}
            onChange={(e) => updateProps({ anchorId: e.target.value })}
            placeholder="section-id"
            className="h-8 text-xs"
          />
          <p className="text-xs text-muted-foreground">
            Used for anchor links (#section-id)
          </p>
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
