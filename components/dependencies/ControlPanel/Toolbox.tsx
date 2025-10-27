'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { NodeType } from '@/types/dependency-graph';
import {
  FolderKanban,
  Layers,
  Zap,
  CheckSquare,
  Flag,
  Plus,
} from 'lucide-react';

interface ToolboxProps {
  onAddNode: (type: NodeType) => void;
}

const nodeTypes = [
  { type: 'project' as NodeType, label: 'Project', icon: FolderKanban, color: 'text-purple-600' },
  { type: 'epic' as NodeType, label: 'Epic', icon: Layers, color: 'text-indigo-600' },
  { type: 'feature' as NodeType, label: 'Feature', icon: Zap, color: 'text-blue-600' },
  { type: 'task' as NodeType, label: 'Task', icon: CheckSquare, color: 'text-green-600' },
  { type: 'milestone' as NodeType, label: 'Milestone', icon: Flag, color: 'text-orange-600' },
];

export function Toolbox({ onAddNode }: ToolboxProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-sm mb-1">Add Nodes</h3>
          <p className="text-xs text-muted-foreground">
            Click to add a new node to the graph
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          {nodeTypes.map(({ type, label, icon: Icon, color }) => (
            <Button
              key={type}
              variant="outline"
              className="w-full justify-start"
              onClick={() => onAddNode(type)}
            >
              <Icon className={`w-4 h-4 mr-2 ${color}`} />
              <span className="text-sm">{label}</span>
              <Plus className="w-3 h-3 ml-auto text-muted-foreground" />
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
