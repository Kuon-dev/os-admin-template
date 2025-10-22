"use client";

import { ComponentRenderer } from '../ComponentRenderer';
import type { Component, ColumnProps } from '@/types/page-builder';
import { BaseComponent } from '../BaseComponent';
import { buildBorderStyles } from '@/lib/cms/style-builders';
import { CSSProperties } from 'react';

interface ColumnComponentProps {
  component: Component;
}

/**
 * Column component renderer (for use within Grid)
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Only renders grid columns
 * - Open/Closed: Extends BaseComponent without modifying it
 * - Dependency Inversion: Depends on BaseComponent and style builders
 *
 * @param component - The column component data
 */
export function ColumnComponent({ component }: ColumnComponentProps) {
  const props = component.props as ColumnProps;

  // Build border styles
  const borderStyles = buildBorderStyles(props);

  // Column-specific styles
  const columnStyle: CSSProperties = {
    gridColumn: `span ${props.span || 1}`,
    // Positioning
    gridColumnStart: props.offset ? props.offset + 1 : undefined,
    order: props.order,
    // Alignment
    alignSelf: props.alignSelf,
    justifySelf: props.justifySelf,
    // Styling
    backgroundColor: props.backgroundColor,
    ...borderStyles,
    boxShadow: props.shadow,
  };

  return (
    <BaseComponent component={component} additionalStyles={columnStyle}>
      {component.children && component.children.length > 0 ? (
        <div className="space-y-4">
          {component.children.map((child, index) => (
            <ComponentRenderer key={child.id} component={child} index={index} />
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center text-muted-foreground text-sm">
          Drop components here
        </div>
      )}
    </BaseComponent>
  );
}
