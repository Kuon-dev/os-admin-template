'use client';

import { memo } from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { EdgeData, DependencyType } from '@/types/dependency-graph';

const edgeStyles: Record<DependencyType, { strokeDasharray: string; color: string }> = {
  'blocks': { strokeDasharray: '0', color: '#ef4444' }, // solid red
  'requires': { strokeDasharray: '0', color: '#3b82f6' }, // solid blue
  'relates-to': { strokeDasharray: '5,5', color: '#6b7280' }, // dashed gray
};

export const DependencyEdge = memo(({
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

  const style = edgeStyles[data?.dependencyType || 'requires'];
  const strokeWidth = selected ? 3 : 2;
  const opacity = data?.strength === 'weak' ? 0.5 : data?.strength === 'medium' ? 0.7 : 1;

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={strokeWidth}
        stroke={style.color}
        strokeDasharray={style.strokeDasharray}
        fill="none"
        opacity={opacity}
        markerEnd={markerEnd}
      />
      {selected && (
        <text>
          <textPath
            href={`#${id}`}
            style={{ fontSize: 10, fill: style.color }}
            startOffset="50%"
            textAnchor="middle"
          >
            {data?.dependencyType}
          </textPath>
        </text>
      )}
    </>
  );
});

DependencyEdge.displayName = 'DependencyEdge';
