import { Node, Edge } from 'reactflow';

// Node data types
export interface BaseNodeData {
  label: string;
  status?: 'Ready' | 'Running...' | 'Waiting...' | 'Error';
}

export interface TextNodeData extends BaseNodeData {
  prompt: string;
  onChange?: (value: string) => void;
}

export interface GeminiNodeData extends BaseNodeData {
  result: string;
}

export interface OutputNodeData extends BaseNodeData {
  result: string;
}

// Node types
export type TextNode = Node<TextNodeData>;
export type GeminiNode = Node<GeminiNodeData>;
export type OutputNode = Node<OutputNodeData>;

// Workflow types
export interface Workflow {
  nodes: Node[];
  edges: Edge[];
}

// App state types
export interface AppState {
  selectedNode: Node | null;
  isRunning: boolean;
  nodes: Node[];
}
