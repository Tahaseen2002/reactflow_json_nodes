
import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, EdgeChange } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
 
const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];
 
export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
 
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
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
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

