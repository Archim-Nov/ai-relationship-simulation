
import React from 'react';
import { FAVORABILITY_MAX } from '../constants';

interface ProgressBarProps {
    favorability: number;
    level: string;
}

const HeartIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);


export const ProgressBar: React.FC<ProgressBarProps> = ({ favorability, level }) => {
    const percentage = (favorability / FAVORABILITY_MAX) * 100;

    return (
        <div className="w-full bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-pink-700">好感度: {level}</span>
                <span className="text-sm font-bold text-pink-500">{favorability} / {FAVORABILITY_MAX}</span>
            </div>
            <div className="w-full bg-pink-200 rounded-full h-4 relative overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-rose-400 to-pink-500 h-4 rounded-full transition-all duration-500 ease-out flex items-center justify-end"
                    style={{ width: `${percentage}%` }}
                >
                   <HeartIcon className="text-white h-3 w-3 mr-1 opacity-80" />
                </div>
            </div>
        </div>
    );
};
