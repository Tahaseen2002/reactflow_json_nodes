import type { NodeKind } from '../types';

export type BuiltNode = { id: string; position: { x: number; y: number }; data: { label: string; kind: NodeKind } };
export type BuiltEdge = { id: string; source: string; target: string; type?: string };

type TreeNode = {
  id: string;
  label: string;
  kind: NodeKind;
  children: TreeNode[];
};

export function buildFlowFromJsonText(jsonText: string) {
  let data: unknown;
  try {
    data = JSON.parse(jsonText);
  } catch (err: any) {
    throw new Error(err?.message || 'Invalid JSON');
  }

  // 1) Build a stable tree (objects keep property order, arrays keep index order)
  const buildTree = (value: any, path: string, label: string): TreeNode => {
    const id = path || 'root';
    const kind: NodeKind = value !== null && typeof value === 'object' ? (Array.isArray(value) ? 'array' : 'object') : 'primitive';
    const node: TreeNode = { id, label, kind, children: [] };

    if (value !== null && typeof value === 'object') {
      if (Array.isArray(value)) {
        value.forEach((child, idx) => {
          const childPath = `${id}[${idx}]`;
          const childLabel = (child !== null && typeof child === 'object') ? `[${idx}]` : `[${idx}]: ${String(child)}`;
          node.children.push(buildTree(child, childPath, childLabel));
        });
      } else {
        Object.entries(value).forEach(([k, v]) => {
          const childPath = `${id}.${k}`;
          const childLabel = (v !== null && typeof v === 'object') ? k : `${k}: ${String(v)}`;
          node.children.push(buildTree(v, childPath, childLabel));
        });
      }
    }
    return node;
  };

  const rootLabel = (data !== null && typeof data === 'object') ? 'root' : `root: ${String(data)}`;
  const root = buildTree(data, 'root', rootLabel);

  // 2) Assign positions with a VERTICAL layered layout (top -> bottom)
  const xStep = 200; // horizontal spacing between leaves
  const yStep = 120; // vertical spacing per depth level
  let xCursor = 0;

  const assignPositions = (node: TreeNode, depth: number): { x: number; y: number } => {
    if (node.children.length === 0) {
      const pos = { x: xCursor * xStep, y: depth * yStep };
      xCursor += 1;
      (node as any).position = pos;
      return pos;
    }
    // Position children first, then center parent between first and last child horizontally
    const childPositions = node.children.map((c) => assignPositions(c, depth + 1));
    const firstX = childPositions[0].x;
    const lastX = childPositions[childPositions.length - 1].x;
    const pos = { x: Math.round((firstX + lastX) / 2), y: depth * yStep };
    (node as any).position = pos;
    return pos;
  };

  assignPositions(root, 0);

  // 3) Flatten to nodes/edges
  const builtNodes: BuiltNode[] = [];
  const builtEdges: BuiltEdge[] = [];

  const flatten = (node: TreeNode) => {
    builtNodes.push({ id: node.id, position: (node as any).position, data: { label: node.label, kind: node.kind } });
    node.children.forEach((child) => {
      builtEdges.push({ id: `${node.id}->${child.id}` , source: node.id, target: child.id, type: 'smoothstep' });
      flatten(child);
    });
  };

  flatten(root);

  return { nodes: builtNodes, edges: builtEdges };
}


