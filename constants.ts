import { type RelationshipStatus } from './types';

export const RELATIONSHIP_LEVELS: RelationshipStatus[] = [
    { level: '路人', minFavorability: 0 },
    { level: '熟人', minFavorability: 20 },
    { level: '朋友', minFavorability: 40 },
    { level: '挚友', minFavorability: 60 },
    { level: '恋人', minFavorability: 80 },
    { level: '未婚伴侣', minFavorability: 100 },
];

export const FAVORABILITY_MAX = 100;

export const PARTNER_PORTRAITS = [
    'https://free.picui.cn/free/2025/10/29/6901a144753fc.png',
    'https://free.picui.cn/free/2025/10/29/6901a1426a4f8.png',
    'https://free.picui.cn/free/2025/10/29/6901a142290e8.png',
    'https://free.picui.cn/free/2025/10/29/6901a14451555.png',
    'https://free.picui.cn/free/2025/10/29/6901a1428ad35.png',
];
