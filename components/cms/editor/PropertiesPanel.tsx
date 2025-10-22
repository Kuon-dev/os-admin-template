"use client";

import { ChevronRight, Settings, FileQuestion, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import usePageBuilderStore from '@/stores/page-builder-store';
import { getPropertiesComponent } from './properties/PropertiesRegistry';

/**
 * Main properties panel with collapse/expand functionality
 *
 * Features:
 * - Resizable with min/max constraints (250-500px)
 * - Collapsible with toggle button
 * - State persisted to localStorage
 * - Simplified property display (no section collapsibility)
 */
export function PropertiesPanel() {
  const { currentPage, selectedComponentId, ui, actions } = usePageBuilderStore();

  // Find the selected component
  const findComponent = (id: string) => {
    if (!currentPage) return null;

    const search = (components: any[]): any => {
      for (const comp of components) {
        if (comp.id === id) return comp;
        if (comp.children) {
          const found = search(comp.children);
          if (found) return found;
        }
      }
      return null;
    };

    return search(currentPage.components);
  };

  const selectedComponent = selectedComponentId
    ? findComponent(selectedComponentId)
    : null;

  // Collapsed state - show narrow strip with expand button
  if (ui.propertiesPanelCollapsed) {
    return (
      <div data-properties-panel="true" className="flex flex-col items-center h-full bg-background border-l">
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 h-8 w-8 p-0"
          onClick={() => actions.togglePropertiesPanel()}
          title="Expand Properties Panel"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
        </Button>
        <div className="flex-1 flex items-center justify-center py-4">
          <div className="flex flex-col items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground writing-mode-vertical rotate-180">
              Properties
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Expanded state - show full panel
  return (
    <div data-properties-panel="true" className="flex flex-col h-full bg-background border-l overflow-hidden">
      {/* Header with collapse button */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Properties</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => actions.togglePropertiesPanel()}
          title="Collapse Properties Panel"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Content area with proper overflow handling */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {!selectedComponent ? (
          // No component selected
          <div className="flex items-center justify-center h-full p-4">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Layers />
                </EmptyMedia>
                <EmptyTitle>No Component Selected</EmptyTitle>
                <EmptyDescription>
                  Select a component from the canvas to edit its properties
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : (() => {
          // Get the properties component from registry
          const PropertiesComponent = getPropertiesComponent(selectedComponent.type);

          // No properties panel registered for this component type
          if (!PropertiesComponent) {
            return (
              <div className="flex items-center justify-center h-full p-4">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FileQuestion />
                    </EmptyMedia>
                    <EmptyTitle>No Properties Available</EmptyTitle>
                    <EmptyDescription>
                      The <span className="font-medium">{selectedComponent.type}</span> component doesn't have a property panel yet.
                      <br />
                      <span className="text-xs">A property panel needs to be created and registered.</span>
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </div>
            );
          }

          // Update props function
          const updateProps = (updates: any) => {
            actions.updateComponent(selectedComponent.id, updates);
          };

          return (
            <div className="p-4 pb-16 space-y-4">
              {/* Component type info */}
              <div className="pb-3 border-b">
                <h4 className="font-medium text-sm capitalize">
                  {selectedComponent.type}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  ID: {selectedComponent.id}
                </p>
              </div>

              {/* Render the property panel */}
              <PropertiesComponent
                props={selectedComponent.props}
                updateProps={updateProps}
              />
            </div>
          );
        })()}
      </div>
    </div>
  );
}
