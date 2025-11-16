import React from 'react';

export const TopBar: React.FC = () => {
  return (
    <div className="h-10 bg-[#050608] border-b border-white/10 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400">Workspace</span>
        <div className="bg-white/5 border border-white/10 rounded-full px-3 py-0.5">
          <span className="text-xs text-slate-100">Weavy-Style Editor</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="text-xs text-slate-400 hover:text-slate-100 px-2 py-1 rounded hover:bg-white/5">
          Settings
        </button>
      </div>
    </div>
  );
};
