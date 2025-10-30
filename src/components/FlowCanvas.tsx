import { Background, Connection, Controls, EdgeChange, NodeChange, ReactFlow, ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { NodeKind } from '../types';
import { Position } from '@xyflow/react';
const getNodeStyle = (isDark: boolean, kind: NodeKind, isHighlighted: boolean) => {
  const palette = {
    object: { lightBg: '#eef2ff', darkBg: '#312e81', lightBorder: '#6366f1', darkBorder: '#818cf8', lightText: '#1e293b', darkText: '#e0e7ff' },
    array: { lightBg: '#ecfdf5', darkBg: '#064e3b', lightBorder: '#10b981', darkBorder: '#34d399', lightText: '#064e3b', darkText: '#d1fae5' },
    primitive: { lightBg: '#fff7ed', darkBg: '#7c2d12', lightBorder: '#f59e0b', darkBorder: '#fbbf24', lightText: '#7c2d12', darkText: '#fffbeb' },
  } as const;
  const c = palette[kind];
  if (isHighlighted) {
    return {
      background: isDark ? '#7c3aed' : '#a78bfa',
      border: `3px solid ${isDark ? '#c4b5fd' : '#7c3aed'}`,
      color: '#ffffff',
      borderRadius: '8px',
      padding: '10px 12px',
      fontSize: '13px',
      fontWeight: '600',
      whiteSpace: 'nowrap',
      boxShadow: '0 0 20px rgba(124, 58, 237, 0.6)',
      transform: 'scale(1.1)',
      transition: 'all 0.3s ease',
    } as React.CSSProperties;
  }
  return {
    backgroundColor: isDark ? c.darkBorder : c.lightBorder,
    border: `2px solid ${isDark ? c.darkBorder : c.lightBorder}`,
    color: isDark ? c.darkText : c.lightText,
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '13px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  } as React.CSSProperties;
};

export function FlowCanvas({ nodes, edges, isDark, colors, highlightedNode, onInit, onNodesChange, onEdgesChange, onConnect  }: {
  nodes: Array<{ id: string; position: { x: number; y: number }; data: { label: string; kind: NodeKind; path?: string; value?: any } }>;
  edges: Array<{ id: string; source: string; target: string }>;
  isDark: boolean;
  colors: { flowBackground: string; flowEdge: string; card: string; border: string };
   highlightedNode: string | null;
  onInit: (instance: any) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
}) {
  return (
    <div style={{ flex: '1 1 320px', backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16, width: '100%' }}>
      <div style={{ width: '100%', height: 'clamp(280px, 65vh, 85vh)' }}>
        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            style: getNodeStyle(isDark, node.data.kind, node.id === highlightedNode),
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
          }))}
          edges={edges}
           onInit={onInit}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          style={{ backgroundColor: colors.flowBackground }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { stroke: colors.flowEdge, strokeWidth: 3 },
            markerEnd: { type: 'arrowclosed', color: colors.flowEdge },
          }}
        >
           <Controls 
            style={{ 
              backgroundColor: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
            }}
          />
          <Background 
            color={isDark ? '#1e293b' : '#e2e8f0'} 
            gap={16} 
            size={1}
          />
        </ReactFlow>
      </div>
    </div>
  );
}


