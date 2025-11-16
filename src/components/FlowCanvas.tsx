import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { TextNode } from './nodes/TextNode';
import { GeminiNode } from './nodes/GeminiNode';
import { OutputNode } from './nodes/OutputNode';

interface FlowCanvasProps {
  onNodeClick: (node: Node | null) => void;
  onNodesChange?: (nodes: Node[]) => void;
}

// Initial nodes with custom types
const initialNodes: Node[] = [
  {
    id: 'text-1',
    type: 'text',
    position: { x: 100, y: 200 },
    data: {
      label: 'Prompt',
      prompt: 'Write a short poem about AI',
      status: 'Ready',
    },
  },
  {
    id: 'gemini-1',
    type: 'gemini',
    position: { x: 450, y: 200 },
    data: {
      label: 'Gemini 2.5',
      result: '',
      status: 'Ready',
    },
  },
  {
    id: 'output-1',
    type: 'output',
    position: { x: 800, y: 200 },
    data: {
      label: 'Output',
      result: '',
      status: 'Ready',
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'text-1',
    target: 'gemini-1',
    type: 'smoothstep',
    style: { stroke: '#3C3C3C', strokeWidth: 1.5 },
  },
  {
    id: 'e2-3',
    source: 'gemini-1',
    target: 'output-1',
    type: 'smoothstep',
    style: { stroke: '#3C3C3C', strokeWidth: 1.5 },
  },
];

// Load saved workflow from localStorage
function loadWorkflow(): { nodes: Node[]; edges: Edge[] } | null {
  try {
    const saved = localStorage.getItem('weavy-workflow');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading workflow:', error);
  }
  return null;
}

// Save workflow to localStorage
function saveWorkflow(nodes: Node[], edges: Edge[]) {
  try {
    localStorage.setItem('weavy-workflow', JSON.stringify({ nodes, edges }));
  } catch (error) {
    console.error('Error saving workflow:', error);
  }
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({ onNodeClick, onNodesChange }) => {
  // Try to load saved workflow, otherwise use initial nodes/edges
  const savedWorkflow = loadWorkflow();
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(
    savedWorkflow?.nodes || initialNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    savedWorkflow?.edges || initialEdges
  );

  // Define custom node types
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      text: TextNode,
      gemini: GeminiNode,
      output: OutputNode,
    }),
    []
  );

  // Save workflow to localStorage whenever nodes or edges change
  React.useEffect(() => {
    saveWorkflow(nodes, edges);
  }, [nodes, edges]);

  // Update nodes when they change
  React.useEffect(() => {
    if (onNodesChange) {
      onNodesChange(nodes);
    }
  }, [nodes, onNodesChange]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeClick(node);
    },
    [onNodeClick]
  );

  const handlePaneClick = useCallback(() => {
    onNodeClick(null);
  }, [onNodeClick]);

  // Add onChange handler to text nodes
  const nodesWithHandlers = useMemo(() => {
    return nodes.map((node) => {
      if (node.type === 'text') {
        return {
          ...node,
          data: {
            ...node.data,
            onChange: (newPrompt: string) => {
              setNodes((nds) =>
                nds.map((n) =>
                  n.id === node.id
                    ? { ...n, data: { ...n.data, prompt: newPrompt } }
                    : n
                )
              );
            },
          },
        };
      }
      return node;
    });
  }, [nodes, setNodes]);

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={nodesWithHandlers}
        edges={edges}
        onNodesChange={onNodesChangeInternal}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        className="bg-[#050608]"
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#3C3C3C', strokeWidth: 1.5 },
        }}
        fitView
      >
        <Background color="#1a1a1a" variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls className="bg-black/60 border border-white/10 rounded-lg" />
      </ReactFlow>
    </div>
  );
};

// Export for use in App
export { initialNodes, initialEdges };
export type { FlowCanvasProps };
