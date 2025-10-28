
import { useEffect, useState,  useCallback } from 'react';

import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, EdgeChange } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Sun } from 'lucide-react';
import { Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

const initialNodes = [
  { id: 'n1', position: { x: 20, y: 20 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

// Custom node component for theme-aware styling
const CustomNode = ({ data, isDark }: { data: any; isDark: boolean }) => (
  <div
    style={{
      padding: '10px 15px',
      borderRadius: '8px',
      backgroundColor: isDark ? '#374151' : '#f3f4f6',
      border: `2px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
      color: isDark ? '#f9fafb' : '#111827',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    }}
  >
    {data.label}
  </div>
);

// Default node styles for theme
const getNodeStyle = (isDark: boolean) => ({
  background: isDark ? '#374151' : '#f3f4f6',
  border: `2px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
  color: isDark ? '#f9fafb' : '#111827',
  borderRadius: '8px',
  padding: '10px 15px',
  fontSize: '14px',
  fontWeight: '500',
  boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
});

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');
      const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  useEffect(() => {
    const isDark = theme === 'dark';
    const background = isDark ? '#0f172a' : '#f8fafc';
    const foreground = isDark ? '#e2e8f0' : '#0f172a';
    document.body.style.backgroundColor = background;
    document.body.style.color = foreground;
  }, [theme]);

  const isDark = theme === 'dark';
  const colors = {
    background: isDark ? '#0f172a' : '#f8fafc',
    foreground: isDark ? '#e2e8f0' : '#0f172a',
    card: isDark ? '#111827' : '#ffffff',
    border: isDark ? '#1f2937' : '#e5e7eb',
    buttonBg: isDark ? '#334155' : '#0ea5e9',
    buttonFg: isDark ? '#e2e8f0' : '#ffffff',
    buttonBorder: isDark ? '#475569' : '#0284c7',
    // ReactFlow specific colors
    flowBackground: isDark ? '#0f172a' : '#ffffff',
    flowNodeBg: isDark ? '#374151' : '#f3f4f6',
    flowNodeBorder: isDark ? '#4b5563' : '#d1d5db',
    flowNodeText: isDark ? '#f9fafb' : '#111827',
    flowEdge: isDark ? '#94a3b8' : '#374151',
  };


 
  const onNodesChange = useCallback(
    (changes: NodeChange<{ id: string; position: { x: number; y: number; }; data: { label: string; }; }>[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange<{ id: string; source: string; target: string; }>[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );
  return (
    <>
     <div style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: colors.card, borderBottom: `1px solid ${colors.border}` }}>
       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', color: colors.foreground }}>
         <div style={{ fontWeight: 600 }}>APIWiz</div>
         <button
           aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
           onClick={() => setTheme(isDark ? 'light' : 'dark')}
           style={{
             display: 'inline-flex',
             alignItems: 'center',
             justifyContent: 'center',
             width: 40,
             height: 32,
             borderRadius: 9999,
             border: `1px solid ${colors.buttonBorder}`,
             backgroundColor: colors.buttonBg,
             color: colors.buttonFg,
             cursor: 'pointer',
           }}
           title={isDark ? 'Light mode' : 'Dark mode'}
         >
           {isDark ? <Sun size={18} /> : <Moon size={18} />}
         </button>
       </div>
     </div>
     <div style={{  backgroundColor: colors.background, color: colors.foreground, boxSizing: 'border-box', padding: 16 }}>
   
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'stretch' }}>
    <div style={{ flex: '1 1 320px', backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16 }}>
       <div style={{ width: '50vw', height: '50vh' }}>
      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          style: getNodeStyle(isDark)
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        style={{
          backgroundColor: colors.flowBackground,
        }}
        defaultEdgeOptions={{
          style: {
            stroke: colors.flowEdge,
            strokeWidth: 3,
          },
          markerEnd: {
            type: 'arrowclosed',
            color: colors.flowEdge,
          }
        }}
      />
    </div>
    </div>
    </div>
    </div>
    <div style={{  backgroundColor: colors.background, color: colors.foreground, boxSizing: 'border-box', padding: 16 }}>
   
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'stretch' }}>
       
        <div style={{ flex: '1 1 320px', backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Card One</h2>
          <p style={{ margin: 0 }}>Place your first section content here.</p>
           
        </div>
        <div style={{ flex: '1 1 320px', backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Card Two</h2>
          <p style={{ margin: 0 }}>Place your second section content here.</p>
        </div>
      </div>

      
    </div>
    </>
  );
}


// import { useCallback } from 'react'
// import ReactFlow, { addEdge, Background, Controls, MiniMap, useEdgesState, useNodesState, Connection, Edge } from 'reactflow'
// import 'reactflow/dist/style.css'

// const initialNodes = [
//   { id: '1', position: { x: 200, y: 100 }, data: { label: 'Node 1' } },
//   { id: '2', position: { x: 500, y: 200 }, data: { label: 'Node 2' } },
// ]

// const initialEdges: Edge[] = []

// export default function App() {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

//   const onConnect = useCallback((connection: Connection) => {
//     setEdges((eds) => addEdge(connection, eds))
//   }, [setEdges])

//   return (
//     <div >
//       <div className="h-[calc(100vh-4rem)]">
//        <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           fitView
//         >
//           <MiniMap />
//           <Controls />
//           <Background gap={16} size={1} />
//         </ReactFlow>
//         </div>
//       <div className="h-16 flex items-center justify-center border-b bg-white/80 backdrop-blur">
//         <h1 className="text-xl font-semibold">APIWiz - React Flow + Tailwind</h1>
        
//       </div>
//       <div className="h-[calc(100vh-4rem)]">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           fitView
//         >
//           <MiniMap />
//           <Controls />
//           <Background gap={16} size={1} />
//         </ReactFlow>
//       </div>
//     </div>
//   )
// }


