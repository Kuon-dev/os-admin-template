'use client';

import { memo } from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { motion } from 'framer-motion';
import { EdgeData, DependencyType } from '@/types/dependency-graph';
import { dependencyColors } from '@/lib/dependencies/designTokens';

const edgeStyles: Record<DependencyType, { strokeDasharray: string; label: string }> = {
  'blocks': { strokeDasharray: '5,5', label: 'Blocks' },
  'requires': { strokeDasharray: '0', label: 'Requires' },
  'relates-to': { strokeDasharray: '10,5', label: 'Relates' },
};

export const ImprovedDependencyEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  selected,
}: EdgeProps<EdgeData>) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const dependencyType = data?.dependencyType || 'requires';
  const colors = dependencyColors[dependencyType];
  const style = edgeStyles[dependencyType];
  const strokeWidth = selected ? 3 : 2;
  const opacity = data?.strength === 'weak' ? 0.4 : data?.strength === 'medium' ? 0.6 : 0.8;

  return (
    <>
      {/* Glow effect on hover/select */}
      {selected && (
        <motion.path
          d={edgePath}
          fill="none"
          strokeWidth={strokeWidth + 6}
          stroke={colors.glow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ filter: `blur(4px)` }}
        />
      )}

      {/* Main edge path */}
      <motion.path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={strokeWidth}
        stroke={`url(#gradient-${dependencyType})`}
        strokeDasharray={style.strokeDasharray}
        fill="none"
        opacity={opacity}
        markerEnd={markerEnd}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity }}
        transition={{
          pathLength: { duration: 0.5, ease: 'easeOut' },
          opacity: { duration: 0.3 },
        }}
      />

      {/* Animated particles flowing along the edge */}
      {selected && dependencyType === 'requires' && (
        <>
          <motion.circle
            r="3"
            fill={colors.stroke}
            initial={{ offsetDistance: '0%', opacity: 0.8 }}
            animate={{ offsetDistance: '100%', opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <animateMotion dur="2s" repeatCount="indefinite">
              <mpath href={`#${id}`} />
            </animateMotion>
          </motion.circle>
          <motion.circle
            r="3"
            fill={colors.stroke}
            initial={{ offsetDistance: '33%', opacity: 0.8 }}
            animate={{ offsetDistance: '133%', opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.66,
            }}
          >
            <animateMotion dur="2s" repeatCount="indefinite" begin="0.66s">
              <mpath href={`#${id}`} />
            </animateMotion>
          </motion.circle>
          <motion.circle
            r="3"
            fill={colors.stroke}
            initial={{ offsetDistance: '66%', opacity: 0.8 }}
            animate={{ offsetDistance: '166%', opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: 1.33,
            }}
          >
            <animateMotion dur="2s" repeatCount="indefinite" begin="1.33s">
              <mpath href={`#${id}`} />
            </animateMotion>
          </motion.circle>
        </>
      )}

      {/* Edge label on hover/select */}
      {selected && (
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <rect
            x={labelX - 30}
            y={labelY - 12}
            width={60}
            height={24}
            rx={12}
            fill="white"
            stroke={colors.stroke}
            strokeWidth={1.5}
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
          />
          <text
            x={labelX}
            y={labelY + 4}
            textAnchor="middle"
            style={{
              fontSize: 11,
              fontWeight: 600,
              fill: colors.stroke,
              pointerEvents: 'none',
            }}
          >
            {style.label}
          </text>
        </motion.g>
      )}

      {/* Define gradients */}
      <defs>
        <linearGradient id={`gradient-${dependencyType}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.gradient[0]} stopOpacity="0.6" />
          <stop offset="100%" stopColor={colors.gradient[1]} stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </>
  );
});

ImprovedDependencyEdge.displayName = 'ImprovedDependencyEdge';
