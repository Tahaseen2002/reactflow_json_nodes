
import { useEffect, useState, useCallback, useRef } from 'react';
import { applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, EdgeChange, ReactFlowInstance, Connection } from '@xyflow/react';
import { Header } from './components/Header';
import { JsonInput } from './components/JsonInput';
import { FlowCanvas } from './components/FlowCanvas';
import { getThemeColors } from './utils/theme';
import { buildFlowFromJsonText } from './utils/jsonToFlow';
import { SearchBar } from './components/searchBar';



const initialNodes = [
  { id: 'n1', position: { x: 20, y: 20 }, data: { label: 'eg:Node 1', kind: 'primitive' as NodeKind, path: 'n1' } },
  { id: 'n2', position: { x: -50, y: 150 }, data: { label: 'eg:Node 2', kind: 'primitive' as NodeKind, path: 'n2' } },
  { id: 'n3', position: { x: 150, y: 130 }, data: { label: 'eg:Node 3', kind: 'primitive' as NodeKind, path: 'n3' } },
];
const initialEdges = [
  { id: 'n1-n2', source: 'n1', target: 'n2' },
  { id: 'n1-n3', source: 'n1', target: 'n3' },
];


const defaultJson = `{
  "user": {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "country": "USA"
    }
  },
  "items": [
    {
      "id": 1,
      "name": "Item 1",
      "price": 29.99
    },
    {
      "id": 2,
      "name": "Item 2",
      "price": 49.99
    }
  ],
  "active": true
}`;



// Default node styles for theme by type
type NodeKind = 'object' | 'array' | 'primitive';


export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [jsonText, setJsonText] = useState<string>(defaultJson);
  const [jsonError, setJsonError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<string>('');
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>('');
  const reactFlowInstanceRef = useRef<any>(null)

  useEffect(() => {
    const isDark = theme === 'dark';
    const background = isDark ? '#0f172a' : '#f8fafc';
    const foreground = isDark ? '#e2e8f0' : '#0f172a';
    document.body.style.backgroundColor = background;
    document.body.style.color = foreground;
  }, [theme]);

  const themeColors = getThemeColors(theme);
  const isDark = themeColors.isDark;
  const colors = themeColors;


  //  const onNodesChange = useCallback(
  //     (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
  //     []
  //   );
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds) as typeof nds),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const generateGraphFromJson = useCallback(() => {
    try {
      const { nodes: builtNodes, edges: builtEdges } = buildFlowFromJsonText(jsonText);
      setJsonError('');
      setNodes(builtNodes as any);
      setEdges(builtEdges as any);
      setSearchQuery('');
      setSearchResult('');
      setHighlightedNode(null);
    } catch (err: any) {
      setJsonError(err?.message || 'Invalid JSON');
    }
  }, [jsonText]);

  // const handleSearch = useCallback(() => {
  //   if (!searchQuery.trim()) {
  //     setSearchResult('');
  //     setHighlightedNode(null);
  //     return;
  //   }

  //   let pathToSearch = searchQuery.trim();

  //   if (pathToSearch.startsWith('$.')) {
  //     pathToSearch = 'root.' + pathToSearch.substring(2);
  //   } else if (pathToSearch === '$') {
  //     pathToSearch = 'root';
  //   } else if (!pathToSearch.startsWith('root')) {
  //     pathToSearch = 'root.' + pathToSearch;
  //   }

  //   const matchedNode = nodes.find(node => {
  //     const nodePath = node.data.path || node.id;
  //     return nodePath === pathToSearch;
  //   });

  //   if (matchedNode) {
  //     setHighlightedNode(matchedNode.id);
  //     setSearchResult('Match found');

  //     if (reactFlowInstanceRef.current) {
  //       reactFlowInstanceRef.current.setCenter(
  //         matchedNode.position.x,
  //         matchedNode.position.y,
  //         { zoom: 1.2, duration: 800 }
  //       );
  //     }
  //   } else {
  //     setHighlightedNode(null);
  //     setSearchResult('No match found');
  //   }
  // }, [searchQuery, nodes]);

  const onReactFlowInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstanceRef.current = instance;
  }, []);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    if (node.data && node.data.path) {
      let nodePath = node.data.path as string;
      let jsonPath = '$';

      if (nodePath === 'root') {
        jsonPath = '$';
      } else if (nodePath.startsWith('root.')) {
        jsonPath = '$.' + nodePath.substring(5);
      }

      navigator.clipboard.writeText(jsonPath).then(() => {
        setCopyStatus(`Copied: ${jsonPath}`);
        // Clear status after 2 seconds
        setTimeout(() => setCopyStatus(''), 2000);
      }).catch(err => {
        console.error('Could not copy text: ', err);
        setCopyStatus('Failed to copy.');
        setTimeout(() => setCopyStatus(''), 2000);
      });
    }
  }, []);
  return (
    <>
      <Header theme={theme} onToggle={() => setTheme(isDark ? 'light' : 'dark')} colors={colors} />

      <div style={{ backgroundColor: colors.background, color: colors.foreground, boxSizing: 'border-box', padding: 16 }}>
        {/* <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          result={searchResult}
          colors={colors}
        /> */}

        
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'stretch' }}>

         
          <div style={{
            flex: '1 1 320px', 
            minWidth: 320,
          }}>
            <JsonInput value={jsonText} error={jsonError} onChange={setJsonText} onVisualize={generateGraphFromJson} colors={colors as any} />
          </div>

         
          <div style={{
            flex: '3 1 0', 
            minWidth: '60%',
          }}>
            <FlowCanvas
              nodes={nodes as any}
              edges={edges as any}
              isDark={isDark}
              colors={colors as any}
              // highlightedNode={highlightedNode}
              onInit={onReactFlowInit}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
            />
          </div>

        </div>


      </div>
      {copyStatus && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#10b981',
          color: 'white',
          padding: '10px 15px',
          borderRadius: 8,
          zIndex: 1000,
          fontSize: 14,
          fontWeight: 600,
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          opacity: 0.95,
        }}>
          {copyStatus}
        </div>
      )}
    </>
  );
}
