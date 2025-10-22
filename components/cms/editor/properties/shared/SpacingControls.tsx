"use client";

import { DimensionInput } from './DimensionInput';

interface SpacingControlsProps {
  props: any;
  updateProps: (updates: any) => void;
}

/**
 * Reusable spacing controls (margin/padding)
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles spacing property inputs
 * - Open/Closed: Can be used by any component without modification
 * - Dependency Inversion: Depends on updateProps abstraction
 *
 * Features:
 * - Dimension inputs for better UX
 * - Unit selection (px, em, rem, %, vw, vh)
 * - Visual feedback with min/max labels
 */
export function SpacingControls({ props, updateProps }: SpacingControlsProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Margin Controls */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-muted-foreground">Margin</h4>
        <div className="grid grid-cols-2 gap-4">
          <DimensionInput
            label="Top"
            value={props.marginTop}
            onChange={(value) => updateProps({ marginTop: value })}
          />
          <DimensionInput
            label="Bottom"
            value={props.marginBottom}
            onChange={(value) => updateProps({ marginBottom: value })}
          />
          <DimensionInput
            label="Left"
            value={props.marginLeft}
            onChange={(value) => updateProps({ marginLeft: value })}
          />
          <DimensionInput
            label="Right"
            value={props.marginRight}
            onChange={(value) => updateProps({ marginRight: value })}
          />
        </div>
      </div>

      {/* Padding Controls */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-muted-foreground">Padding</h4>
        <div className="grid grid-cols-2 gap-4">
          <DimensionInput
            label="Top"
            value={props.paddingTop}
            onChange={(value) => updateProps({ paddingTop: value })}
          />
          <DimensionInput
            label="Bottom"
            value={props.paddingBottom}
            onChange={(value) => updateProps({ paddingBottom: value })}
          />
          <DimensionInput
            label="Left"
            value={props.paddingLeft}
            onChange={(value) => updateProps({ paddingLeft: value })}
          />
          <DimensionInput
            label="Right"
            value={props.paddingRight}
            onChange={(value) => updateProps({ paddingRight: value })}
          />
        </div>
      </div>
    </div>
  );
}
