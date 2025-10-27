import { DependencyNode, DependencyEdge, GraphMetrics, NodeStatus, NodeType } from '@/types/dependency-graph';

/**
 * Detects circular dependencies in the graph using DFS
 */
export function detectCircularDependencies(
  nodes: DependencyNode[],
  edges: DependencyEdge[]
): string[][] {
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const adjacencyList = buildAdjacencyList(edges);

  function dfs(nodeId: string, path: string[]): void {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, [...path]);
      } else if (recursionStack.has(neighbor)) {
        // Found a cycle
        const cycleStart = path.indexOf(neighbor);
        const cycle = path.slice(cycleStart);
        cycles.push([...cycle, neighbor]);
      }
    }

    recursionStack.delete(nodeId);
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      dfs(node.id, []);
    }
  }

  return cycles;
}

/**
 * Finds isolated nodes (no incoming or outgoing edges)
 */
export function findIsolatedNodes(nodes: DependencyNode[], edges: DependencyEdge[]): string[] {
  const connectedNodes = new Set<string>();

  edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  return nodes
    .filter(node => !connectedNodes.has(node.id))
    .map(node => node.id);
}

/**
 * Calculates the maximum depth of the dependency graph
 */
export function calculateMaxDepth(nodes: DependencyNode[], edges: DependencyEdge[]): number {
  const adjacencyList = buildAdjacencyList(edges);
  const visited = new Set<string>();
  let maxDepth = 0;

  function dfs(nodeId: string, depth: number): number {
    visited.add(nodeId);
    let currentMaxDepth = depth;

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        currentMaxDepth = Math.max(currentMaxDepth, dfs(neighbor, depth + 1));
      }
    }

    return currentMaxDepth;
  }

  // Find root nodes (nodes with no incoming edges)
  const incomingEdges = new Set(edges.map(e => e.target));
  const rootNodes = nodes.filter(node => !incomingEdges.has(node.id));

  for (const root of rootNodes) {
    visited.clear();
    maxDepth = Math.max(maxDepth, dfs(root.id, 0));
  }

  return maxDepth;
}

/**
 * Finds the critical path (longest path) in the dependency graph
 */
export function findCriticalPath(nodes: DependencyNode[], edges: DependencyEdge[]): string[] {
  const adjacencyList = buildAdjacencyList(edges);
  let longestPath: string[] = [];

  function dfs(nodeId: string, currentPath: string[]): string[] {
    const neighbors = adjacencyList.get(nodeId) || [];

    if (neighbors.length === 0) {
      return [...currentPath, nodeId];
    }

    let maxPath = [...currentPath, nodeId];

    for (const neighbor of neighbors) {
      if (!currentPath.includes(neighbor)) {
        const path = dfs(neighbor, [...currentPath, nodeId]);
        if (path.length > maxPath.length) {
          maxPath = path;
        }
      }
    }

    return maxPath;
  }

  // Find root nodes
  const incomingEdges = new Set(edges.map(e => e.target));
  const rootNodes = nodes.filter(node => !incomingEdges.has(node.id));

  for (const root of rootNodes) {
    const path = dfs(root.id, []);
    if (path.length > longestPath.length) {
      longestPath = path;
    }
  }

  return longestPath;
}

/**
 * Calculates comprehensive graph metrics
 */
export function calculateGraphMetrics(
  nodes: DependencyNode[],
  edges: DependencyEdge[]
): GraphMetrics {
  const nodesByStatus = nodes.reduce((acc, node) => {
    const status = node.data.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<NodeStatus, number>);

  const nodesByType = nodes.reduce((acc, node) => {
    const type = node.data.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<NodeType, number>);

  return {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    maxDepth: calculateMaxDepth(nodes, edges),
    circularDependencies: detectCircularDependencies(nodes, edges),
    isolatedNodes: findIsolatedNodes(nodes, edges),
    criticalPath: findCriticalPath(nodes, edges),
    nodesByStatus,
    nodesByType,
  };
}

/**
 * Builds an adjacency list from edges
 */
function buildAdjacencyList(edges: DependencyEdge[]): Map<string, string[]> {
  const adjacencyList = new Map<string, string[]>();

  edges.forEach(edge => {
    if (!adjacencyList.has(edge.source)) {
      adjacencyList.set(edge.source, []);
    }
    adjacencyList.get(edge.source)!.push(edge.target);
  });

  return adjacencyList;
}

/**
 * Gets all dependencies (upstream and downstream) of a node
 */
export function getNodeDependencies(
  nodeId: string,
  edges: DependencyEdge[],
  direction: 'upstream' | 'downstream' | 'both' = 'both'
): string[] {
  const dependencies = new Set<string>();

  if (direction === 'upstream' || direction === 'both') {
    // Find all nodes that this node depends on (incoming edges)
    edges
      .filter(edge => edge.target === nodeId)
      .forEach(edge => dependencies.add(edge.source));
  }

  if (direction === 'downstream' || direction === 'both') {
    // Find all nodes that depend on this node (outgoing edges)
    edges
      .filter(edge => edge.source === nodeId)
      .forEach(edge => dependencies.add(edge.target));
  }

  return Array.from(dependencies);
}

/**
 * Filters nodes based on search query and filters
 */
export function filterNodes(
  nodes: DependencyNode[],
  searchQuery: string,
  filters: {
    nodeTypes: NodeType[];
    statuses: NodeStatus[];
    owners: string[];
  }
): DependencyNode[] {
  return nodes.filter(node => {
    // Search filter
    const matchesSearch = !searchQuery ||
      node.data.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.data.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    const matchesType = filters.nodeTypes.length === 0 ||
      filters.nodeTypes.includes(node.data.type);

    // Status filter
    const matchesStatus = filters.statuses.length === 0 ||
      filters.statuses.includes(node.data.status);

    // Owner filter
    const matchesOwner = filters.owners.length === 0 ||
      filters.owners.includes(node.data.owner);

    return matchesSearch && matchesType && matchesStatus && matchesOwner;
  });
}
