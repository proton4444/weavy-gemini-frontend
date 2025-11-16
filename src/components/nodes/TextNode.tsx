import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { BaseNode } from './BaseNode';

export const TextNode: React.FC<NodeProps> = ({ data }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (data.onChange) {
      data.onChange(e.target.value);
    }
  };

  return (
    <>
      <BaseNode
        title={data.label || 'Prompt'}
        variant="green"
        footerLabel="Input"
        status={data.status || 'Ready'}
      >
        <textarea
          value={data.prompt || ''}
          onChange={handleChange}
          className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-slate-100 resize-none focus:outline-none focus:border-white/20 h-24"
          placeholder="Enter your prompt..."
        />
      </BaseNode>

      {/* Source handle on the right */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-emerald-500 !border-emerald-600"
      />
    </>
  );
};
