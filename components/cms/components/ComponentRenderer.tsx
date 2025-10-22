"use client";

import { memo, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier } from 'dnd-core';
import { cn } from '@/lib/utils';
import usePageBuilderStore from '@/stores/page-builder-store';
import type { Component } from '@/types/page-builder';
import { GripVertical, Tag, Copy, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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

  // Handle ESC key to deselect component
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSelected) {
        actions.selectComponent(null);
      }
    };

    if (isSelected) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isSelected, actions]);

  // Handle click outside to deselect component
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSelected && ref.current && !ref.current.contains(e.target as Node)) {
        // Check if click is within properties panel
        const target = e.target as HTMLElement;
        const isInPropertiesPanel = target.closest('[data-properties-panel="true"]');

        // Only deselect if not clicking in properties panel
        if (!isInPropertiesPanel) {
          actions.selectComponent(null);
        }
      }
    };

    if (isSelected) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSelected, actions]);

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
        <div className="absolute -top-8 left-0 flex items-center gap-0 bg-background border border-border shadow-md rounded text-xs z-10 overflow-hidden">
          <div
            ref={drag}
            className="cursor-grab active:cursor-grabbing bg-muted hover:bg-muted/80 px-2 py-1.5 flex items-center border-r border-border transition-colors"
          >
            <GripVertical className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="px-3 py-1.5 bg-muted/30 border-r border-border flex items-center gap-1.5 pointer-events-none">
            <Tag className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wide">{component.type}</span>
          </div>
          <button
            onClick={handleDuplicate}
            title="Duplicate component"
            className="px-2 py-1.5 hover:bg-accent hover:text-accent-foreground border-r border-border transition-colors text-foreground"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleDelete}
            title="Delete component"
            className="px-2 py-1.5 hover:bg-destructive hover:text-destructive-foreground transition-colors text-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" />
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
