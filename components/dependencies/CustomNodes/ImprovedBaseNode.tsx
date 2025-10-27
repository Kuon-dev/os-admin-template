'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { NodeData, NodeStatus } from '@/types/dependency-graph';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { statusColors, animations, spacing, shadows } from '@/lib/dependencies/designTokens';
import { MoreVertical, AlertCircle } from 'lucide-react';

interface ImprovedBaseNodeProps extends NodeProps<NodeData> {
  icon: React.ReactNode;
  iconBgColor: string;
  hasWarning?: boolean;
}

export const ImprovedBaseNode = memo(({
  data,
  selected,
  icon,
  iconBgColor,
  hasWarning = false,
}: ImprovedBaseNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const colors = statusColors[data.status];

  // Spring animation values
  const scale = useMotionValue(1);
  const y = useMotionValue(0);

  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={animations.spring.bouncy}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Connection Handles - Always Visible, Prominent on Hover */}
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: isHovered || selected ? 1 : 0.3 }}
          transition={{ duration: animations.duration.fast }}
        >
          {/* Top Handle - Target (incoming from parents above) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Handle
                type="target"
                position={Position.Top}
                className="w-4 h-4 !bg-secondary !border-2 !border-background shadow-lg transition-all hover:scale-125 hover:shadow-xl cursor-crosshair"
                style={{ top: -8 }}
              />
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Connect incoming edge from parent
            </TooltipContent>
          </Tooltip>

          {/* Bottom Handle - Source (outgoing to children below) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Handle
                type="source"
                position={Position.Bottom}
                className="w-4 h-4 !bg-primary !border-2 !border-background shadow-lg transition-all hover:scale-125 hover:shadow-xl cursor-crosshair"
                style={{ bottom: -8 }}
              />
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Drag to connect to child
            </TooltipContent>
          </Tooltip>
        </motion.div>

        {/* Warning Badge - Floating */}
        {hasWarning && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                className="absolute -top-2 -right-2 z-10"
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{
                  scale: animations.spring.bouncy,
                  rotate: {
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }
                }}
              >
                <div className="bg-destructive rounded-full p-1 shadow-lg">
                  <AlertCircle className="w-3 h-3 text-destructive-foreground" />
                </div>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Circular dependency detected</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Main Card */}
        <motion.div
          className={cn(
            'bg-card rounded-xl border-2 min-w-[220px] overflow-hidden',
            'transition-shadow duration-300',
            selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
          )}
          style={{
            borderColor: colors.border,
            boxShadow: isHovered ? shadows.lg : shadows.md,
          }}
        >
          {/* Status Color Bar */}
          <div
            className="h-1 w-full"
            style={{ background: colors.accent }}
          />

          {/* Card Content */}
          <div className="p-4 space-y-3">
            {/* Header Row */}
            <div className="flex items-start gap-3">
              {/* Icon */}
              <motion.div
                className={cn('rounded-lg p-2 flex-shrink-0', iconBgColor)}
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.3 }}
              >
                {icon}
              </motion.div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    type="text"
                    defaultValue={data.label}
                    className="w-full text-sm font-semibold text-foreground bg-transparent border-b border-input focus:border-primary focus:outline-none"
                    onBlur={() => setIsEditing(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsEditing(false);
                      if (e.key === 'Escape') setIsEditing(false);
                    }}
                    autoFocus
                  />
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3
                        className="text-sm font-semibold text-foreground leading-tight line-clamp-2 cursor-text hover:text-primary transition-colors"
                        onDoubleClick={() => setIsEditing(true)}
                      >
                        {data.label}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">Double-click to edit</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Menu Button - Shows on Hover */}
              <motion.button
                className="flex-shrink-0 p-1 rounded-md hover:bg-muted transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isHovered || selected ? 1 : 0,
                  scale: isHovered || selected ? 1 : 0.8,
                }}
                transition={animations.spring.snappy}
              >
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Status Badge */}
            <motion.div
              layout
              transition={animations.spring.medium}
            >
              <Badge
                variant="outline"
                className="text-xs font-medium"
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  color: colors.text,
                }}
              >
                {data.status.replace('-', ' ')}
              </Badge>
            </motion.div>

            {/* Owner */}
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ x: 2 }}
              transition={animations.spring.soft}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-primary-foreground text-xs font-semibold shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.border})`,
                }}
              >
                {data.ownerAvatar || data.owner.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-xs text-muted-foreground truncate">{data.owner}</span>
            </motion.div>

            {/* Progress Bar */}
            {data.progress !== undefined && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <motion.span
                    key={data.progress}
                    initial={{ scale: 1.2, color: colors.accent }}
                    animate={{ scale: 1 }}
                    transition={animations.spring.bouncy}
                    className="text-muted-foreground"
                  >
                    {data.progress}%
                  </motion.span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full transition-colors"
                    initial={{ width: 0 }}
                    animate={{ width: `${data.progress}%` }}
                    transition={animations.spring.medium}
                    style={{
                      backgroundColor: data.status === 'completed'
                        ? statusColors.completed.accent
                        : data.status === 'blocked'
                        ? statusColors.blocked.accent
                        : colors.accent,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Dates - Show on Hover or if Set */}
            {(isHovered || data.endDate) && data.endDate && (
              <motion.div
                className="text-xs text-muted-foreground flex items-center gap-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={animations.spring.soft}
              >
                <span>📅</span>
                <span>Due: {new Date(data.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
});

ImprovedBaseNode.displayName = 'ImprovedBaseNode';
