"use client";

import { Button } from '@/components/ui/button';
import type { Component, ButtonProps } from '@/types/page-builder';
import { cn } from '@/lib/utils';
import { buildSpacingStyles, buildBorderStyles } from '@/lib/cms/style-builders';
import { parseCustomCss } from '@/lib/cms/css-parser';
import { CSSProperties } from 'react';

interface ButtonComponentProps {
  component: Component;
}

/**
 * Button component renderer
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Only renders buttons with interactions
 * - Open/Closed: Uses style builders (extensible)
 * - Dependency Inversion: Depends on style builders and CSS parser
 *
 * Note: Does not use BaseComponent wrapper because Button is the root element
 *
 * @param component - The button component data
 */
export function ButtonComponent({ component }: ButtonComponentProps) {
  const props = component.props as ButtonProps;

  const handleClick = (e: React.MouseEvent) => {
    if (props.href) {
      e.preventDefault();
      if (props.openInNewTab) {
        window.open(props.href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = props.href;
      }
    }
  };

  // Build spacing styles using style builder
  const spacingStyles = buildSpacingStyles(props);

  // Build border styles using style builder
  const borderStyles = buildBorderStyles(props);

  // Button-specific styles
  const buttonStyle: CSSProperties = {
    ...spacingStyles,
    ...borderStyles,
    backgroundColor: props.backgroundColor,
    color: props.textColor,
    borderColor: props.borderColor,
    boxShadow: props.shadow,
    borderRadius: props.borderRadius,
    paddingLeft: props.paddingX,
    paddingRight: props.paddingX,
    paddingTop: props.paddingY,
    paddingBottom: props.paddingY,
  };

  // Hover states
  const hoverStyle: CSSProperties = {
    backgroundColor: props.hoverBackgroundColor,
    color: props.hoverTextColor,
    borderColor: props.hoverBorderColor,
    boxShadow: props.hoverShadow,
  };

  // Parse custom CSS securely (no eval)
  const customStyles = parseCustomCss(props.customCss);

  // Merge all styles
  const finalStyle = { ...buttonStyle, ...customStyles };

  return (
    <Button
      variant={props.variant || 'default'}
      size={props.size || 'default'}
      onClick={handleClick}
      disabled={props.disabled}
      className={cn(
        props.fullWidth && 'w-full',
        props.customCssClasses
      )}
      style={finalStyle}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, hoverStyle);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, finalStyle);
      }}
    >
      {props.icon && props.iconPosition === 'left' && (
        <span className="mr-2">{props.icon}</span>
      )}
      {props.text || 'Button'}
      {props.icon && props.iconPosition === 'right' && (
        <span className="ml-2">{props.icon}</span>
      )}
    </Button>
  );
}
