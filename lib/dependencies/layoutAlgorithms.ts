import dagre from 'dagre';
import { DependencyNode, DependencyEdge, LayoutAlgorithm } from '@/types/dependency-graph';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 150;

/**
 * Apply layout algorithm to nodes
 */
export function applyLayout(
  nodes: DependencyNode[],
  edges: DependencyEdge[],
  algorithm: LayoutAlgorithm
): DependencyNode[] {
  if (algorithm === 'hierarchical') {
    return applyHierarchicalLayout(nodes, edges);
  } else {
    return applyForceDirectedLayout(nodes, edges);
  }
}

/**
 * Hierarchical layout using dagre
 */
function applyHierarchicalLayout(
  nodes: DependencyNode[],
  edges: DependencyEdge[]
): DependencyNode[] {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 150 });
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes to graph
  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Add edges to graph
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(g);

  // Update node positions
  return nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });
}

/**
 * Simple force-directed layout
 */
function applyForceDirectedLayout(
  nodes: DependencyNode[],
  edges: DependencyEdge[]
): DependencyNode[] {
  const iterations = 100;
  const k = 300; // Ideal distance between nodes
  const c = 0.1; // Cooling factor

  // Initialize positions if not set
  let positions = nodes.map((node) => ({
    id: node.id,
    x: node.position.x || Math.random() * 800,
    y: node.position.y || Math.random() * 600,
    vx: 0,
    vy: 0,
  }));

  // Create adjacency map
  const adjacencyMap = new Map<string, Set<string>>();
  edges.forEach((edge) => {
    if (!adjacencyMap.has(edge.source)) {
      adjacencyMap.set(edge.source, new Set());
    }
    if (!adjacencyMap.has(edge.target)) {
      adjacencyMap.set(edge.target, new Set());
    }
    adjacencyMap.get(edge.source)!.add(edge.target);
    adjacencyMap.get(edge.target)!.add(edge.source);
  });

  // Run simulation
  for (let iter = 0; iter < iterations; iter++) {
    const temperature = 1 - iter / iterations;

    // Calculate repulsive forces between all nodes
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[j].x - positions[i].x;
        const dy = positions[j].y - positions[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (k * k) / distance;

        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        positions[i].vx -= fx * c;
        positions[i].vy -= fy * c;
        positions[j].vx += fx * c;
        positions[j].vy += fy * c;
      }
    }

    // Calculate attractive forces for connected nodes
    edges.forEach((edge) => {
      const source = positions.find((p) => p.id === edge.source);
      const target = positions.find((p) => p.id === edge.target);

      if (source && target) {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (distance * distance) / k;

        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        source.vx += fx * c;
        source.vy += fy * c;
        target.vx -= fx * c;
        target.vy -= fy * c;
      }
    });

    // Update positions
    positions.forEach((pos) => {
      pos.x += pos.vx * temperature;
      pos.y += pos.vy * temperature;
      pos.vx *= 0.8; // Damping
      pos.vy *= 0.8;
    });
  }

  // Center the graph
  const minX = Math.min(...positions.map((p) => p.x));
  const minY = Math.min(...positions.map((p) => p.y));
  const offsetX = 100 - minX;
  const offsetY = 100 - minY;

  // Return updated nodes
  return nodes.map((node) => {
    const pos = positions.find((p) => p.id === node.id);
    return {
      ...node,
      position: {
        x: (pos?.x || 0) + offsetX,
        y: (pos?.y || 0) + offsetY,
      },
    };
  });
}
