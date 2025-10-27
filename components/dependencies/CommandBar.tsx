'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Command,
  Search,
  Undo2,
  Redo2,
  Download,
  Upload,
  LayoutGrid,
  ZoomIn,
  ZoomOut,
  Maximize,
  RefreshCw,
  Keyboard,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { animations, glass, spacing } from '@/lib/dependencies/designTokens';
import { LayoutAlgorithm, NodeType } from '@/types/dependency-graph';

interface CommandBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onLayout: (algorithm: LayoutAlgorithm) => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onOpenHealthDialog: () => void;
  onAddNode: (type: NodeType) => void;
  canUndo: boolean;
  canRedo: boolean;
  hasGraphIssues: boolean;
  issueCount: number;
}

export function CommandBar({
  searchQuery,
  onSearchChange,
  onUndo,
  onRedo,
  onLayout,
  onExport,
  onImport,
  onReset,
  onZoomIn,
  onZoomOut,
  onFitView,
  onOpenHealthDialog,
  onAddNode,
  canUndo,
  canRedo,
  hasGraphIssues,
  issueCount,
}: CommandBarProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search focus
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('graph-search')?.focus();
      }
      // Cmd/Ctrl + Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo();
      }
      // Cmd/Ctrl + Shift + Z for redo
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        onRedo();
      }
      // Cmd/Ctrl + = for zoom in
      if ((e.metaKey || e.ctrlKey) && e.key === '=') {
        e.preventDefault();
        onZoomIn();
      }
      // Cmd/Ctrl + - for zoom out
      if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault();
        onZoomOut();
      }
      // Cmd/Ctrl + 0 for fit view
      if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        onFitView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, onZoomIn, onZoomOut, onFitView]);

  return (
    <TooltipProvider delayDuration={200}>
      <motion.div
        className="w-full border-b border-border bg-card/80 backdrop-blur-sm"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={animations.spring.medium}
      >
        <div className="flex items-center gap-2 px-6 py-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="graph-search"
              type="text"
              placeholder="Search nodes... (⌘K)"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-9 bg-background/50 border-input focus:bg-background transition-colors"
            />
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-border" />

          {/* Add Node */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm" className="h-9 px-3 gap-2">
                    <Plus className="w-4 h-4" />
                    Add Node
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Add a new node to the graph</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel className="text-xs">Node Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAddNode('project')}>
                <span className="text-sm">Project</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddNode('epic')}>
                <span className="text-sm">Epic</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddNode('feature')}>
                <span className="text-sm">Feature</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddNode('task')}>
                <span className="text-sm">Task</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddNode('milestone')}>
                <span className="text-sm">Milestone</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Divider */}
          <div className="h-6 w-px bg-border" />

          {/* Graph Health */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenHealthDialog}
                className={`h-9 px-3 gap-2 ${hasGraphIssues ? 'text-destructive hover:text-destructive' : 'text-primary hover:text-primary'}`}
              >
                {hasGraphIssues ? (
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
                    <AlertTriangle className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span className="text-xs font-medium">
                  {hasGraphIssues ? 'Issues' : 'Healthy'}
                </span>
                {hasGraphIssues && issueCount > 0 && (
                  <Badge variant="destructive" className="h-5 min-w-5 px-1 text-xs">
                    {issueCount}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                {hasGraphIssues
                  ? `${issueCount} ${issueCount === 1 ? 'issue' : 'issues'} found - Click to view details`
                  : 'Graph is healthy - Click to view analytics'}
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Divider */}
          <div className="h-6 w-px bg-border" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onUndo}
                  disabled={!canUndo}
                  className="h-9 px-2"
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Undo (⌘Z)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRedo}
                  disabled={!canRedo}
                  className="h-9 px-2"
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Redo (⌘⇧Z)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-border" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onZoomOut}
                  className="h-9 px-2"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Zoom Out (⌘-)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onZoomIn}
                  className="h-9 px-2"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Zoom In (⌘=)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onFitView}
                  className="h-9 px-2"
                >
                  <Maximize className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Fit View (⌘0)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-border" />

          {/* Layout Menu */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 px-2">
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Auto Layout</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-xs">Layout Algorithm</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onLayout('hierarchical')}>
                Hierarchical (Top-Down)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLayout('force-directed')}>
                Force Directed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Actions Menu */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 px-2">
                    <Command className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Actions</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-xs">File</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onExport}>
                <Download className="w-4 h-4 mr-2" />
                Export Graph
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onImport}>
                <Upload className="w-4 h-4 mr-2" />
                Import Graph
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs">Danger Zone</DropdownMenuLabel>
              <DropdownMenuItem onClick={onReset} className="text-destructive">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset to Default
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Keyboard Shortcuts */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="h-9 px-2"
              >
                <Keyboard className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Keyboard Shortcuts</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </motion.div>

      {/* Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center"
            style={{ zIndex: 50 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              className="bg-card rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={animations.spring.bouncy}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4 text-foreground">Keyboard Shortcuts</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Search</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs text-foreground">⌘K</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Undo</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs text-foreground">⌘Z</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Redo</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs text-foreground">⌘⇧Z</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zoom In</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs text-foreground">⌘=</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zoom Out</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs text-foreground">⌘-</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fit View</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs text-foreground">⌘0</kbd>
                </div>
              </div>
              <Button
                onClick={() => setShowShortcuts(false)}
                className="w-full mt-6"
              >
                Got it
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}
