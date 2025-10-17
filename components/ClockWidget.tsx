import React, { useState, useEffect, memo } from 'react';
import WidgetContainer from './WidgetContainer';

const ClockWidget: React.FC = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const day = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <WidgetContainer>
      <div className="flex flex-col justify-center items-center h-full text-center">
        <div className="text-5xl md:text-6xl font-bold tracking-wider text-cyan-200" style={{textShadow: '0 0 10px rgba(0, 229, 255, 0.7)'}}>
          {time}
        </div>
        <div className="text-lg md:text-xl font-medium uppercase tracking-widest text-cyan-400 mt-2">
          {day}
        </div>
      </div>
    </WidgetContainer>
  );
};

export default memo(ClockWidget);