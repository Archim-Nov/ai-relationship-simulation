
import React from 'react';
import { type Character, type Partner } from '../types';

interface WeddingScreenProps {
    player: Character;
    partner: Partner;
    onRestart: () => void;
}

export const WeddingScreen: React.FC<WeddingScreenProps> = ({ player, partner, onRestart }) => {
    return (
        <div className="h-screen w-screen flex items-center justify-center p-4 bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/wedding/1920/1080')"}}>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 text-center max-w-2xl transform transition-all hover:shadow-pink-200/50">
                <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4">婚礼的祝福</h1>
                <p className="text-xl md:text-2xl text-gray-700 mb-8">
                    恭喜 <span className="font-semibold text-pink-500">{player.name}</span> 与 <span className="font-semibold text-pink-500">{partner.name}</span>！
                </p>
                <p className="text-gray-600 mb-10">
                    经过一路的相识、相知与相爱，你们终于迎来了这神圣的时刻。愿你们的未来充满无尽的爱与幸福，携手共度每一个美好的明天。
                </p>

                <div className="w-40 h-40 mx-auto mb-10 rounded-full overflow-hidden shadow-lg border-4 border-white">
                    <img src="https://picsum.photos/seed/couple/200" alt="Couple" className="w-full h-full object-cover" />
                </div>

                <button 
                    onClick={onRestart}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                    开启新的故事
                </button>
            </div>
        </div>
    );
};
