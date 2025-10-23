import type { ComponentType, ComponentProps } from '@/types/page-builder';

/**
 * Centralized default props configuration for CMS components
 *
 * This file contains all default properties for each component type.
 * Modify this file to change default values across the entire CMS.
 */
export const COMPONENT_DEFAULTS: Record<ComponentType, ComponentProps> = {
  text: {
    content: 'Click to edit text',
    fontSize: '16px',
    fontWeight: 'normal',
    color: 'inherit',
    alignment: 'left',
  },

  heading: {
    content: 'Heading',
    level: 'h2',
    fontSize: '2rem',
    fontWeight: 'bold',
    alignment: 'left',
  },

  button: {
    text: 'Click me',
    variant: 'default',
    size: 'default',
    paddingX: '1.5rem',
    paddingY: '0.625rem',
    borderRadius: '0.5rem',
    shadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    hoverShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  },

  image: {
    alt: 'Image',
    objectFit: 'cover',
  },

  divider: {
    style: 'solid',
    thickness: '1px',
    color: 'currentColor',
    spacing: '1rem',
  },

  container: {
    maxWidth: '1200px',
    padding: '1rem',
  },

  grid: {
    columns: 2,
    gap: '1rem',
    padding: '0',
  },

  column: {
    span: 1,
    padding: '0',
  },

  spacer: {
    height: '2rem',
  },

  video: {
    autoPlay: false,
    loop: false,
    muted: false,
    controls: true,
  },

  icon: {
    name: 'star',
    size: '24px',
    color: 'currentColor',
  },

  gallery: {
    images: [],
    columns: 3,
    gap: '1rem',
  },

  carousel: {
    items: [],
    autoPlay: false,
    interval: 5000,
    showControls: true,
    showIndicators: true,
  },
};

/**
 * Get default props for a specific component type
 */
export function getComponentDefaults(type: ComponentType): ComponentProps {
  return COMPONENT_DEFAULTS[type] || ({} as ComponentProps);
}
