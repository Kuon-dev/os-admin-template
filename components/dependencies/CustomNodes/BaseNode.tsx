'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData, NodeStatus } from '@/types/dependency-graph';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const statusColors: Record<NodeStatus, string> = {
  'planning': 'bg-blue-100 text-blue-700 border-blue-200',
  'in-progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'completed': 'bg-green-100 text-green-700 border-green-200',
  'blocked': 'bg-red-100 text-red-700 border-red-200',
  'on-hold': 'bg-gray-100 text-gray-700 border-gray-200',
};

const statusBorderColors: Record<NodeStatus, string> = {
  'planning': 'border-blue-400',
  'in-progress': 'border-yellow-400',
  'completed': 'border-green-400',
  'blocked': 'border-red-400',
  'on-hold': 'border-gray-400',
};

interface BaseNodeProps extends NodeProps<NodeData> {
  icon: React.ReactNode;
  iconBgColor: string;
}

export const BaseNode = memo(({ data, selected, icon, iconBgColor }: BaseNodeProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md border-2 min-w-[200px] transition-all',
        statusBorderColors[data.status],
        selected && 'ring-2 ring-blue-500 shadow-lg'
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500"
      />

      <div className="p-3 space-y-2">
        {/* Header */}
        <div className="flex items-start gap-2">
          <div className={cn('rounded-md p-1.5 flex-shrink-0', iconBgColor)}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-gray-900 leading-tight line-clamp-2">
              {data.label}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <Badge
          variant="outline"
          className={cn('text-xs font-medium', statusColors[data.status])}
        >
          {data.status.replace('-', ' ')}
        </Badge>

        {/* Owner */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-semibold">
            {data.ownerAvatar || data.owner.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-xs text-gray-600 truncate">{data.owner}</span>
        </div>

        {/* Progress Bar */}
        {data.progress !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{data.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  data.status === 'completed' ? 'bg-green-500' :
                  data.status === 'blocked' ? 'bg-red-500' :
                  'bg-blue-500'
                )}
                style={{ width: `${data.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-500"
      />
    </div>
  );
});

BaseNode.displayName = 'BaseNode';
