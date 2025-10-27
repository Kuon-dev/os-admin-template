'use client';

import { useCallback, useMemo, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ImperativePanelHandle } from 'react-resizable-panels';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

import { useGraphStore } from '@/lib/dependencies/useGraphStore';
import { filterNodes } from '@/lib/dependencies/graphUtils';
import { applyLayout } from '@/lib/dependencies/layoutAlgorithms';
import {
  ProjectNode,
  EpicNode,
  FeatureNode,
  TaskNode,
  MilestoneNode,
} from './CustomNodes';
import { ImprovedDependencyEdge } from './CustomEdges/ImprovedDependencyEdge';
import { CommandBar } from './CommandBar';
import { NodePropertiesPanel } from './NodePropertiesPanel';
import { GraphHealthDialog } from './GraphHealthDialog';
import { calculateGraphMetrics } from '@/lib/dependencies/graphUtils';
import { NodeType, LayoutAlgorithm, DependencyNode as DNode, DependencyEdge as DEdge } from '@/types/dependency-graph';

const nodeTypes = {
  custom: ProjectNode,
};

const edgeTypes = {
  custom: ImprovedDependencyEdge,
};

const defaultEdgeOptions = {
  type: 'custom',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
  },
};

function DependencyGraphInner() {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    selectedNode,
    searchQuery,
    filters,
    history,
    ui,
    setNodes: setStoreNodes,
    setEdges: setStoreEdges,
    addNode,
    updateNode,
    deleteNode,
    addEdge: addStoreEdge,
    selectNode,
    selectEdge,
    setSearchQuery,
    setFilters,
    undo,
    redo,
    reset,
    exportGraph,
    importGraph,
    togglePropertiesPanel,
    setHealthDialogOpen,
  } = useGraphStore();

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const propertiesPanelRef = useRef<ImperativePanelHandle>(null);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  // Calculate graph metrics for health status
  const graphMetrics = useMemo(
    () => calculateGraphMetrics(storeNodes, storeEdges),
    [storeNodes, storeEdges]
  );
  const hasGraphIssues = graphMetrics.circularDependencies.length > 0 || graphMetrics.isolatedNodes.length > 0;
  const issueCount = graphMetrics.circularDependencies.length + (graphMetrics.isolatedNodes.length > 0 ? 1 : 0);

  // Sync store with React Flow state
  useMemo(() => {
    setNodes(storeNodes);
    setEdges(storeEdges);
  }, [storeNodes, storeEdges, setNodes, setEdges]);

  // Apply hierarchical layout on initial mount
  useEffect(() => {
    if (storeNodes.length > 0 && storeEdges.length > 0) {
      const layoutedNodes = applyLayout(storeNodes, storeEdges, 'hierarchical');
      setStoreNodes(layoutedNodes);
    }
  }, []); // Run once on mount only

  // Sync properties panel collapsed state with ResizablePanel
  useEffect(() => {
    if (propertiesPanelRef.current) {
      if (ui.propertiesPanelCollapsed) {
        propertiesPanelRef.current.collapse();
      } else {
        propertiesPanelRef.current.expand();
      }
    }
  }, [ui.propertiesPanelCollapsed]);


  // Filter nodes based on search and filters
  const filteredNodeIds = useMemo(() => {
    const filtered = filterNodes(storeNodes, searchQuery, filters);
    return new Set(filtered.map(node => node.id));
  }, [storeNodes, searchQuery, filters]);

  // Apply opacity to filtered out nodes
  const displayNodes = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      style: {
        ...node.style,
        opacity: filteredNodeIds.size === 0 || filteredNodeIds.has(node.id) ? 1 : 0.2,
      },
    }));
  }, [nodes, filteredNodeIds]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: DEdge = {
        id: `e${edges.length + 1}`,
        source: connection.source!,
        target: connection.target!,
        type: 'custom',
        data: {
          dependencyType: 'requires',
          strength: 'medium',
        },
      };
      addStoreEdge(newEdge);
    },
    [edges.length, addStoreEdge]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      selectNode(node as DNode);
    },
    [selectNode]
  );

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      selectEdge(edge as DEdge);
    },
    [selectEdge]
  );

  const handleAddNode = useCallback(
    (type: NodeType) => {
      const newNode: DNode = {
        id: `node-${Date.now()}`,
        type: 'custom',
        position: { x: Math.random() * 500 + 100, y: Math.random() * 500 + 100 },
        data: {
          label: `New ${type}`,
          type,
          status: 'planning',
          owner: 'Unassigned',
          progress: 0,
        },
      };
      addNode(newNode);
    },
    [addNode]
  );

  const handleLayout = useCallback(
    (algorithm: LayoutAlgorithm) => {
      const layoutedNodes = applyLayout(storeNodes, storeEdges, algorithm);
      setStoreNodes(layoutedNodes);
    },
    [storeNodes, storeEdges, setStoreNodes]
  );

  const handleExport = useCallback(() => {
    const data = exportGraph();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dependency-graph.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [exportGraph]);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          importGraph(content);
        };
        reader.readAsText(file);
      }
      event.target.value = '';
    },
    [importGraph]
  );

  const handleReset = useCallback(() => {
    if (confirm('Are you sure you want to reset the graph to default? All changes will be lost.')) {
      reset();
    }
  }, [reset]);

  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 300 });
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 300 });
  }, [zoomOut]);

  const handleFitView = useCallback(() => {
    fitView({ duration: 300, padding: 0.2 });
  }, [fitView]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Command Bar */}
      <CommandBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onUndo={undo}
        onRedo={redo}
        onLayout={handleLayout}
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
        onOpenHealthDialog={() => setHealthDialogOpen(true)}
        onAddNode={handleAddNode}
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
        hasGraphIssues={hasGraphIssues}
        issueCount={issueCount}
      />

      {/* Health Dialog */}
      <GraphHealthDialog
        nodes={storeNodes}
        edges={storeEdges}
        open={ui.healthDialogOpen}
        onOpenChange={setHealthDialogOpen}
      />

      {/* Main Editor Area */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Canvas - Center (Flexible) */}
          <ResizablePanel defaultSize={75}>
            <div className="h-full relative">
              <ReactFlow
                nodes={displayNodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                fitView
                minZoom={0.1}
                maxZoom={2}
              >
                <Background />
                <MiniMap
                  nodeStrokeWidth={3}
                  zoomable
                  pannable
                  className="bg-background"
                />
              </ReactFlow>

              {/* Hidden file input for import */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Properties Panel - Right Sidebar (Resizable & Collapsible) */}
          <ResizablePanel
            ref={propertiesPanelRef}
            defaultSize={25}
            minSize={20}
            maxSize={40}
            collapsible={true}
            collapsedSize={0}
            onCollapse={() => {
              if (!ui.propertiesPanelCollapsed) {
                togglePropertiesPanel();
              }
            }}
            onExpand={() => {
              if (ui.propertiesPanelCollapsed) {
                togglePropertiesPanel();
              }
            }}
          >
            <NodePropertiesPanel
              node={selectedNode}
              isCollapsed={ui.propertiesPanelCollapsed}
              onUpdate={updateNode}
              onDelete={deleteNode}
              onToggleCollapse={togglePropertiesPanel}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export function DependencyGraph() {
  return (
    <ReactFlowProvider>
      <DependencyGraphInner />
    </ReactFlowProvider>
  );
}
