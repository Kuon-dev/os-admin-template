"use client";

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
  const { actions } = usePageBuilderStore();

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
      return { position, parentId };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  const showDropZone = isOver && canDrop;

  return (
    <div
      ref={drop}
      className={cn(
        'relative transition-all duration-200',
        showDropZone ? 'h-12 my-2' : 'h-2 my-0',
        className
      )}
    >
      {showDropZone && (
        <div className="absolute inset-0 border-2 border-dashed border-primary bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="text-sm font-medium text-primary">Drop here</span>
        </div>
      )}
    </div>
  );
}
