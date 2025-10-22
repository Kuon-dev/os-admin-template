"use client";

import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ImperativePanelHandle } from 'react-resizable-panels';
import usePageBuilderStore from '@/stores/page-builder-store';
import { Toolbar } from '@/components/cms/editor/Toolbar';
import { ComponentPalette } from '@/components/cms/editor/ComponentPalette';
import { Canvas } from '@/components/cms/editor/Canvas';
import { PropertiesPanel } from '@/components/cms/editor/PropertiesPanel';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

export default function CMSEditorPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;
  const { currentPage, ui, actions } = usePageBuilderStore();
  const propertiesPanelRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    if (pageId) {
      actions.loadPage(pageId);
    }

    return () => {
      // Clear history when leaving editor
      actions.clearHistory();
    };
  }, [pageId]);

  // Sync collapsed state with ResizablePanel
  useEffect(() => {
    if (propertiesPanelRef.current) {
      if (ui.propertiesPanelCollapsed) {
        propertiesPanelRef.current.collapse();
      } else {
        propertiesPanelRef.current.expand();
      }
    }
  }, [ui.propertiesPanelCollapsed]);

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading page...</div>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <Toolbar />

        {/* Main Editor Area */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Component Palette - Left Sidebar (Fixed width) */}
            <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
              <ComponentPalette />
            </ResizablePanel>

            <ResizableHandle />

            {/* Canvas - Center (Flexible) */}
            <ResizablePanel defaultSize={55}>
              <div className="h-full overflow-auto bg-muted/30">
                <Canvas />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Properties Panel - Right Sidebar (Resizable & Collapsible) */}
            <ResizablePanel
              ref={propertiesPanelRef}
              defaultSize={20}
              minSize={15}
              maxSize={35}
              collapsible={true}
              collapsedSize={0}
              onCollapse={() => {
                if (!ui.propertiesPanelCollapsed) {
                  actions.togglePropertiesPanel();
                }
              }}
              onExpand={() => {
                if (ui.propertiesPanelCollapsed) {
                  actions.togglePropertiesPanel();
                }
              }}
            >
              <PropertiesPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </DndProvider>
  );
}
