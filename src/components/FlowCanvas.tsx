import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { NodeKind } from '../types';

const getNodeStyle = (isDark: boolean, kind: NodeKind) => {
  const palette = {
    object: { lightBg: '#eef2ff', darkBg: '#312e81', lightBorder: '#6366f1', darkBorder: '#818cf8', lightText: '#1e293b', darkText: '#e0e7ff' },
    array: { lightBg: '#ecfdf5', darkBg: '#064e3b', lightBorder: '#10b981', darkBorder: '#34d399', lightText: '#064e3b', darkText: '#d1fae5' },
    primitive: { lightBg: '#fff7ed', darkBg: '#7c2d12', lightBorder: '#f59e0b', darkBorder: '#fbbf24', lightText: '#7c2d12', darkText: '#fffbeb' },
  } as const;
  const c = palette[kind];
  return {
    background: isDark ? c.darkBg : c.lightBg,
    border: `2px solid ${isDark ? c.darkBorder : c.lightBorder}`,
    color: isDark ? c.darkText : c.lightText,
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '13px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  } as React.CSSProperties;
};

export function FlowCanvas({ nodes, edges, isDark, colors }: {
  nodes: Array<{ id: string; position: { x: number; y: number }; data: { label: string; kind: NodeKind } }>;
  edges: Array<{ id: string; source: string; target: string }>;
  isDark: boolean;
  colors: { flowBackground: string; flowEdge: string; card: string; border: string };
}) {
  return (
    <div style={{ flex: '1 1 320px', backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16, width: '100%' }}>
      <div style={{ width: '100%', height: 'clamp(280px, 65vh, 85vh)' }}>
        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            style: getNodeStyle(isDark, node.data.kind),
            sourcePosition: 'right',
            targetPosition: 'left',
          }))}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          style={{ backgroundColor: colors.flowBackground }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { stroke: colors.flowEdge, strokeWidth: 3 },
            markerEnd: { type: 'arrowclosed', color: colors.flowEdge },
          }}
        />
      </div>
    </div>
  );
}


