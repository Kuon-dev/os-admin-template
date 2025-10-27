import { Node, Edge } from 'reactflow';

export type NodeType = 'project' | 'feature' | 'epic' | 'task' | 'milestone';
export type NodeStatus = 'planning' | 'in-progress' | 'completed' | 'blocked' | 'on-hold';
export type DependencyType = 'blocks' | 'requires' | 'relates-to';
export type LayoutAlgorithm = 'hierarchical' | 'force-directed';

export interface NodeData {
  label: string;
  status: NodeStatus;
  owner: string;
  ownerAvatar?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  progress?: number;
  type: NodeType;
}

export interface EdgeData {
  dependencyType: DependencyType;
  strength?: 'weak' | 'medium' | 'strong';
}

export type DependencyNode = Node<NodeData>;
export type DependencyEdge = Edge<EdgeData>;

export interface GraphState {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
  selectedNode: DependencyNode | null;
  selectedEdge: DependencyEdge | null;
  searchQuery: string;
  filters: {
    nodeTypes: NodeType[];
    statuses: NodeStatus[];
    owners: string[];
  };
  history: {
    past: { nodes: DependencyNode[]; edges: DependencyEdge[] }[];
    future: { nodes: DependencyNode[]; edges: DependencyEdge[] }[];
  };
  ui: {
    propertiesPanelCollapsed: boolean;
    healthDialogOpen: boolean;
  };
}

export interface GraphActions {
  setNodes: (nodes: DependencyNode[]) => void;
  setEdges: (edges: DependencyEdge[]) => void;
  addNode: (node: DependencyNode) => void;
  updateNode: (id: string, data: Partial<NodeData>) => void;
  deleteNode: (id: string) => void;
  addEdge: (edge: DependencyEdge) => void;
  updateEdge: (id: string, data: Partial<EdgeData>) => void;
  deleteEdge: (id: string) => void;
  selectNode: (node: DependencyNode | null) => void;
  selectEdge: (edge: DependencyEdge | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<GraphState['filters']>) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  exportGraph: () => string;
  importGraph: (data: string) => void;
  togglePropertiesPanel: () => void;
  setHealthDialogOpen: (open: boolean) => void;
}

export interface GraphMetrics {
  totalNodes: number;
  totalEdges: number;
  maxDepth: number;
  circularDependencies: string[][];
  isolatedNodes: string[];
  criticalPath: string[];
  nodesByStatus: Record<NodeStatus, number>;
  nodesByType: Record<NodeType, number>;
}
