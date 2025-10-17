import React, { useState, useEffect, useCallback, memo } from 'react';
import { AreaChart, Area, YAxis, ResponsiveContainer } from 'recharts';
import WidgetContainer from './WidgetContainer';

const generateData = () => {
  return Array.from({ length: 10 }, (_, i) => ({
    name: i,
    uv: Math.floor(Math.random() * 80) + 20,
  }));
};

const SystemStatusWidget: React.FC = () => {
  const [data1, setData1] = useState(() => generateData());
  const [data2, setData2] = useState(() => generateData());
  const [power, setPower] = useState(98);

  const updateData = useCallback(() => {
    setData1(prevData => [...prevData.slice(1), { name: prevData.length, uv: Math.floor(Math.random() * 80) + 20 }]);
    setData2(prevData => [...prevData.slice(1), { name: prevData.length, uv: Math.floor(Math.random() * 80) + 20 }]);
    setPower(p => Math.min(100, Math.max(90, p + (Math.random() - 0.5) * 2)));
  }, []);

  useEffect(() => {
    const interval = setInterval(updateData, 2000);
    return () => clearInterval(interval);
  }, [updateData]);

  return (
    <WidgetContainer title="SYSTEM DIAGNOSTICS">
      <div className="h-full flex flex-col justify-between">
        <div>
          <h3 className="text-cyan-300 font-semibold tracking-wider">ARC REACTOR OUTPUT</h3>
          <div className="w-full bg-black/30 h-8 border border-cyan-500/50 mt-1 rounded-sm p-1">
             <div className="bg-cyan-400 h-full transition-all duration-500" style={{ width: `${power}%`, boxShadow: '0 0 15px rgba(0, 229, 255, 0.6)' }}></div>
          </div>
           <p className="text-right font-bold text-lg">{power.toFixed(2)}%</p>
        </div>
        <div className="h-1/3 w-full mt-4">
          <h3 className="text-cyan-300 font-semibold tracking-wider mb-2">NETWORK I/O (TB/s)</h3>
          <ResponsiveContainer>
             <AreaChart data={data1} margin={{ top: 0, right: 0, left: -50, bottom: 0 }}>
               <defs>
                 <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.8}/>
                   <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(0, 229, 255, 0.5)' }} />
               <Area type="monotone" dataKey="uv" stroke="#00e5ff" fillOpacity={1} fill="url(#colorUv)" isAnimationActive={false} />
             </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="h-1/3 w-full mt-4">
          <h3 className="text-cyan-300 font-semibold tracking-wider mb-2">COMPUTE UNITS</h3>
          <ResponsiveContainer>
             <AreaChart data={data2} margin={{ top: 0, right: 0, left: -50, bottom: 0 }}>
               <defs>
                 <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                   <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(0, 229, 255, 0.5)' }} />
               <Area type="monotone" dataKey="uv" stroke="#22d3ee" fillOpacity={1} fill="url(#colorPv)" isAnimationActive={false}/>
             </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </WidgetContainer>
  );
};

export default memo(SystemStatusWidget);