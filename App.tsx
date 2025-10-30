import React, { useState, useEffect, useCallback } from 'react';
import { CharacterCreation } from './components/CharacterCreation';
import { ChatScreen } from './components/ChatScreen';
import { WeddingScreen } from './components/WeddingScreen';
import { generateChatResponse, generateOpeningAndStatus, analyzeRelationshipFavorability } from './services/geminiService';
import { type Character, type Partner, type Message, type InteractionMode, type GameState } from './types';
import { RELATIONSHIP_LEVELS, FAVORABILITY_MAX, FAVORABILITY_MIN } from './constants';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('creation');
    const [player, setPlayer] = useState<Character | null>(null);
    const [partner, setPartner] = useState<Partner | null>(null);
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [favorability, setFavorability] = useState(0);
    const [relationshipLevel, setRelationshipLevel] = useState(RELATIONSHIP_LEVELS[0].level);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('正在开启你们的故事...');
    const [statusPanel, setStatusPanel] = useState('正在生成状态...');
    const [worldview, setWorldview] = useState('');

    useEffect(() => {
        const newLevel = [...RELATIONSHIP_LEVELS]
            .reverse()
            .find(r => favorability >= r.minFavorability)?.level || RELATIONSHIP_LEVELS[0].level;

        if (newLevel !== relationshipLevel) {
            setRelationshipLevel(newLevel);
            if (newLevel === '未婚伴侣' && favorability >= FAVORABILITY_MAX) {
                setTimeout(() => {
                    setGameState('wedding');
                }, 2000);
            }
        }
    }, [favorability, relationshipLevel]);

    const handleCreationComplete = async (playerData: Character, partnerData: Partner, relationshipStory: string, worldviewData: string) => {
        setPlayer(playerData);
        setPartner(partnerData);
        setWorldview(worldviewData);
        setIsLoading(true);
        setGameState('chat');

        setLoadingMessage('正在分析你们的关系...');
        const initialFavorability = await analyzeRelationshipFavorability(relationshipStory);
        setFavorability(initialFavorability);

        setLoadingMessage('正在生成开场白和初始状态...');
        const { openingLine, initialStatusPanel } = await generateOpeningAndStatus(playerData, partnerData, relationshipStory, initialFavorability, worldviewData);

        setChatHistory([
            {
                sender: 'partner',
                text: openingLine,
                timestamp: Date.now()
            }
        ]);
        setStatusPanel(initialStatusPanel);
        setIsLoading(false);
    };

    const handleSendMessage = useCallback(async (message: string, mode: InteractionMode) => {
        if (!player || !partner || isLoading) return;

        const userMessage: Message = { sender: 'player', text: message, timestamp: Date.now() };
        setChatHistory(prev => [...prev, userMessage]);
        setIsLoading(true);

        const { text, favorabilityChange, statusPanel: newStatusPanel } = await generateChatResponse(player, partner, chatHistory, message, mode, relationshipLevel, favorability, worldview);

        const partnerMessage: Message = { sender: 'partner', text, timestamp: Date.now() + 1 };
        
        setChatHistory(prev => [...prev, partnerMessage]);
        setFavorability(prev => Math.max(FAVORABILITY_MIN, Math.min(FAVORABILITY_MAX, prev + favorabilityChange)));
        setStatusPanel(newStatusPanel);
        setIsLoading(false);

    }, [player, partner, isLoading, chatHistory, relationshipLevel, favorability, worldview]);

    const handleRestart = () => {
        setGameState('creation');
        setPlayer(null);
        setPartner(null);
        setChatHistory([]);
        setFavorability(0);
        setRelationshipLevel(RELATIONSHIP_LEVELS[0].level);
        setIsLoading(false);
        setWorldview('');
    };

    const renderContent = () => {
        switch (gameState) {
            case 'creation':
                return <CharacterCreation onComplete={handleCreationComplete} />;
            case 'chat':
                if (player && partner) {
                    return <ChatScreen 
                                player={player}
                                partner={partner}
                                chatHistory={chatHistory}
                                onSendMessage={handleSendMessage}
                                relationshipLevel={relationshipLevel}
                                favorability={favorability}
                                isLoading={isLoading}
                                statusPanel={statusPanel}
                           />;
                }
                return <div className="h-screen w-screen flex items-center justify-center bg-white"><p className="text-pink-500 animate-pulse">{loadingMessage}</p></div>;
            case 'wedding':
                 if (player && partner) {
                    return <WeddingScreen player={player} partner={partner} onRestart={handleRestart} />;
                 }
                 return null;
            default:
                return <div>Error: Invalid game state</div>;
        }
    };

    return (
        <div className="w-full h-full">
            {renderContent()}
        </div>
    );
};

export default App;