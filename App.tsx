import React, { useState, useEffect, useCallback } from 'react';
import { CharacterCreation } from './components/CharacterCreation';
import { ChatScreen } from './components/ChatScreen';
import { WeddingScreen } from './components/WeddingScreen';
import { generateChatResponse, generateOpeningLine, analyzeRelationshipFavorability } from './services/geminiService';
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

    useEffect(() => {
        const newLevel = [...RELATIONSHIP_LEVELS]
            .reverse()
            .find(r => favorability >= r.minFavorability)?.level || RELATIONSHIP_LEVELS[0].level;

        if (newLevel !== relationshipLevel) {
            setRelationshipLevel(newLevel);
            if (newLevel === '未婚伴侣' && favorability >= FAVORABILITY_MAX) {
                setTimeout(() => {
                    setGameState('wedding');
                }, 2000); // Add a small delay before showing the wedding screen
            }
        }
    }, [favorability, relationshipLevel]);

    const handleCreationComplete = async (playerData: Character, partnerData: Partner, relationshipStory: string) => {
        setPlayer(playerData);
        setPartner(partnerData);
        setIsLoading(true);
        setGameState('chat');

        setLoadingMessage('正在分析你们的关系...');
        const initialFavorability = await analyzeRelationshipFavorability(relationshipStory);
        setFavorability(initialFavorability);

        setLoadingMessage('正在生成开场白...');
        const openingLine = await generateOpeningLine(playerData, partnerData, relationshipStory);

        setChatHistory([
            {
                sender: 'partner',
                text: openingLine,
                timestamp: Date.now()
            }
        ]);
        setIsLoading(false);
    };

    const handleSendMessage = useCallback(async (message: string, mode: InteractionMode) => {
        if (!player || !partner || isLoading) return;

        const userMessage: Message = { sender: 'player', text: message, timestamp: Date.now() };
        setChatHistory(prev => [...prev, userMessage]);
        setIsLoading(true);

        const aiResponse = await generateChatResponse(player, partner, chatHistory, message, mode, relationshipLevel, favorability);

        const partnerMessage: Message = { sender: 'partner', text: aiResponse.text, timestamp: Date.now() + 1 };
        
        setChatHistory(prev => [...prev, partnerMessage]);
        setFavorability(prev => Math.max(FAVORABILITY_MIN, Math.min(FAVORABILITY_MAX, prev + aiResponse.favorabilityChange)));
        setIsLoading(false);

    }, [player, partner, isLoading, chatHistory, relationshipLevel, favorability]);

    const handleRestart = () => {
        setGameState('creation');
        setPlayer(null);
        setPartner(null);
        setChatHistory([]);
        setFavorability(0);
        setRelationshipLevel(RELATIONSHIP_LEVELS[0].level);
        setIsLoading(false);
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
                           />;
                }
                 // Show a loading screen while the opening line is being generated
                return <div className="h-screen w-screen flex items-center justify-center bg-white"><p className="text-pink-500 animate-pulse">{loadingMessage}</p></div>;
            case 'wedding':
                 if (player && partner) {
                    return <WeddingScreen player={player} partner={partner} onRestart={handleRestart} />;
                 }
                 return null; // Should not happen
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