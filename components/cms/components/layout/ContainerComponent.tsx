"use client";

import { ComponentRenderer } from '../ComponentRenderer';
import type { Component, ContainerProps } from '@/types/page-builder';
import { BaseComponent } from '../BaseComponent';
import { buildBorderStyles } from '@/lib/cms/style-builders';
import { CSSProperties } from 'react';

interface ContainerComponentProps {
  component: Component;
}

/**
 * Container component renderer
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Only renders containers with layout
 * - Open/Closed: Extends BaseComponent without modifying it
 * - Dependency Inversion: Depends on BaseComponent and style builders
 *
 * @param component - The container component data
 */
export function ContainerComponent({ component }: ContainerComponentProps) {
  const props = component.props as ContainerProps;

  // Build border styles
  const borderStyles = buildBorderStyles(props);

  // Container-specific styles
  const containerStyle: CSSProperties = {
    maxWidth: props.maxWidth || '1200px',
    // Background
    backgroundColor: props.backgroundColor || 'transparent',
    backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : undefined,
    backgroundSize: props.backgroundSize || 'cover',
    backgroundPosition: props.backgroundPosition || 'center',
    backgroundRepeat: props.backgroundRepeat ? 'repeat' : 'no-repeat',
    backgroundAttachment: props.backgroundAttachment || 'scroll',
    // Border & Effects
    ...borderStyles,
    boxShadow: props.shadow,
    opacity: props.opacity ?? 1,
    // Layout
    minHeight: props.minHeight,
    height: props.height,
    display: props.display || 'block',
    alignItems: props.display === 'flex' ? props.alignItems : undefined,
    justifyContent: props.display === 'flex' ? props.justifyContent : undefined,
    // Auto-centering for containers
    marginLeft: props.marginLeft || 'auto',
    marginRight: props.marginRight || 'auto',
  };

  return (
    <BaseComponent component={component} additionalStyles={containerStyle}>
      {component.children && component.children.length > 0 ? (
        <div className="space-y-4">
          {component.children.map((child, index) => (
            <ComponentRenderer key={child.id} component={child} index={index} />
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center text-muted-foreground">
          Drop components here
        </div>
      )}
    </BaseComponent>
  );
}
