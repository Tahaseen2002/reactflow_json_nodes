import { Background, Connection, Controls, EdgeChange, NodeChange, ReactFlow, } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { NodeKind } from '../types';
import { Position } from '@xyflow/react';
import { useCallback, useRef, useState } from 'react';
import { SearchBar } from './searchBar';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';
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
      // transform: 'scale(1.1)',
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

export function FlowCanvas({ nodes, edges, isDark, colors, onInit, onNodesChange, onEdgesChange, onConnect, onNodeClick }: {
  nodes: Array<{ id: string; position: { x: number; y: number }; data: { label: string; kind: NodeKind; path?: string; value?: any } }>;
  edges: Array<{ id: string; source: string; target: string }>;
  isDark: boolean;
  colors: {
    flowBackground: string;
    flowEdge: string;
    card: string;
    border: string;
    background: string;
    foreground: string;
    buttonBg: string;
    buttonFg: string;
    buttonBorder: string;
  };
  // colors: { flowBackground: string; flowEdge: string; card: string; border: string };
  // highlightedNode: string | null;
  onInit: (instance: any) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick: (event: React.MouseEvent, node: any) => void;
}) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<string>('');
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const reactFlowInstanceRef = useRef<any>(null)

  const onReactFlowInit = useCallback((instance: any) => {
    reactFlowInstanceRef.current = instance; // Set local ref for camera movement
    onInit(instance); // Call App.tsx's onInit for external purposes
  }, [onInit]);
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setSearchResult('');
      setHighlightedNode(null);
      return;
    }

    let pathToSearch = searchQuery.trim();

    if (pathToSearch.startsWith('$.')) {
      pathToSearch = 'root.' + pathToSearch.substring(2);
    } else if (pathToSearch === '$') {
      pathToSearch = 'root';
    } else if (!pathToSearch.startsWith('root')) {
      pathToSearch = 'root.' + pathToSearch;
    }

    const matchedNode = nodes.find(node => {
      const nodePath = node.data.path || node.id;
      return nodePath === pathToSearch;
    });

    if (matchedNode) {
      setHighlightedNode(matchedNode.id);
      setSearchResult('Match found');

      if (reactFlowInstanceRef.current) {
        reactFlowInstanceRef.current.setCenter(
          matchedNode.position.x,
          matchedNode.position.y,
          { zoom: 1.2, duration: 800 }
        );
      }
    } else {
      setHighlightedNode(null);
      setSearchResult('No match found');
    }
  }, [searchQuery, nodes]);

  const handleReset = useCallback(() => {
    // 1. Clear the search input
    setSearchQuery('');
    // 2. Clear the result message
    setSearchResult('');
    // 3. Remove the node highlight
    setHighlightedNode(null);

    // 4. Reset the flow view to fit all nodes (optional but good practice)
    if (reactFlowInstanceRef.current) {
      reactFlowInstanceRef.current.fitView({ padding: 0.2, duration: 300 });
    }
  }, []);

  const handleDownload = useCallback(() => {
    const element = document.querySelector('.react-flow') as HTMLElement;
    if (element) {
      toPng(element, {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight,
      })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'json-tree.png';
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('Failed to download image:', err);
        });
    }
  }, [isDark]);


  return (
    <div style={{
      backgroundColor: colors.card,
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      padding: 16,
      display: 'flex',
      flexDirection: 'column'
    }}>



      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
        onReset={handleReset}
        result={searchResult}
        colors={colors}
      />

      {/* Separator Line */}
      <div style={{ borderTop: `1px solid ${colors.border}`, margin: '16px 0' }}></div>

      {/* ReactFlow Canvas Container */}
      <div style={{ width: '100%', height: 'clamp(280px, 65vh, 85vh)' }}>




        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            style: getNodeStyle(isDark, node.data.kind, node.id === highlightedNode),
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
            draggable: false,
          }))}
          edges={edges}
          onInit={onReactFlowInit}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          // fitView
          // fitViewOptions={{ padding: 0.2 }}
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
              color: isDark ? '#1f2937' : colors.foreground,
            }}
          />
          <Background
            color={isDark ? '#1f2937' : colors.foreground}
            gap={16}
            size={1}
          />
          <button
            onClick={handleDownload}
            title="Download Flowchart as PNG"
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 4, // Ensure it's above the flow controls if they appear below it
              padding: '8px 12px',
              backgroundColor: colors.buttonBg,
              color: colors.buttonFg,
              border: `1px solid ${colors.buttonBorder}`,
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Download size={18} />
          </button>
        </ReactFlow>
      </div>
    </div>
  );
}


