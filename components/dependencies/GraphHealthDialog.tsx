'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DependencyNode, DependencyEdge, GraphMetrics } from '@/types/dependency-graph';
import { calculateGraphMetrics } from '@/lib/dependencies/graphUtils';
import { animations } from '@/lib/dependencies/designTokens';
import {
  AlertTriangle,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface GraphHealthDialogProps {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GraphHealthDialog({
  nodes,
  edges,
  open,
  onOpenChange,
}: GraphHealthDialogProps) {
  const metrics: GraphMetrics = useMemo(
    () => calculateGraphMetrics(nodes, edges),
    [nodes, edges]
  );

  const hasIssues = metrics.circularDependencies.length > 0 || metrics.isolatedNodes.length > 0;
  const issueCount = metrics.circularDependencies.length + (metrics.isolatedNodes.length > 0 ? 1 : 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {hasIssues ? (
              <AlertTriangle className="w-5 h-5 text-destructive" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            )}
            Graph Health & Analytics
          </DialogTitle>
          <DialogDescription>
            {hasIssues
              ? `${issueCount} ${issueCount === 1 ? 'issue' : 'issues'} detected in your dependency graph`
              : 'No issues detected in your dependency graph'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Graph Health Status */}
          <motion.div
            className={`p-4 rounded-lg border-2 ${
              hasIssues ? 'bg-destructive/10 border-destructive/30' : 'bg-primary/10 border-primary/30'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={animations.spring.soft}
          >
            <div className="flex items-start gap-3">
              {hasIssues ? (
                <motion.div
                  animate={{
                    rotate: [0, -5, 5, -5, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                </motion.div>
              ) : (
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {hasIssues ? 'Issues Detected' : 'Graph is Healthy'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {hasIssues
                    ? 'Review the issues below and resolve them to maintain a healthy dependency graph'
                    : 'Your dependency graph is well-structured with no detected issues'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Issues Section */}
          {hasIssues && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Issues Requiring Attention</h4>

              {metrics.circularDependencies.length > 0 && (
                <motion.div
                  className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/30"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-destructive">
                      Circular Dependencies Detected
                    </p>
                    <p className="text-xs text-destructive/80 mt-1">
                      {metrics.circularDependencies.length} cycle(s) detected in the graph. Circular dependencies can cause build failures and runtime issues.
                    </p>
                  </div>
                </motion.div>
              )}

              {metrics.isolatedNodes.length > 0 && (
                <motion.div
                  className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg border border-secondary"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <AlertTriangle className="w-5 h-5 text-secondary-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-foreground">
                      Isolated Nodes Found
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metrics.isolatedNodes.length} node(s) have no connections. These may be orphaned or incomplete.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Key Metrics */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Key Metrics</h4>
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                className="p-4 bg-primary/10 rounded-lg border border-primary/30"
                whileHover={{ scale: 1.02 }}
                transition={animations.spring.soft}
              >
                <div className="text-3xl font-bold text-primary">
                  {metrics.totalNodes}
                </div>
                <div className="text-xs text-primary/80 mt-1">Total Nodes</div>
              </motion.div>

              <motion.div
                className="p-4 bg-accent/50 rounded-lg border border-accent"
                whileHover={{ scale: 1.02 }}
                transition={animations.spring.soft}
              >
                <div className="text-3xl font-bold text-accent-foreground">
                  {metrics.totalEdges}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Connections</div>
              </motion.div>

              <motion.div
                className="p-4 bg-secondary/50 rounded-lg border border-secondary"
                whileHover={{ scale: 1.02 }}
                transition={animations.spring.soft}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-secondary-foreground" />
                  <div className="text-3xl font-bold text-secondary-foreground">
                    {metrics.maxDepth}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Maximum Depth</div>
              </motion.div>

              <motion.div
                className="p-4 bg-muted rounded-lg border border-border"
                whileHover={{ scale: 1.02 }}
                transition={animations.spring.soft}
              >
                <div className="text-3xl font-bold text-foreground">
                  {metrics.criticalPath.length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Critical Path Length</div>
              </motion.div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Status Breakdown</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(metrics.nodesByStatus).map(([status, count]) => (
                <motion.div
                  key={status}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-sm text-muted-foreground capitalize">
                    {status.replace('-', ' ')}
                  </span>
                  <Badge variant="secondary" className="text-sm font-semibold">
                    {count}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
