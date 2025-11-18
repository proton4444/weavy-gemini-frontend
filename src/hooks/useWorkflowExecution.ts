import { useState, useCallback } from 'react';
import { Node } from 'reactflow';
import { callGemini, isGeminiConfigured } from '../lib/gemini';

interface UseWorkflowExecutionResult {
  isRunning: boolean;
  executeWorkflow: (nodes: Node[]) => Promise<Node[]>;
}

/**
 * Custom hook for executing AI workflows
 * Handles the entire workflow execution lifecycle including:
 * - Validation
 * - Status updates
 * - API calls
 * - Error handling
 */
export function useWorkflowExecution(): UseWorkflowExecutionResult {
  const [isRunning, setIsRunning] = useState(false);

  const executeWorkflow = useCallback(async (nodes: Node[]): Promise<Node[]> => {
    // Validate API configuration
    if (!isGeminiConfigured()) {
      alert(
        'Gemini API key not configured!\n\n' +
          'Please create a .env file in the project root with:\n' +
          'VITE_GEMINI_API_KEY=your-api-key-here\n\n' +
          'Get your API key from: https://ai.google.dev/'
      );
      throw new Error('Gemini API not configured');
    }

    setIsRunning(true);

    try {
      // Find required nodes
      const textNode = nodes.find((n) => n.type === 'text');
      const geminiNode = nodes.find((n) => n.type === 'gemini');
      const outputNode = nodes.find((n) => n.type === 'output');

      if (!textNode || !geminiNode || !outputNode) {
        alert('Error: Missing required nodes (Text, Gemini, or Output)');
        throw new Error('Missing required nodes');
      }

      // Validate prompt
      const prompt = textNode.data.prompt || '';
      if (!prompt.trim()) {
        alert('Please enter a prompt in the Text node');
        throw new Error('Empty prompt');
      }

      console.log('Executing workflow with prompt:', prompt);

      // Update nodes to show "Running" status
      let updatedNodes = updateNodeStatus(nodes, geminiNode.id, outputNode.id, 'running');

      // Call Gemini API
      const result = await callGemini(prompt);
      console.log('Gemini response received');

      // Update nodes with results
      updatedNodes = updateNodeResults(updatedNodes, geminiNode.id, outputNode.id, result);

      return updatedNodes;
    } catch (error: any) {
      console.error('Workflow execution error:', error);

      const errorMessage = error.message || 'Unknown error occurred';

      // Update nodes with error
      const updatedNodes = updateNodeError(nodes, errorMessage);

      // Only show alert for non-validation errors
      if (!error.message?.includes('configured') && !error.message?.includes('Empty prompt')) {
        alert(`Error running workflow:\n${errorMessage}`);
      }

      return updatedNodes;
    } finally {
      setIsRunning(false);
    }
  }, []);

  return { isRunning, executeWorkflow };
}

/**
 * Update node status to show workflow is running
 */
function updateNodeStatus(
  nodes: Node[],
  geminiNodeId: string,
  outputNodeId: string,
  status: 'running' | 'ready'
): Node[] {
  return nodes.map((node) => {
    if (node.id === geminiNodeId) {
      return {
        ...node,
        data: {
          ...node.data,
          status: status === 'running' ? 'Running...' : 'Ready',
          result: status === 'running' ? 'Processing...' : node.data.result,
        },
      };
    }
    if (node.id === outputNodeId) {
      return {
        ...node,
        data: {
          ...node.data,
          status: status === 'running' ? 'Waiting...' : 'Ready',
          result: status === 'running' ? 'Waiting for Gemini...' : node.data.result,
        },
      };
    }
    return node;
  });
}

/**
 * Update nodes with successful results
 */
function updateNodeResults(
  nodes: Node[],
  geminiNodeId: string,
  outputNodeId: string,
  result: string
): Node[] {
  return nodes.map((node) => {
    if (node.id === geminiNodeId || node.id === outputNodeId) {
      return {
        ...node,
        data: {
          ...node.data,
          result,
          status: 'Ready',
        },
      };
    }
    return node;
  });
}

/**
 * Update nodes with error message
 */
function updateNodeError(nodes: Node[], errorMessage: string): Node[] {
  return nodes.map((node) => {
    if (node.type === 'gemini' || node.type === 'output') {
      return {
        ...node,
        data: {
          ...node.data,
          result: `Error: ${errorMessage}`,
          status: 'Error',
        },
      };
    }
    return node;
  });
}
