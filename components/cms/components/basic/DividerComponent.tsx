"use client";

import type { Component, DividerProps } from '@/types/page-builder';
import { BaseComponent } from '../BaseComponent';
import { CSSProperties } from 'react';

interface DividerComponentProps {
  component: Component;
}

/**
 * Divider component renderer
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Only renders dividers with styling
 * - Open/Closed: Extends BaseComponent without modifying it
 * - Dependency Inversion: Depends on BaseComponent abstraction
 *
 * @param component - The divider component data
 */
export function DividerComponent({ component }: DividerComponentProps) {
  const props = component.props as DividerProps;

  // Container style for alignment
  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: props.alignment || 'center',
  };

  // Divider-specific styles
  const dividerStyle: CSSProperties = {
    width: props.width || '100%',
    border: 'none',
    opacity: props.opacity ?? 0.2,
  };

  // Apply gradient or solid color
  if (props.gradient) {
    dividerStyle.borderTop = `${props.thickness || '1px'} ${props.style || 'solid'} transparent`;
    dividerStyle.background = `linear-gradient(to right, transparent, ${props.color || 'currentColor'}, transparent)`;
    dividerStyle.height = props.thickness || '1px';
  } else {
    dividerStyle.borderTop = `${props.thickness || '1px'} ${props.style || 'solid'} ${props.color || 'currentColor'}`;
  }

  return (
    <BaseComponent component={component} additionalStyles={containerStyle}>
      <hr style={dividerStyle} />
    </BaseComponent>
  );
}
