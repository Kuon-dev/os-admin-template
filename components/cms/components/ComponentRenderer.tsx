"use client";

import { memo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier } from 'dnd-core';
import { cn } from '@/lib/utils';
import usePageBuilderStore from '@/stores/page-builder-store';
import type { Component } from '@/types/page-builder';
import { GripVertical } from 'lucide-react';

// Component imports
import { TextComponent } from './basic/TextComponent';
import { HeadingComponent } from './basic/HeadingComponent';
import { ButtonComponent } from './basic/ButtonComponent';
import { ImageComponent } from './basic/ImageComponent';
import { DividerComponent } from './basic/DividerComponent';
import { ContainerComponent } from './layout/ContainerComponent';
import { GridComponent } from './layout/GridComponent';
import { ColumnComponent } from './layout/ColumnComponent';
import { SpacerComponent } from './layout/SpacerComponent';

interface ComponentRendererProps {
  component: Component;
  index: number;
}

export const ComponentRenderer = memo(function ComponentRenderer({
  component,
  index,
}: ComponentRendererProps) {
  const { selectedComponentId, actions, ui } = usePageBuilderStore();
  const isSelected = selectedComponentId === component.id;
  const isPreview = ui.isPreviewMode;
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'component',
    item: { type: 'component', componentId: component.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isPreview,
    end: () => {
      // Clear active dropzone when drag ends
      actions.clearActiveDropZone();
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    if (!isPreview) {
      e.stopPropagation();
      actions.selectComponent(component.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.removeComponent(component.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.duplicateComponent(component.id);
  };

  // Combine refs
  preview(ref);

  const renderComponent = () => {
    switch (component.type) {
      case 'text':
        return <TextComponent component={component} />;
      case 'heading':
        return <HeadingComponent component={component} />;
      case 'button':
        return <ButtonComponent component={component} />;
      case 'image':
        return <ImageComponent component={component} />;
      case 'divider':
        return <DividerComponent component={component} />;
      case 'container':
        return <ContainerComponent component={component} />;
      case 'grid':
        return <GridComponent component={component} />;
      case 'column':
        return <ColumnComponent component={component} />;
      case 'spacer':
        return <SpacerComponent component={component} />;
      default:
        return (
          <div className="p-4 border border-dashed border-muted">
            Unknown component: {component.type}
          </div>
        );
    }
  };

  if (isPreview) {
    return <div>{renderComponent()}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn(
        'relative group transition-all',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        isDragging && 'opacity-30'
      )}
      onClick={handleClick}
    >
      {/* Component Controls */}
      {isSelected && (
        <div className="absolute -top-8 left-0 flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-10">
          <div
            ref={drag}
            className="cursor-grab active:cursor-grabbing hover:bg-primary-foreground/20 px-1 rounded flex items-center"
          >
            <GripVertical className="h-3 w-3" />
          </div>
          <span className="font-medium">{component.type}</span>
          <button
            onClick={handleDuplicate}
            className="ml-2 hover:bg-primary-foreground/20 px-1 rounded"
          >
            Duplicate
          </button>
          <button
            onClick={handleDelete}
            className="hover:bg-destructive px-1 rounded"
          >
            Delete
          </button>
        </div>
      )}

      {/* Component Content */}
      {renderComponent()}

      {/* Hover Overlay */}
      {!isSelected && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 border-2 border-primary/50 rounded pointer-events-none transition-opacity" />
      )}
    </div>
  );
});
