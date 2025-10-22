"use client";

import type { Component } from '@/types/page-builder';
import { cn } from '@/lib/utils';
import { CSSProperties, ReactNode } from 'react';
import { buildCommonStyles } from '@/lib/cms/style-builders';
import { parseCustomCss } from '@/lib/cms/css-parser';
import usePageBuilderStore from '@/stores/page-builder-store';

interface BaseComponentProps {
  component: Component;
  children: ReactNode;
  additionalStyles?: CSSProperties;
  additionalClasses?: string[];
  as?: keyof JSX.IntrinsicElements;
  htmlId?: string; // Optional HTML id attribute
}

/**
 * Base component wrapper that handles common concerns
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles common rendering concerns
 * - Dependency Inversion: Components depend on this abstraction
 * - Open/Closed: Can be extended without modification
 *
 * Responsibilities:
 * - Apply common spacing styles via style builders
 * - Parse and apply custom CSS securely (no eval)
 * - Handle animation classes
 * - Handle responsive visibility
 * - Merge component-specific styles with proper priority
 *
 * @param component - The component data with props
 * @param children - The component's content to render
 * @param additionalStyles - Component-specific styles to merge
 * @param additionalClasses - Additional CSS classes to apply
 * @param as - HTML element to render (default: 'div')
 *
 * @example
 * ```tsx
 * <BaseComponent component={component} additionalStyles={textStyles}>
 *   {content}
 * </BaseComponent>
 * ```
 */
export function BaseComponent({
  component,
  children,
  additionalStyles = {},
  additionalClasses = [],
  as: Element = 'div',
  htmlId,
}: BaseComponentProps) {
  const props = component.props;
  const { ui } = usePageBuilderStore();

  // Build common styles using style builder service (SRP)
  const commonStyles = buildCommonStyles(props);

  // Parse custom CSS securely (replaces eval)
  const customStyles = parseCustomCss(props.customCss);

  // Merge all styles with proper priority:
  // 1. Common styles (lowest priority)
  // 2. Component-specific styles
  // 3. Custom CSS (highest priority)
  const mergedStyles: CSSProperties = {
    ...commonStyles,
    ...additionalStyles,
    ...customStyles,
  };

  // Get animation classes if animation is defined
  const animationClasses = props.animation && props.animation !== 'none'
    ? getAnimationClasses(props.animation, props.animationDuration, props.animationDelay)
    : [];

  // Check responsive visibility
  const isVisible = checkVisibility(props.visibility, ui.deviceMode);

  if (!isVisible) {
    return null;
  }

  return (
    <Element
      id={htmlId}
      className={cn(
        animationClasses,
        props.customCssClasses,
        additionalClasses
      )}
      style={mergedStyles}
      data-component-id={component.id}
      data-component-type={component.type}
    >
      {children}
    </Element>
  );
}

/**
 * Gets CSS classes for animations
 *
 * @param animation - Animation type
 * @param duration - Animation duration in ms
 * @param delay - Animation delay in ms
 * @returns Array of animation class names
 */
function getAnimationClasses(
  animation: string,
  duration?: number,
  delay?: number
): string[] {
  const classes = [`animate-${animation}`];

  if (duration) {
    // Note: You may need to add custom Tailwind classes for duration
    // Or use inline styles in a future iteration
    classes.push(`animation-duration-${duration}`);
  }

  if (delay) {
    classes.push(`animation-delay-${delay}`);
  }

  return classes;
}

/**
 * Checks if component should be visible based on device mode
 *
 * @param visibility - Visibility settings per device
 * @param deviceMode - Current device mode
 * @returns True if component should be visible
 */
function checkVisibility(
  visibility?: { mobile: boolean; tablet: boolean; desktop: boolean },
  deviceMode?: string
): boolean {
  if (!visibility) return true;

  switch (deviceMode) {
    case 'mobile':
      return visibility.mobile !== false;
    case 'tablet':
      return visibility.tablet !== false;
    case 'desktop':
      return visibility.desktop !== false;
    default:
      return true;
  }
}
