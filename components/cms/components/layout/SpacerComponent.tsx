"use client";

import type { Component, SpacerProps } from '@/types/page-builder';
import { BaseComponent } from '../BaseComponent';
import { CSSProperties } from 'react';
import usePageBuilderStore from '@/stores/page-builder-store';

interface SpacerComponentProps {
  component: Component;
}

/**
 * Spacer component renderer
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Only renders responsive spacers
 * - Open/Closed: Extends BaseComponent without modifying it
 * - Dependency Inversion: Depends on BaseComponent abstraction
 *
 * @param component - The spacer component data
 */
export function SpacerComponent({ component }: SpacerComponentProps) {
  const props = component.props as SpacerProps;
  const { ui } = usePageBuilderStore();

  // Determine height based on device mode
  const getHeight = () => {
    if (ui.deviceMode === 'mobile' && props.heightMobile) {
      return props.heightMobile;
    }
    if (ui.deviceMode === 'tablet' && props.heightTablet) {
      return props.heightTablet;
    }
    if (ui.deviceMode === 'desktop' && props.heightDesktop) {
      return props.heightDesktop;
    }
    return props.height || '2rem';
  };

  // Build spacer-specific styles
  const spacerStyle: CSSProperties = {
    height: getHeight(),
    width: '100%',
    // Show debug outline if enabled
    outline: props.showDebugOutline ? '2px dashed rgba(255, 0, 0, 0.3)' : undefined,
  };

  return (
    <BaseComponent component={component} additionalStyles={spacerStyle} />
  );
}
