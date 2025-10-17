import React, { memo } from 'react';
import WidgetContainer from './WidgetContainer';

const GlobeWidget: React.FC = () => {
  return (
    <WidgetContainer className="p-0 flex items-center justify-center overflow-hidden" padding="p-0">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
          </radialGradient>
          <filter id="glowFilter">
             <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
        </defs>
        
        {/* Glow */}
        <circle cx="100" cy="100" r="60" fill="url(#glow)" />
        <circle cx="100" cy="100" r="50" fill="transparent" stroke="#0ea5e9" strokeWidth="0.5" filter="url(#glowFilter)" />
        
        {/* Main sphere */}
        <circle cx="100" cy="100" r="50" fill="transparent" stroke="#0ea5e9" strokeWidth="0.5" />
        
        {/* Rotating Rings */}
        <ellipse cx="100" cy="100" rx="50" ry="20" fill="transparent" stroke="#0e7490" strokeWidth="0.5" transform="rotate(20 100 100)" />
        <ellipse cx="100" cy="100" rx="50" ry="40" fill="transparent" stroke="#0e7490" strokeWidth="0.5" transform="rotate(-30 100 100)" />

        {/* Animated Rings */}
        <g style={{ transformOrigin: '100px 100px', animation: 'rotate 20s linear infinite' }}>
          <ellipse cx="100" cy="100" rx="65" ry="30" fill="transparent" stroke="#22d3ee" strokeWidth="0.7" strokeDasharray="4 4" />
        </g>
        <g style={{ transformOrigin: '100px 100px', animation: 'rotate-reverse 30s linear infinite' }}>
          <ellipse cx="100" cy="100" rx="75" ry="50" fill="transparent" stroke="#67e8f9" strokeWidth="0.5" />
        </g>

        {/* Grid Lines */}
        <path d="M50 100 A 50 50 0 0 1 150 100" fill="none" stroke="#0891b2" strokeWidth="0.3"/>
        <path d="M60 100 A 40 40 0 0 1 140 100" fill="none" stroke="#0891b2" strokeWidth="0.3" transform="rotate(45 100 100)"/>
        <path d="M60 100 A 40 40 0 0 1 140 100" fill="none" stroke="#0891b2" strokeWidth="0.3" transform="rotate(-45 100 100)"/>

      </svg>
      <style>{`
        @keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes rotate-reverse { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }
      `}</style>
    </WidgetContainer>
  );
};

export default memo(GlobeWidget);