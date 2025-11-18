import { useState, useCallback, useRef, useEffect } from 'react';
import { Node } from 'reactflow';

interface UseNodesManagerResult {
  currentNodes: Node[];
  selectedNode: Node | null;
  setSelectedNode: (node: Node | null) => void;
  updateNodes: (nodes: Node[]) => void;
  updateNodeData: (nodeId: string, newData: any) => void;
  getNodes: () => Node[];
}

/**
 * Custom hook for managing node state
 * Provides centralized node state management with:
 * - Current nodes tracking
 * - Selected node management
 * - Node data updates
 * - Ref for accessing latest nodes
 */
export function useNodesManager(): UseNodesManagerResult {
  const [currentNodes, setCurrentNodes] = useState<Node[]>([]);
  const [selectedNode, setSelectedNodeState] = useState<Node | null>(null);
  const nodesRef = useRef<Node[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    nodesRef.current = currentNodes;
  }, [currentNodes]);

  const updateNodes = useCallback((nodes: Node[]) => {
    setCurrentNodes(nodes);
    nodesRef.current = nodes;

    // Update selected node if it changed
    setSelectedNodeState((prevSelected) => {
      if (prevSelected) {
        const updatedNode = nodes.find((n) => n.id === prevSelected.id);
        return updatedNode || null;
      }
      return null;
    });
  }, []);

  const updateNodeData = useCallback(
    (nodeId: string, newData: any) => {
      const updatedNodes = currentNodes.map((node) =>
        node.id === nodeId ? { ...node, data: newData } : node
      );
      setCurrentNodes(updatedNodes);
      nodesRef.current = updatedNodes;

      // Update selected node if it's the one being modified
      const updatedSelected = updatedNodes.find((n) => n.id === nodeId);
      if (updatedSelected && selectedNode?.id === nodeId) {
        setSelectedNodeState(updatedSelected);
      }
    },
    [currentNodes, selectedNode]
  );

  const setSelectedNode = useCallback((node: Node | null) => {
    setSelectedNodeState(node);
  }, []);

  const getNodes = useCallback(() => {
    return nodesRef.current;
  }, []);

  return {
    currentNodes,
    selectedNode,
    setSelectedNode,
    updateNodes,
    updateNodeData,
    getNodes,
  };
}
