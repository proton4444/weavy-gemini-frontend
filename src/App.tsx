import React, { useState, useCallback, useRef } from 'react';
import { Node } from 'reactflow';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { RightPanel } from './components/layout/RightPanel';
import { BottomToolbar } from './components/layout/BottomToolbar';
import { FlowCanvas } from './components/FlowCanvas';
import { callGemini, isGeminiConfigured } from './lib/gemini';

function App() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentNodes, setCurrentNodes] = useState<Node[]>([]);

  // Ref to access nodes for workflow execution
  const nodesRef = useRef<Node[]>([]);

  const handleNodesChange = useCallback((nodes: Node[]) => {
    nodesRef.current = nodes;
    setCurrentNodes(nodes);
    // Update selected node if it changed
    setSelectedNode((prevSelected) => {
      if (prevSelected) {
        const updatedNode = nodes.find((n) => n.id === prevSelected.id);
        return updatedNode || null;
      }
      return null;
    });
  }, []);

  const handleNodeDataChange = useCallback(
    (nodeId: string, newData: any) => {
      // Update the node in the current nodes
      const updatedNodes = currentNodes.map((node) =>
        node.id === nodeId ? { ...node, data: newData } : node
      );
      setCurrentNodes(updatedNodes);
      nodesRef.current = updatedNodes;

      // Update selected node
      const updatedSelected = updatedNodes.find((n) => n.id === nodeId);
      if (updatedSelected) {
        setSelectedNode(updatedSelected);
      }
    },
    [currentNodes]
  );

  const handleRunWorkflow = async () => {
    // Check if Gemini is configured
    if (!isGeminiConfigured()) {
      alert(
        'Gemini API key not configured!\n\n' +
          'Please create a .env file in the project root with:\n' +
          'VITE_GEMINI_API_KEY=your-api-key-here\n\n' +
          'Get your API key from: https://ai.google.dev/'
      );
      return;
    }

    setIsRunning(true);
    console.log('Running workflow...');

    try {
      // Find the required nodes
      const textNode = nodesRef.current.find((n) => n.type === 'text');
      const geminiNode = nodesRef.current.find((n) => n.type === 'gemini');
      const outputNode = nodesRef.current.find((n) => n.type === 'output');

      if (!textNode || !geminiNode || !outputNode) {
        console.error('Missing required nodes');
        alert('Error: Missing required nodes (Text, Gemini, or Output)');
        return;
      }

      const prompt = textNode.data.prompt || '';

      if (!prompt.trim()) {
        alert('Please enter a prompt in the Text node');
        return;
      }

      console.log('Prompt:', prompt);

      // Update Gemini node to show "Running..." status
      let updatedNodes = nodesRef.current.map((node) => {
        if (node.id === geminiNode.id) {
          return { ...node, data: { ...node.data, status: 'Running...', result: 'Processing...' } };
        }
        if (node.id === outputNode.id) {
          return { ...node, data: { ...node.data, status: 'Waiting...', result: 'Waiting for Gemini...' } };
        }
        return node;
      });

      setCurrentNodes(updatedNodes);
      nodesRef.current = updatedNodes;

      // Call Gemini API
      const result = await callGemini(prompt);
      console.log('Gemini response:', result);

      // Update nodes with results
      updatedNodes = nodesRef.current.map((node) => {
        if (node.id === geminiNode.id) {
          return { ...node, data: { ...node.data, result, status: 'Ready' } };
        }
        if (node.id === outputNode.id) {
          return { ...node, data: { ...node.data, result, status: 'Ready' } };
        }
        return node;
      });

      setCurrentNodes(updatedNodes);
      nodesRef.current = updatedNodes;

      console.log('Workflow complete');
    } catch (error: any) {
      console.error('Workflow error:', error);

      // Update nodes with error message
      const errorMessage = error.message || 'Unknown error occurred';
      const updatedNodes = nodesRef.current.map((node) => {
        if (node.type === 'gemini') {
          return {
            ...node,
            data: {
              ...node.data,
              result: `Error: ${errorMessage}`,
              status: 'Error'
            }
          };
        }
        if (node.type === 'output') {
          return {
            ...node,
            data: {
              ...node.data,
              result: `Error: ${errorMessage}`,
              status: 'Error'
            }
          };
        }
        return node;
      });

      setCurrentNodes(updatedNodes);
      nodesRef.current = updatedNodes;

      alert(`Error running workflow:\n${errorMessage}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#050608] text-slate-100">
      {/* Top Bar */}
      <TopBar />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Central canvas area */}
        <div className="flex-1 relative">
          <FlowCanvas onNodeClick={setSelectedNode} onNodesChange={handleNodesChange} />
          <BottomToolbar onRunWorkflow={handleRunWorkflow} isRunning={isRunning} />
        </div>

        {/* Right Panel */}
        <RightPanel selectedNode={selectedNode} onNodeDataChange={handleNodeDataChange} />
      </div>
    </div>
  );
}

export default App;
