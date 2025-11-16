import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { BaseNode } from './BaseNode';

export const OutputNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <>
      {/* Target handle on the left */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-purple-500 !border-purple-600"
      />

      <BaseNode
        title={data.label || 'Output'}
        variant="purple"
        footerLabel="Final"
        status={data.status || 'Ready'}
      >
        <div className="bg-black/20 border border-white/10 rounded-lg p-2 text-[11px] text-slate-200 max-h-40 overflow-auto">
          {data.result || 'No output yet...'}
        </div>
      </BaseNode>
    </>
  );
};
