"use client";

import type { ImageProps } from '@/types/page-builder';
import { SpacingControls, DimensionInput, OpacityControl, BorderControls, ShadowControls, Label, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '../shared';

interface ImagePropertiesProps {
  props: ImageProps;
  updateProps: (updates: Partial<ImageProps>) => void;
}

/**
 * Image component property panel - simplified without collapsible sections
 */
export function ImageProperties({ props, updateProps }: ImagePropertiesProps) {
  return (
    <div className="space-y-6">
      {/* Source */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Source
        </h5>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Image URL</Label>
            <Input
              value={props.src || ''}
              onChange={(e) => updateProps({ src: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Alt Text</Label>
            <Input
              value={props.alt}
              onChange={(e) => updateProps({ alt: e.target.value })}
              placeholder="Description of image"
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Dimensions */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Dimensions
        </h5>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <DimensionInput
              label="Width"
              value={props.width}
              onChange={(value) => updateProps({ width: value })}
              min={0}
              max={2000}
              step={10}
            />
            <DimensionInput
              label="Height"
              value={props.height}
              onChange={(value) => updateProps({ height: value })}
              min={0}
              max={2000}
              step={10}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Aspect Ratio</Label>
            <Select
              value={props.aspectRatio || 'custom'}
              onValueChange={(value: any) => updateProps({ aspectRatio: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                <SelectItem value="1:1">1:1 (Square)</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Fit & Position */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Fit & Position
        </h5>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Object Fit</Label>
            <Select
              value={props.objectFit || 'cover'}
              onValueChange={(value: any) => updateProps({ objectFit: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Cover</SelectItem>
                <SelectItem value="contain">Contain</SelectItem>
                <SelectItem value="fill">Fill</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Object Position</Label>
            <Select
              value={props.objectPosition || 'center'}
              onValueChange={(value: any) => updateProps({ objectPosition: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
                <SelectItem value="left">Left</SelectItem>
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
        <div className="space-y-4">
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

          <OpacityControl
            value={props.opacity}
            onChange={(value) => updateProps({ opacity: value })}
          />

          <div className="space-y-1">
            <Label className="text-xs">Filter</Label>
            <Select
              value={props.filter || 'none'}
              onValueChange={(value: any) => updateProps({ filter: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="grayscale">Grayscale</SelectItem>
                <SelectItem value="sepia">Sepia</SelectItem>
                <SelectItem value="brightness">Brightness</SelectItem>
                <SelectItem value="contrast">Contrast</SelectItem>
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

      {/* Performance */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Performance
        </h5>
        <div className="space-y-1">
          <Label className="text-xs">Loading</Label>
          <Select
            value={props.loading || 'lazy'}
            onValueChange={(value: any) => updateProps({ loading: value })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lazy">Lazy (Load when visible)</SelectItem>
              <SelectItem value="eager">Eager (Load immediately)</SelectItem>
            </SelectContent>
          </Select>
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
