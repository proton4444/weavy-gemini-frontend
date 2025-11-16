import React from 'react';

interface BaseNodeProps {
  title: string;
  variant: 'green' | 'purple';
  footerLabel?: string;
  status?: string;
  children: React.ReactNode;
  onRunClick?: () => void;
}

const variantStyles = {
  green: {
    container: 'bg-[#143C2E] border-[#235c44]',
    header: 'text-emerald-100',
  },
  purple: {
    container: 'bg-[#2A1848] border-[#5b3fb0]',
    header: 'text-purple-100',
  },
};

export const BaseNode: React.FC<BaseNodeProps> = ({
  title,
  variant,
  footerLabel = 'Run node',
  status = 'Ready',
  children,
  onRunClick,
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={`rounded-2xl shadow-xl border ${styles.container} min-w-[260px] max-w-[360px] overflow-hidden`}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <h3 className={`text-sm font-medium ${styles.header}`}>{title}</h3>
        <button className="text-slate-400 hover:text-slate-100 text-xs">⋮</button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">{children}</div>

      {/* Footer */}
      <div className="border-t border-white/10 px-4 py-2 flex items-center justify-between">
        <button
          onClick={onRunClick}
          className="text-xs text-slate-400 hover:text-slate-100 transition-colors"
        >
          {footerLabel}
        </button>
        <span className="text-xs text-slate-500">{status}</span>
      </div>
    </div>
  );
};
