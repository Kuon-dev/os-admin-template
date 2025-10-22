"use client";

import { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { cn } from '@/lib/utils';
import usePageBuilderStore from '@/stores/page-builder-store';
import type { DragItem } from '@/types/page-builder';

interface DropZoneProps {
  position: number;
  parentId?: string;
  className?: string;
}

export function DropZone({ position, parentId, className }: DropZoneProps) {
  const { ui, actions } = usePageBuilderStore();
  const activationTimeoutRef = useRef<NodeJS.Timeout>();

  // Check if this dropzone is the active one
  const isActive =
    ui.activeDropZone?.position === position &&
    ui.activeDropZone?.parentId === parentId;

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ['new-component', 'component'],
    drop: (item: DragItem) => {
      if (item.type === 'new-component' && item.componentType) {
        // Adding a new component from palette
        actions.addComponent(item.componentType, position, parentId);
      } else if (item.type === 'component' && item.componentId) {
        // Moving an existing component
        actions.moveComponent(item.componentId, position, parentId);
      }
      // Clear active dropzone after drop
      actions.clearActiveDropZone();
      return { position, parentId };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  // Handle activation with delay to prevent rapid switching
  useEffect(() => {
    if (isOver && canDrop) {
      // Set this dropzone as active after 150ms delay
      activationTimeoutRef.current = setTimeout(() => {
        actions.setActiveDropZone(position, parentId);
      }, 150);
    } else {
      // Clear pending activation if hover ends
      if (activationTimeoutRef.current) {
        clearTimeout(activationTimeoutRef.current);
      }
    }

    return () => {
      if (activationTimeoutRef.current) {
        clearTimeout(activationTimeoutRef.current);
      }
    };
  }, [isOver, canDrop, position, parentId, actions]);

  // Only the active dropzone can expand
  const shouldExpand = isActive && isOver && canDrop;
  // Show subtle hover state even when not active
  const isHovering = isOver && canDrop;

  return (
    <div
      ref={drop}
      className={cn(
        'relative transition-all duration-200',
        // Smooth height animation with better base size for hover detection
        shouldExpand ? 'h-12 my-2' : 'h-4 my-1',
        className
      )}
    >
      {/* Visual indicator - subtle when hovering, full when active */}
      {isHovering && (
        <div
          className={cn(
            'absolute inset-0 rounded-lg flex items-center justify-center transition-all duration-200',
            shouldExpand
              ? 'border-2 border-dashed border-primary bg-primary/10 animate-in fade-in'
              : 'border-2 border-dashed border-primary/30 bg-primary/5'
          )}
        >
          {shouldExpand && (
            <span className="text-sm font-medium text-primary animate-in fade-in duration-150">
              Drop here
            </span>
          )}
        </div>
      )}
    </div>
  );
}
