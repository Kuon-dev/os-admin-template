import { create } from 'zustand';
import { GraphState, GraphActions, DependencyNode, DependencyEdge, NodeData, EdgeData } from '@/types/dependency-graph';
import { initialNodes, initialEdges } from './mockData';

const MAX_HISTORY = 50;

type GraphStore = GraphState & GraphActions;

export const useGraphStore = create<GraphStore>((set, get) => ({
  // Initial state
  nodes: initialNodes,
  edges: initialEdges,
  selectedNode: null,
  selectedEdge: null,
  searchQuery: '',
  filters: {
    nodeTypes: [],
    statuses: [],
    owners: [],
  },
  history: {
    past: [],
    future: [],
  },
  ui: {
    propertiesPanelCollapsed: false,
    healthDialogOpen: false,
  },

  // Actions
  setNodes: (nodes) => {
    set({ nodes });
  },

  setEdges: (edges) => {
    set({ edges });
  },

  addNode: (node) => {
    const { nodes, edges } = get();
    set({
      history: {
        past: [...get().history.past.slice(-MAX_HISTORY + 1), { nodes, edges }],
        future: [],
      },
      nodes: [...nodes, node],
    });
  },

  updateNode: (id, data) => {
    const { nodes, edges } = get();
    set({
      history: {
        past: [...get().history.past.slice(-MAX_HISTORY + 1), { nodes, edges }],
        future: [],
      },
      nodes: nodes.map(node =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
      selectedNode: get().selectedNode?.id === id
        ? { ...get().selectedNode!, data: { ...get().selectedNode!.data, ...data } }
        : get().selectedNode,
    });
  },

  deleteNode: (id) => {
    const { nodes, edges } = get();
    set({
      history: {
        past: [...get().history.past.slice(-MAX_HISTORY + 1), { nodes, edges }],
        future: [],
      },
      nodes: nodes.filter(node => node.id !== id),
      edges: edges.filter(edge => edge.source !== id && edge.target !== id),
      selectedNode: get().selectedNode?.id === id ? null : get().selectedNode,
    });
  },

  addEdge: (edge) => {
    const { nodes, edges } = get();
    set({
      history: {
        past: [...get().history.past.slice(-MAX_HISTORY + 1), { nodes, edges }],
        future: [],
      },
      edges: [...edges, edge],
    });
  },

  updateEdge: (id, data) => {
    const { nodes, edges } = get();
    set({
      history: {
        past: [...get().history.past.slice(-MAX_HISTORY + 1), { nodes, edges }],
        future: [],
      },
      edges: edges.map(edge =>
        edge.id === id
          ? { ...edge, data: { ...edge.data, ...data } }
          : edge
      ),
      selectedEdge: get().selectedEdge?.id === id
        ? { ...get().selectedEdge!, data: { ...get().selectedEdge!.data, ...data } }
        : get().selectedEdge,
    });
  },

  deleteEdge: (id) => {
    const { nodes, edges } = get();
    set({
      history: {
        past: [...get().history.past.slice(-MAX_HISTORY + 1), { nodes, edges }],
        future: [],
      },
      edges: edges.filter(edge => edge.id !== id),
      selectedEdge: get().selectedEdge?.id === id ? null : get().selectedEdge,
    });
  },

  selectNode: (node) => {
    set({ selectedNode: node, selectedEdge: null });
  },

  selectEdge: (edge) => {
    set({ selectedEdge: edge, selectedNode: null });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  undo: () => {
    const { history } = get();
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);

    set({
      nodes: previous.nodes,
      edges: previous.edges,
      history: {
        past: newPast,
        future: [{ nodes: get().nodes, edges: get().edges }, ...history.future],
      },
    });
  },

  redo: () => {
    const { history } = get();
    if (history.future.length === 0) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    set({
      nodes: next.nodes,
      edges: next.edges,
      history: {
        past: [...history.past, { nodes: get().nodes, edges: get().edges }],
        future: newFuture,
      },
    });
  },

  reset: () => {
    set({
      nodes: initialNodes,
      edges: initialEdges,
      selectedNode: null,
      selectedEdge: null,
      searchQuery: '',
      filters: {
        nodeTypes: [],
        statuses: [],
        owners: [],
      },
      history: {
        past: [],
        future: [],
      },
    });
  },

  exportGraph: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ nodes, edges }, null, 2);
  },

  importGraph: (data) => {
    try {
      const { nodes, edges } = JSON.parse(data);
      const { nodes: currentNodes, edges: currentEdges } = get();
      set({
        history: {
          past: [...get().history.past.slice(-MAX_HISTORY + 1), { nodes: currentNodes, edges: currentEdges }],
          future: [],
        },
        nodes,
        edges,
      });
    } catch (error) {
      console.error('Failed to import graph:', error);
    }
  },

  togglePropertiesPanel: () => {
    set({
      ui: {
        ...get().ui,
        propertiesPanelCollapsed: !get().ui.propertiesPanelCollapsed,
      },
    });
  },

  setHealthDialogOpen: (open: boolean) => {
    set({
      ui: {
        ...get().ui,
        healthDialogOpen: open,
      },
    });
  },
}));
