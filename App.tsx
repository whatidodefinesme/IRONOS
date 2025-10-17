import React, { useState, useEffect } from 'react';
import ChatWidget from './components/ChatWidget';
import ClockWidget from './components/ClockWidget';
import SystemStatusWidget from './components/SystemStatusWidget';
import GlobeWidget from './components/GlobeWidget';
import WelcomeWidget from './components/WelcomeWidget';
import WeatherWidget from './components/WeatherWidget';
import { useSound } from './hooks/useSound';
import { bootupSound } from './assets/sounds';

const BootingScreen: React.FC = () => {
  const lines = [
    "INITIALIZING F.R.I.D.A.Y. OS...",
    "LOADING CORE MODULES...",
    "ESTABLISHING SECURE CONNECTION TO STARK INDUSTRIES MAINFR...",
    "CALIBRATING HOLOGRAPHIC INTERFACE...",
    "ARC REACTOR AT 98% CAPACITY...",
    "ALL SYSTEMS NOMINAL.",
    "WELCOME, MR. STARK."
  ];

  const [visibleLines, setVisibleLines] = useState<string[]>([]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < lines.length) {
        setVisibleLines(prev => [...prev, lines[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#020a1a] flex items-center justify-center z-50">
      <div className="font-mono text-cyan-300 text-lg p-8">
        {visibleLines.map((line, i) => (
          <p key={i} className="animate-pulse">&gt; {line}</p>
        ))}
      </div>
    </div>
  );
}


const App: React.FC = () => {
  const [booting, setBooting] = useState(true);
  const playBootSound = useSound(bootupSound, 0.4);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooting(false);
      // Play sound once after user has interacted with the page or after a delay
      // Browsers often block autoplay audio until a user interaction
      // This timeout is a workaround
      setTimeout(() => playBootSound(), 100);
    }, 3000);
    return () => clearTimeout(timer);
  }, [playBootSound]);

  if (booting) {
    return <BootingScreen />;
  }

  return (
    <div className="min-h-screen bg-transparent text-[#00e5ff] p-4 md:p-6 lg:p-8 font-rajdhani relative z-10">
      <main className="w-full h-[calc(100vh-4rem)] grid grid-cols-12 grid-rows-6 gap-4 fade-in">
        <div className="col-span-12 row-span-1 md:col-span-3">
          <ClockWidget />
        </div>
        <div className="hidden md:block md:col-span-6 row-span-1">
          <WelcomeWidget />
        </div>
        <div className="hidden md:block md:col-span-3 row-span-1">
          <WeatherWidget />
        </div>

        <div className="col-span-12 row-span-3 md:col-span-3 md:row-span-5">
           <SystemStatusWidget />
        </div>

        <div className="col-span-12 row-span-2 md:col-span-6 md:row-span-3">
          <GlobeWidget />
        </div>
        
        <div className="col-span-12 row-span-3 md:col-span-3 md:row-span-5">
          <ChatWidget />
        </div>
      </main>
    </div>
  );
};

export default App;