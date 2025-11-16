import React from 'react';

interface RightPanelProps {
  selectedNode: any | null;
  onNodeDataChange: (nodeId: string, data: any) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ selectedNode, onNodeDataChange }) => {
  if (!selectedNode) {
    return (
      <div className="w-80 bg-[#050608] border-l border-white/10 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Select a node to view properties</p>
      </div>
    );
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onNodeDataChange(selectedNode.id, {
      ...selectedNode.data,
      prompt: e.target.value,
    });
  };

  return (
    <div className="w-80 bg-[#050608] border-l border-white/10 p-4 overflow-y-auto">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-slate-100 mb-1">
          {selectedNode.data?.label || 'Node'}
        </h3>
        <p className="text-xs text-slate-500">Type: {selectedNode.type}</p>
      </div>

      {selectedNode.type === 'text' && (
        <div className="space-y-2">
          <label className="text-xs text-slate-400 block">Prompt</label>
          <textarea
            value={selectedNode.data?.prompt || ''}
            onChange={handlePromptChange}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-2 text-xs text-slate-100 resize-none focus:outline-none focus:border-white/20"
            rows={8}
            placeholder="Enter your prompt..."
          />
        </div>
      )}

      {(selectedNode.type === 'gemini' || selectedNode.type === 'output') && (
        <div className="space-y-2">
          <label className="text-xs text-slate-400 block">Result</label>
          <div className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-2 text-xs text-slate-200 max-h-96 overflow-auto">
            {selectedNode.data?.result || 'No result yet'}
          </div>
        </div>
      )}
    </div>
  );
};
