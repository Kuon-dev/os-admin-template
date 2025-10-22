"use client";

import { cn } from '@/lib/utils';
import usePageBuilderStore from '@/stores/page-builder-store';
import { ComponentRenderer } from '../components/ComponentRenderer';
import { DropZone } from './DropZone';

export function Canvas() {
  const { currentPage, ui } = usePageBuilderStore();

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <p>No page loaded</p>
        </div>
      </div>
    );
  }

  const getCanvasWidth = () => {
    switch (ui.deviceMode) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
        return 'max-w-[1440px]';
      default:
        return 'max-w-full';
    }
  };

  return (
    <div className="flex justify-center p-8 min-h-full">
      <div
        className={cn(
          'w-full bg-background rounded-lg shadow-lg transition-all duration-300',
          getCanvasWidth(),
          ui.showGrid && 'bg-grid-pattern'
        )}
      >
        {/* Canvas Header */}
        <div className="border-b border-border p-4">
          <h2 className="text-lg font-semibold">{currentPage.name}</h2>
          <p className="text-sm text-muted-foreground">/{currentPage.slug}</p>
        </div>

        {/* Canvas Content */}
        <div className="p-6 min-h-[600px]">
          {currentPage.components.length === 0 ? (
            <DropZone position={0} className="h-full min-h-[500px]" />
          ) : (
            <div>
              {/* Drop zone at the beginning */}
              <DropZone position={0} />

              {/* Components with drop zones between them */}
              {currentPage.components.map((component, index) => (
                <div key={component.id}>
                  <ComponentRenderer
                    component={component}
                    index={index}
                  />
                  {/* Drop zone after each component */}
                  <DropZone position={index + 1} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
