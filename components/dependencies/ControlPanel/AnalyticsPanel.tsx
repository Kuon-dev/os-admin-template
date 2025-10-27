'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DependencyNode, DependencyEdge, GraphMetrics } from '@/types/dependency-graph';
import { calculateGraphMetrics } from '@/lib/dependencies/graphUtils';
import {
  AlertTriangle,
  BarChart3,
  GitBranch,
  Layers,
  TrendingUp,
} from 'lucide-react';

interface AnalyticsPanelProps {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

export function AnalyticsPanel({ nodes, edges }: AnalyticsPanelProps) {
  const metrics: GraphMetrics = useMemo(
    () => calculateGraphMetrics(nodes, edges),
    [nodes, edges]
  );

  const hasCircularDependencies = metrics.circularDependencies.length > 0;
  const hasIsolatedNodes = metrics.isolatedNodes.length > 0;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Graph Analytics
          </h3>
          <p className="text-xs text-muted-foreground">
            Metrics and insights about your dependency graph
          </p>
        </div>

        <Separator />

        {/* Warnings */}
        {(hasCircularDependencies || hasIsolatedNodes) && (
          <>
            <div className="space-y-2">
              {hasCircularDependencies && (
                <div className="flex items-start gap-2 p-2 bg-red-50 rounded-md border border-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-red-900">
                      Circular Dependencies Detected
                    </p>
                    <p className="text-xs text-red-700 mt-0.5">
                      {metrics.circularDependencies.length} cycle(s) found
                    </p>
                  </div>
                </div>
              )}

              {hasIsolatedNodes && (
                <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded-md border border-yellow-200">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-yellow-900">
                      Isolated Nodes
                    </p>
                    <p className="text-xs text-yellow-700 mt-0.5">
                      {metrics.isolatedNodes.length} node(s) with no connections
                    </p>
                  </div>
                </div>
              )}
            </div>
            <Separator />
          </>
        )}

        {/* Key Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total Nodes</span>
            <Badge variant="secondary">{metrics.totalNodes}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total Edges</span>
            <Badge variant="secondary">{metrics.totalEdges}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Max Depth
            </span>
            <Badge variant="secondary">{metrics.maxDepth}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Critical Path
            </span>
            <Badge variant="secondary">{metrics.criticalPath.length} nodes</Badge>
          </div>
        </div>

        <Separator />

        {/* Nodes by Status */}
        <div>
          <h4 className="text-xs font-medium mb-2">Nodes by Status</h4>
          <div className="space-y-2">
            {Object.entries(metrics.nodesByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground capitalize">
                  {status.replace('-', ' ')}
                </span>
                <Badge variant="outline" className="text-xs">
                  {count}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Nodes by Type */}
        <div>
          <h4 className="text-xs font-medium mb-2">Nodes by Type</h4>
          <div className="space-y-2">
            {Object.entries(metrics.nodesByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground capitalize">
                  {type}
                </span>
                <Badge variant="outline" className="text-xs">
                  {count}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
