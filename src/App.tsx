import React, { useCallback } from 'react';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { RightPanel } from './components/layout/RightPanel';
import { BottomToolbar } from './components/layout/BottomToolbar';
import { FlowCanvas } from './components/FlowCanvas';
import { useNodesManager } from './hooks/useNodesManager';
import { useWorkflowExecution } from './hooks/useWorkflowExecution';

/**
 * Main App Component
 * Orchestrates the Weavy-style node editor interface
 *
 * Architecture:
 * - Layout: TopBar, Sidebar, FlowCanvas, RightPanel, BottomToolbar
 * - State Management: Custom hooks for nodes and workflow execution
 * - Persistence: Auto-save via FlowCanvas component
 */
function App() {
  // Node state management
  const {
    currentNodes,
    selectedNode,
    setSelectedNode,
    updateNodes,
    updateNodeData,
    getNodes,
  } = useNodesManager();

  // Workflow execution
  const { isRunning, executeWorkflow } = useWorkflowExecution();

  /**
   * Handle workflow execution
   * Executes the AI workflow and updates node states
   */
  const handleRunWorkflow = useCallback(async () => {
    try {
      const nodes = getNodes();
      const updatedNodes = await executeWorkflow(nodes);
      updateNodes(updatedNodes);
    } catch (error) {
      // Errors are handled within the hook
      console.error('Workflow execution failed:', error);
    }
  }, [executeWorkflow, getNodes, updateNodes]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#050608] text-slate-100">
      {/* Top Navigation Bar */}
      <TopBar />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar with Tools */}
        <Sidebar />

        {/* Central Canvas Area */}
        <div className="flex-1 relative">
          <FlowCanvas
            onNodeClick={setSelectedNode}
            onNodesChange={updateNodes}
          />
          <BottomToolbar
            onRunWorkflow={handleRunWorkflow}
            isRunning={isRunning}
          />
        </div>

        {/* Right Inspector Panel */}
        <RightPanel
          selectedNode={selectedNode}
          onNodeDataChange={updateNodeData}
        />
      </div>
    </div>
  );
}

export default App;
