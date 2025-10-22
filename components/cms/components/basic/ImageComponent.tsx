"use client";

import { ImageIcon } from 'lucide-react';
import type { Component, ImageProps } from '@/types/page-builder';
import { BaseComponent } from '../BaseComponent';
import { buildBorderStyles } from '@/lib/cms/style-builders';
import { CSSProperties } from 'react';

interface ImageComponentProps {
  component: Component;
}

/**
 * Image component renderer
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Only renders images with effects
 * - Open/Closed: Extends BaseComponent without modifying it
 * - Dependency Inversion: Depends on BaseComponent and style builders
 *
 * @param component - The image component data
 */
export function ImageComponent({ component }: ImageComponentProps) {
  const props = component.props as ImageProps;

  // Wrapper style for dimensions
  const wrapperStyle: CSSProperties = {
    width: props.width || '100%',
    height: props.height || 'auto',
  };

  // Build border styles
  const borderStyles = buildBorderStyles(props);

  // Image-specific styles
  const imageStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: props.objectFit || 'cover',
    objectPosition: props.objectPosition || 'center',
    ...borderStyles,
    boxShadow: props.shadow,
    opacity: props.opacity ?? 1,
    filter: props.filter && props.filter !== 'none'
      ? `${props.filter}(100%)`
      : undefined,
  };

  // No image src - show placeholder
  if (!props.src) {
    return (
      <BaseComponent
        component={component}
        additionalStyles={{ ...wrapperStyle, height: props.height || '300px' }}
        additionalClasses={[
          "flex",
          "items-center",
          "justify-center",
          "bg-muted",
          "border-2",
          "border-dashed",
          "border-muted-foreground/25",
          "rounded-lg"
        ]}
      >
        <div className="text-center text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">Add image URL in properties</p>
        </div>
      </BaseComponent>
    );
  }

  const imageElement = (
    <img
      src={props.src}
      alt={props.alt || 'Image'}
      loading={props.loading || 'lazy'}
      style={imageStyle}
    />
  );

  // If link is provided, wrap image in anchor tag
  if (props.link) {
    return (
      <BaseComponent component={component} additionalStyles={wrapperStyle}>
        <a
          href={props.link}
          target={props.openInNewTab ? '_blank' : undefined}
          rel={props.openInNewTab ? 'noopener noreferrer' : undefined}
        >
          {imageElement}
        </a>
      </BaseComponent>
    );
  }

  return (
    <BaseComponent component={component} additionalStyles={wrapperStyle}>
      {imageElement}
    </BaseComponent>
  );
}
