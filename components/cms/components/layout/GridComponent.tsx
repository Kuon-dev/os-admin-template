"use client";

import { ComponentRenderer } from '../ComponentRenderer';
import type { Component, GridProps } from '@/types/page-builder';
import { BaseComponent } from '../BaseComponent';
import { CSSProperties } from 'react';

interface GridComponentProps {
  component: Component;
}

/**
 * Grid component renderer
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Only renders CSS grid layouts
 * - Open/Closed: Extends BaseComponent without modifying it
 * - Dependency Inversion: Depends on BaseComponent abstraction
 *
 * @param component - The grid component data
 */
export function GridComponent({ component }: GridComponentProps) {
  const props = component.props as GridProps;

  // Grid-specific styles
  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: props.minColumnWidth
      ? `repeat(auto-fit, minmax(${props.minColumnWidth}, 1fr))`
      : `repeat(${props.columns || 2}, 1fr)`,
    // Gap Control
    gap: props.gap,
    rowGap: props.rowGap || props.gap || '1rem',
    columnGap: props.columnGap || props.gap || '1rem',
    // Alignment
    alignItems: props.alignItems,
    justifyItems: props.justifyItems,
    // Auto sizing
    gridAutoRows: props.autoRows,
    // Styling
    backgroundColor: props.backgroundColor,
    borderRadius: props.borderRadius,
  };

  return (
    <BaseComponent component={component} additionalStyles={gridStyle}>
      {component.children && component.children.length > 0 ? (
        component.children.map((child, index) => (
          <ComponentRenderer key={child.id} component={child} index={index} />
        ))
      ) : (
        <div className="col-span-full border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center text-muted-foreground">
          Drop components here
        </div>
      )}
    </BaseComponent>
  );
}
