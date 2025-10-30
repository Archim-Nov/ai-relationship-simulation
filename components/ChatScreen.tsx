import React, { useState, useRef, useEffect, useMemo } from 'react';
import { type Character, type Partner, type Message, type InteractionMode } from '../types';
import { ProgressBar } from './ProgressBar';
import { StatusPanel } from './StatusPanel';

interface ChatScreenProps {
    player: Character;
    partner: Partner;
    chatHistory: Message[];
    onSendMessage: (message: string, mode: InteractionMode) => void;
    relationshipLevel: string;
    favorability: number;
    isLoading: boolean;
    statusPanel: string;
}

const ChatHistoryModal: React.FC<{ messages: Message[]; player: Character; partner: Partner; onClose: () => void; }> = ({ messages, player, partner, onClose }) => {
    return (
        <div className="absolute inset-0 bg-black/50 z-30 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg h-full max-h-[80vh] flex flex-col p-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-gray-800">聊天记录</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2">
                    {messages.map((msg, index) => {
                        const isPlayer = msg.sender === 'player';
                        return (
                            <div key={index} className={`flex items-start gap-3 my-4 ${isPlayer ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-full flex-shrink-0 ${isPlayer ? 'bg-pink-300' : 'bg-rose-300'}`}></div>
                                <div className={`p-3 rounded-lg max-w-xs break-words ${isPlayer ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    <p className="font-bold mb-1 text-sm">{isPlayer ? player.name : partner.name}</p>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


export const ChatScreen: React.FC<ChatScreenProps> = ({ player, partner, chatHistory, onSendMessage, relationshipLevel, favorability, isLoading, statusPanel }) => {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<InteractionMode>('interaction');
    const [displayedText, setDisplayedText] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    
    const lastMessage = useMemo(() => chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null, [chatHistory]);


    useEffect(() => {
        if (lastMessage) {
            let i = 0;
            const textToDisplay = lastMessage.text;
            setDisplayedText(''); 

            const intervalId = setInterval(() => {
                if (i < textToDisplay.length) {
                    setDisplayedText(prev => prev + textToDisplay.charAt(i));
                    i++;
                } else {
                    clearInterval(intervalId);
                }
            }, 35);

            return () => clearInterval(intervalId);
        }
    }, [lastMessage]);


    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim(), mode);
            setInput('');
        }
    };
    
    const speakerName = lastMessage?.sender === 'player' ? player.name : partner.name;

    return (
        <div className="h-screen w-screen flex flex-row bg-white overflow-hidden">
            
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative">
                {showHistory && <ChatHistoryModal messages={chatHistory} player={player} partner={partner} onClose={() => setShowHistory(false)} />}
                
                <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20">
                    <div className="w-1/3">
                        <button onClick={() => setShowHistory(true)} className="bg-white/70 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition-colors">
                            聊天记录
                        </button>
                    </div>
                    <div className="w-1/3">
                        <ProgressBar favorability={favorability} level={relationshipLevel} />
                    </div>
                    <div className="w-1/3 flex justify-end">
                        <div className="inline-flex rounded-lg bg-white/70 backdrop-blur-sm shadow-md p-1">
                            <button onClick={() => setMode('interaction')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === 'interaction' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-600'}`}>
                                互动
                            </button>
                            <button onClick={() => setMode('chat')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === 'chat' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-600'}`}>
                                纯聊天
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex items-end justify-center pt-24 pb-48">
                    <div className="h-full w-auto max-w-md animate-fade-in">
                        <img 
                            src={partner.imageUrl}
                            alt={partner.name} 
                            className="h-full w-full object-contain object-bottom drop-shadow-2xl"
                        />
                    </div>
                </main>

                <footer className="absolute bottom-0 left-0 right-0 p-4 flex-shrink-0 z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="min-h-[150px] bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-xl p-4 mb-3 shadow-lg flex flex-col justify-between">
                            <div>
                                <p className="font-bold text-xl text-pink-600 mb-2">{isLoading ? partner.name : speakerName}</p>
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2.5 h-2.5 bg-pink-300 rounded-full animate-pulse"></div>
                                        <div className="w-2.5 h-2.5 bg-pink-300 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                        <div className="w-2.5 h-2.5 bg-pink-300 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                    </div>
                                ) : (
                                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{displayedText}</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-md border border-gray-200/80 p-2 rounded-xl shadow-lg flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSend()}
                                placeholder={`与 ${partner.name} 说些什么...`}
                                className="flex-1 bg-transparent p-2 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800 placeholder-gray-500"
                                disabled={isLoading}
                            />
                            <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 transition-all disabled:bg-pink-300 disabled:cursor-not-allowed transform hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Status Panel */}
            <aside className="w-96 h-screen bg-pink-50/50 p-4 overflow-y-auto border-l border-pink-200 shadow-lg flex-shrink-0">
                <StatusPanel statusText={statusPanel} />
            </aside>
        </div>
    );
};