export type Gender = '男性' | '女性' | '其他';
export type InteractionMode = 'chat' | 'interaction';

export interface Character {
    name: string;
    gender: Gender;
    age: string;
    occupation: string;
    traits: string;
}

export interface Partner extends Character {
    personality: string;
    appearance: string;
    imageUrl: string;
}

export interface Message {
    sender: 'player' | 'partner';
    text: string;
    timestamp: number;
}

export type GameState = 'creation' | 'chat' | 'wedding';

export interface RelationshipStatus {
    level: string;
    minFavorability: number;
}
