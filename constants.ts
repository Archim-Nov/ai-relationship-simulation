import { type RelationshipStatus } from './types';

export const FAVORABILITY_MIN = -1000;
export const FAVORABILITY_MAX = 1000;

export const RELATIONSHIP_LEVELS: RelationshipStatus[] = [
    { level: '血海深仇', minFavorability: -1000 },
    { level: '仇人', minFavorability: -750 },
    { level: '厌恶', minFavorability: -500 },
    { level: '冷漠', minFavorability: -250 },
    { level: '路人', minFavorability: 0 },
    { level: '熟人', minFavorability: 100 },
    { level: '朋友', minFavorability: 300 },
    { level: '挚友', minFavorability: 500 },
    { level: '恋人', minFavorability: 750 },
    { level: '未婚伴侣', minFavorability: 1000 },
];


export const PARTNER_PORTRAITS = [
    'https://free.picui.cn/free/2025/10/29/6901a144753fc.png',
    'https://free.picui.cn/free/2025/10/29/6901a1426a4f8.png',
    'https://free.picui.cn/free/2025/10/29/6901a142290e8.png',
    'https://free.picui.cn/free/2025/10/29/6901a14451555.png',
    'https://free.picui.cn/free/2025/10/29/6901a1428ad35.png',
];