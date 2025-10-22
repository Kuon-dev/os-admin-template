"use client";

import { ComponentType } from '@/types/page-builder';
import { TextProperties } from './basic/TextProperties';
import { SpacerProperties } from './layout/SpacerProperties';
import { HeadingProperties } from './basic/HeadingProperties';
import { ButtonProperties } from './basic/ButtonProperties';
import { ImageProperties } from './basic/ImageProperties';
import { DividerProperties } from './basic/DividerProperties';
import { ContainerProperties } from './layout/ContainerProperties';
import { GridProperties } from './layout/GridProperties';
import { ColumnProperties } from './layout/ColumnProperties';

/**
 * Maps component types to their property editor components
 *
 * SOLID Principles Applied:
 * - Open/Closed: Add new component types without modifying existing code
 * - Single Responsibility: Only maps types to components
 * - Dependency Inversion: Main panel depends on this abstraction
 *
 * To add a new component:
 * 1. Create the property panel in basic/ or layout/
 * 2. Import it above
 * 3. Add entry to the registry below
 */
export const PropertiesRegistry: Partial<Record<ComponentType, React.FC<any>>> = {
  // Basic components
  text: TextProperties,
  heading: HeadingProperties,
  button: ButtonProperties,
  image: ImageProperties,
  divider: DividerProperties,

  // Layout components
  container: ContainerProperties,
  grid: GridProperties,
  column: ColumnProperties,
  spacer: SpacerProperties,

  // Media components (future)
  // video: VideoProperties,
  // icon: IconProperties,
  // gallery: GalleryProperties,
  // carousel: CarouselProperties,
};

/**
 * Gets the property panel component for a given component type
 *
 * @param type - Component type
 * @returns Property panel component or null if not found
 */
export function getPropertiesComponent(type: ComponentType): React.FC<any> | null {
  return PropertiesRegistry[type] || null;
}
