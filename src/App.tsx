
import { useEffect, useState,  useCallback } from 'react';
import { applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, EdgeChange } from '@xyflow/react';
import { Header } from './components/Header';
import { JsonInput } from './components/JsonInput';
import { FlowCanvas } from './components/FlowCanvas';
import { getThemeColors } from './utils/theme';
import { buildFlowFromJsonText } from './utils/jsonToFlow';

const initialNodes: Array<{ id: string; position: { x: number; y: number }; data: { label: string; kind?: 'primitive' | 'object' | 'array' } }> = [
  { id: 'n1', position: { x: 20, y: 20 }, data: { label: 'Node 1', kind: 'primitive' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2', kind: 'primitive' } },
];
const initialEdges: Array<{ id: string; source: string; target: string }> = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

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

// Default node styles for theme by type
type NodeKind = 'object' | 'array' | 'primitive';
const getNodeStyle = (isDark: boolean, kind: NodeKind) => {
  const palette = {
    object: {
      lightBg: '#eef2ff', // indigo-50
      darkBg: '#312e81',  // indigo-900
      lightBorder: '#6366f1', // indigo-500
      darkBorder: '#818cf8',
      lightText: '#1e293b',
      darkText: '#e0e7ff',
    },
    array: {
      lightBg: '#ecfdf5', // emerald-50
      darkBg: '#064e3b',  // emerald-900
      lightBorder: '#10b981',
      darkBorder: '#34d399',
      lightText: '#064e3b',
      darkText: '#d1fae5',
    },
    primitive: {
      lightBg: '#fff7ed', // orange-50
      darkBg: '#7c2d12',  // orange-900
      lightBorder: '#f59e0b',
      darkBorder: '#fbbf24',
      lightText: '#7c2d12',
      darkText: '#fffbeb',
    },
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
    boxShadow: isDark ? '0 4px 10px -2px rgba(0,0,0,0.45)' : '0 2px 8px rgba(0,0,0,0.08)',
    whiteSpace: 'nowrap',
  } as React.CSSProperties;
};

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
      const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [jsonText, setJsonText] = useState<string>('');
  const [jsonError, setJsonError] = useState<string>('');

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

  const generateGraphFromJson = useCallback(() => {
    try {
      const { nodes: builtNodes, edges: builtEdges } = buildFlowFromJsonText(jsonText);
      setJsonError('');
      setNodes(builtNodes as any);
      setEdges(builtEdges as any);
    } catch (err: any) {
      setJsonError(err?.message || 'Invalid JSON');
    }
  }, [jsonText]);
  return (
    <>
     <Header theme={theme} onToggle={() => setTheme(isDark ? 'light' : 'dark')} colors={colors} />
     <div style={{  backgroundColor: colors.background, color: colors.foreground, boxSizing: 'border-box', padding: 16 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'stretch' }}>
        <FlowCanvas nodes={nodes as any} edges={edges as any} isDark={isDark} colors={colors as any} />
      </div>
     </div>
    <div style={{  backgroundColor: colors.background, color: colors.foreground, boxSizing: 'border-box', padding: 16 }}>
   
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'stretch' }}>
       
        <JsonInput value={jsonText} error={jsonError} onChange={setJsonText} onVisualize={generateGraphFromJson} colors={colors as any} />
        
      </div>

      
    </div>
    </>
  );
}
