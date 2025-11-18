import React, { useCallback, useMemo, useEffect } from 'react';
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
import { loadWorkflow, saveWorkflow } from '../utils/storage';

interface FlowCanvasProps {
  onNodeClick: (node: Node | null) => void;
  onNodesChange?: (nodes: Node[]) => void;
}

// Initial workflow configuration
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

// Default edge styling
const defaultEdgeOptions = {
  type: 'smoothstep',
  style: { stroke: '#3C3C3C', strokeWidth: 1.5 },
};

/**
 * FlowCanvas Component
 * Main canvas for the node-based workflow editor
 * Handles:
 * - Node rendering and interaction
 * - Edge connections
 * - Workflow persistence
 */
export const FlowCanvas: React.FC<FlowCanvasProps> = ({ onNodeClick, onNodesChange }) => {
  // Load saved workflow or use initial configuration
  const savedWorkflow = useMemo(() => loadWorkflow(), []);
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(
    savedWorkflow?.nodes || initialNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    savedWorkflow?.edges || initialEdges
  );

  // Define custom node types mapping
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      text: TextNode,
      gemini: GeminiNode,
      output: OutputNode,
    }),
    []
  );

  // Auto-save workflow to localStorage when nodes or edges change
  useEffect(() => {
    saveWorkflow({ nodes, edges });
  }, [nodes, edges]);

  // Notify parent component of node changes
  useEffect(() => {
    onNodesChange?.(nodes);
  }, [nodes, onNodesChange]);

  // Handle new edge connections
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle node click events
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeClick(node);
    },
    [onNodeClick]
  );

  // Handle canvas click (deselect node)
  const handlePaneClick = useCallback(() => {
    onNodeClick(null);
  }, [onNodeClick]);

  // Inject onChange handlers into text nodes
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
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
      >
        <Background color="#1a1a1a" variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls className="bg-black/60 border border-white/10 rounded-lg" />
      </ReactFlow>
    </div>
  );
};

// Export initial configuration for testing/reference
export { initialNodes, initialEdges };
export type { FlowCanvasProps };
