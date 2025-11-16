import React from 'react';

interface BottomToolbarProps {
  onRunWorkflow: () => void;
  isRunning?: boolean;
}

export const BottomToolbar: React.FC<BottomToolbarProps> = ({ onRunWorkflow, isRunning = false }) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur border border-white/10 rounded-full px-4 py-1 flex items-center gap-3">
      {/* Zoom controls */}
      <button className="text-xs text-slate-300 hover:text-slate-100 px-2 py-0.5 rounded hover:bg-white/10 transition-colors">
        Fit
      </button>
      <button className="text-xs text-slate-300 hover:text-slate-100 px-2 py-0.5 rounded hover:bg-white/10 transition-colors">
        −
      </button>
      <span className="text-xs text-slate-400">100%</span>
      <button className="text-xs text-slate-300 hover:text-slate-100 px-2 py-0.5 rounded hover:bg-white/10 transition-colors">
        +
      </button>

      {/* Separator */}
      <div className="w-px h-4 bg-white/15"></div>

      {/* Run workflow button */}
      <button
        onClick={onRunWorkflow}
        disabled={isRunning}
        className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed rounded-full px-3 py-0.5 text-xs text-slate-100 transition-colors"
      >
        {isRunning ? 'Running...' : 'Run workflow'}
      </button>
    </div>
  );
};
