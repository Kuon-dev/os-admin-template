"use client";

import type { ContainerProps } from '@/types/page-builder';
import { SpacingControls, DimensionInput, OpacityControl, BorderControls, ShadowControls, Label, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '../shared';

interface ContainerPropertiesProps {
  props: ContainerProps;
  updateProps: (updates: Partial<ContainerProps>) => void;
}

/**
 * Container component property panel - simplified without collapsible sections
 */
export function ContainerProperties({ props, updateProps }: ContainerPropertiesProps) {
  return (
    <div className="space-y-6">
      {/* Dimensions */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Dimensions
        </h5>
        <div className="space-y-3">
          <DimensionInput
            label="Max Width"
            value={props.maxWidth}
            onChange={(value) => updateProps({ maxWidth: value })}
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

          <DimensionInput
            label="Min Height"
            value={props.minHeight}
            onChange={(value) => updateProps({ minHeight: value })}
            min={0}
            max={2000}
            step={10}
          />
        </div>
      </div>

      {/* Background */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Background
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

          <div className="space-y-1">
            <Label className="text-xs">Background Image URL</Label>
            <Input
              value={props.backgroundImage || ''}
              onChange={(e) => updateProps({ backgroundImage: e.target.value })}
              placeholder="https://..."
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Background Size</Label>
            <Select
              value={props.backgroundSize || 'cover'}
              onValueChange={(value: any) => updateProps({ backgroundSize: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Cover</SelectItem>
                <SelectItem value="contain">Contain</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Background Position</Label>
            <Select
              value={props.backgroundPosition || 'center'}
              onValueChange={(value: any) => updateProps({ backgroundPosition: value })}
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

          <div className="space-y-1">
            <Label className="text-xs">Background Attachment</Label>
            <Select
              value={props.backgroundAttachment || 'scroll'}
              onValueChange={(value: any) => updateProps({ backgroundAttachment: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scroll">Scroll</SelectItem>
                <SelectItem value="fixed">Fixed (Parallax)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={props.backgroundRepeat || false}
              onCheckedChange={(checked) => updateProps({ backgroundRepeat: checked })}
            />
            <Label className="text-xs">Background Repeat</Label>
          </div>
        </div>
      </div>

      {/* Border & Effects */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Border & Effects
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
        </div>
      </div>

      {/* Layout (Flexbox) */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Layout (Flexbox)
        </h5>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Display</Label>
            <Select
              value={props.display || 'block'}
              onValueChange={(value: any) => updateProps({ display: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="block">Block</SelectItem>
                <SelectItem value="flex">Flex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {props.display === 'flex' && (
            <>
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
                <Label className="text-xs">Justify Content</Label>
                <Select
                  value={props.justifyContent || 'start'}
                  onValueChange={(value: any) => updateProps({ justifyContent: value })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="end">End</SelectItem>
                    <SelectItem value="space-between">Space Between</SelectItem>
                    <SelectItem value="space-around">Space Around</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
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
