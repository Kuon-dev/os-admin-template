'use client';

import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { ImprovedBaseNode } from './ImprovedBaseNode';
import { NodeData } from '@/types/dependency-graph';
import {
  FolderKanban,
  Layers,
  Zap,
  CheckSquare,
  Flag,
} from 'lucide-react';

export const ProjectNode = memo((props: NodeProps<NodeData>) => (
  <ImprovedBaseNode
    {...props}
    icon={<FolderKanban className="w-4 h-4 text-purple-600" />}
    iconBgColor="bg-purple-100"
  />
));
ProjectNode.displayName = 'ProjectNode';

export const EpicNode = memo((props: NodeProps<NodeData>) => (
  <ImprovedBaseNode
    {...props}
    icon={<Layers className="w-4 h-4 text-indigo-600" />}
    iconBgColor="bg-indigo-100"
  />
));
EpicNode.displayName = 'EpicNode';

export const FeatureNode = memo((props: NodeProps<NodeData>) => (
  <ImprovedBaseNode
    {...props}
    icon={<Zap className="w-4 h-4 text-blue-600" />}
    iconBgColor="bg-blue-100"
  />
));
FeatureNode.displayName = 'FeatureNode';

export const TaskNode = memo((props: NodeProps<NodeData>) => (
  <ImprovedBaseNode
    {...props}
    icon={<CheckSquare className="w-4 h-4 text-green-600" />}
    iconBgColor="bg-green-100"
  />
));
TaskNode.displayName = 'TaskNode';

export const MilestoneNode = memo((props: NodeProps<NodeData>) => (
  <ImprovedBaseNode
    {...props}
    icon={<Flag className="w-4 h-4 text-orange-600" />}
    iconBgColor="bg-orange-100"
  />
));
MilestoneNode.displayName = 'MilestoneNode';
