import React from 'react';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-14 bg-[#050608] border-r border-white/10 flex flex-col items-center py-3 gap-2">
      {/* Logo placeholder - using a simple icon instead of Weavy's logo */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
        <span className="text-white text-xs font-bold">W</span>
      </div>

      {/* Tool icons */}
      <button className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-slate-100 transition-colors">
        <span className="text-lg">🗂</span>
      </button>
      <button className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-slate-100 transition-colors">
        <span className="text-lg">🎛</span>
      </button>
      <button className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-slate-100 transition-colors">
        <span className="text-lg">📽</span>
      </button>
    </div>
  );
};
