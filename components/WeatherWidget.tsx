import React, { useState, useEffect, memo } from 'react';
import WidgetContainer from './WidgetContainer';

const initialWeather = {
    location: "MALIBU, CA",
    temp: 24,
    condition: "CLEAR",
    wind: 7,
    windDirection: "WSW"
};

const WeatherWidget: React.FC = () => {
    const [weather, setWeather] = useState(initialWeather);

    useEffect(() => {
        const interval = setInterval(() => {
            setWeather(prev => ({
                ...prev,
                temp: prev.temp + (Math.random() - 0.5) * 0.5,
                wind: Math.max(0, prev.wind + (Math.random() - 0.5)),
            }));
        }, 5000); // Update every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <WidgetContainer>
            <div className="flex flex-col justify-center h-full space-y-2">
                <div className="text-2xl font-bold tracking-wider">{weather.location}</div>
                <div className="flex justify-between items-baseline">
                    <span className="text-4xl font-semibold">{weather.temp.toFixed(1)}°C</span>
                    <span className="text-xl font-medium">{weather.condition}</span>
                </div>
                <div className="text-lg">
                    <span>WIND: {weather.wind.toFixed(1)} KPH {weather.windDirection}</span>
                </div>
            </div>
        </WidgetContainer>
    );
};

export default memo(WeatherWidget);