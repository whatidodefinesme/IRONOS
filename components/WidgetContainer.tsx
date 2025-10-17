import React from 'react';

interface WidgetContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  padding?: string;
}

const WidgetContainer: React.FC<WidgetContainerProps> = ({ children, className = '', title, padding = 'p-4' }) => {
  return (
    <div 
      className={`h-full bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-md shadow-lg shadow-cyan-500/10 flex flex-col relative overflow-hidden ${className}`}
      style={{
        clipPath: 'polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))'
      }}
    >
      <div className="absolute inset-0 border-2 border-cyan-400/20 rounded-md pointer-events-none animate-pulse" style={{ animationDuration: '5s' }}></div>
      {title && (
        <h2 className="text-lg font-bold uppercase tracking-widest text-cyan-300 bg-black/30 p-2 px-4 border-b border-cyan-500/30 flex-shrink-0">
          {title}
        </h2>
      )}
      <div className={`${padding} flex-grow overflow-auto`}>
        {children}
      </div>
    </div>
  );
};

export default WidgetContainer;