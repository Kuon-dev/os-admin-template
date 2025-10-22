"use client";

import type { SpacerProps } from '@/types/page-builder';
import { SpacingControls, DimensionInput, Label, Input, Switch } from '../shared';

interface SpacerPropertiesProps {
  props: SpacerProps;
  updateProps: (updates: Partial<SpacerProps>) => void;
}

/**
 * Spacer component property panel - simplified without collapsible sections
 */
export function SpacerProperties({ props, updateProps }: SpacerPropertiesProps) {
  return (
    <div className="space-y-6">
      {/* Height */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Height
        </h5>
        <div className="space-y-3">
          <DimensionInput
            label="Default Height"
            value={props.height}
            onChange={(value) => updateProps({ height: value })}
            min={0}
            max={500}
            step={4}
          />

          <DimensionInput
            label="Mobile Height"
            value={props.heightMobile}
            onChange={(value) => updateProps({ heightMobile: value })}
            min={0}
            max={500}
            step={4}
          />

          <DimensionInput
            label="Tablet Height"
            value={props.heightTablet}
            onChange={(value) => updateProps({ heightTablet: value })}
            min={0}
            max={500}
            step={4}
          />

          <DimensionInput
            label="Desktop Height"
            value={props.heightDesktop}
            onChange={(value) => updateProps({ heightDesktop: value })}
            min={0}
            max={500}
            step={4}
          />
        </div>
      </div>

      {/* Debug */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Debug
        </h5>
        <div className="flex items-center space-x-2">
          <Switch
            checked={props.showDebugOutline || false}
            onCheckedChange={(checked) => updateProps({ showDebugOutline: checked })}
          />
          <Label className="text-xs">Show outline (for debugging)</Label>
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
