import React, { memo } from 'react';
import WidgetContainer from './WidgetContainer';

const WelcomeWidget: React.FC = () => {
    return (
        <WidgetContainer>
            <div className="flex flex-col justify-center items-center h-full text-center">
                <h1 className="text-4xl font-bold tracking-widest uppercase" style={{textShadow: '0 0 15px rgba(0, 229, 255, 0.5)'}}>
                    Welcome, Mr. Stark
                </h1>
                <p className="text-xl mt-2 text-cyan-300">
                    All systems online and ready for command.
                </p>
            </div>
        </WidgetContainer>
    );
};

export default memo(WelcomeWidget);