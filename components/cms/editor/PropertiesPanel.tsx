"use client";

import { ChevronRight, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
      <div className="flex flex-col items-center h-full bg-background border-l">
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
    <div className="flex flex-col h-full bg-background border-l overflow-hidden">
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
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
            <p className="text-sm">Select a component to edit its properties</p>
          </div>
        ) : (() => {
          // Get the properties component from registry
          const PropertiesComponent = getPropertiesComponent(selectedComponent.type);

          // No properties panel registered for this component type
          if (!PropertiesComponent) {
            return (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                <p className="text-sm mb-2">
                  No properties available for <span className="font-medium">{selectedComponent.type}</span>
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Property panel needs to be created and registered
                </p>
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
