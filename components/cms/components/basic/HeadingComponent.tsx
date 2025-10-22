"use client";

import type { Component, HeadingProps } from '@/types/page-builder';
import { BaseComponent } from '../BaseComponent';
import { buildTypographyStyles } from '@/lib/cms/style-builders';
import { CSSProperties } from 'react';

interface HeadingComponentProps {
  component: Component;
}

/**
 * Heading component renderer
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Only renders headings with typography
 * - Open/Closed: Extends BaseComponent without modifying it
 * - Dependency Inversion: Depends on abstractions (BaseComponent, style builders)
 *
 * @param component - The heading component data
 */
export function HeadingComponent({ component }: HeadingComponentProps) {
  const props = component.props as HeadingProps;
  const Tag = props.level || 'h2';

  // Build typography-specific styles using service layer
  const typographyStyles = buildTypographyStyles(props);

  // Add heading-specific effects and defaults
  const headingStyles: CSSProperties = {
    ...typographyStyles,
    fontWeight: props.fontWeight || 'bold', // Default to bold for headings
    textShadow: props.textShadow,
    opacity: props.opacity ?? 1,
  };

  const content = props.content || 'Heading';

  return (
    <BaseComponent
      component={component}
      additionalStyles={headingStyles}
      as={Tag}
      htmlId={props.anchorId}
    >
      {content}
    </BaseComponent>
  );
}
