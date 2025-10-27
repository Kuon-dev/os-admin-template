'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Undo2,
  Redo2,
  Download,
  Upload,
  LayoutGrid,
  RefreshCw,
} from 'lucide-react';
import { LayoutAlgorithm } from '@/types/dependency-graph';

interface GraphControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  onLayout: (algorithm: LayoutAlgorithm) => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function GraphControls({
  onUndo,
  onRedo,
  onLayout,
  onExport,
  onImport,
  onReset,
  canUndo,
  canRedo,
}: GraphControlsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Undo/Redo */}
      <div className="flex items-center gap-1 border rounded-md p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-8 px-2"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-8 px-2"
        >
          <Redo2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Layout */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <LayoutGrid className="w-4 h-4 mr-2" />
            Layout
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onLayout('hierarchical')}>
            Hierarchical
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onLayout('force-directed')}>
            Force Directed
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Export/Import/Reset */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Download className="w-4 h-4 mr-2" />
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Graph
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onImport}>
            <Upload className="w-4 h-4 mr-2" />
            Import Graph
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onReset} className="text-red-600">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Default
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
