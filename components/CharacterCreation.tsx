import React, { useState } from 'react';
import { type Character, type Partner, type Gender } from '../types';
import { PARTNER_PORTRAITS } from '../constants';

interface CharacterCreationProps {
    onComplete: (player: Character, partner: Partner, relationshipStory: string) => void;
}

// --- Random Data ---
const MALE_NAMES = ['浩宇', '子轩', '俊熙', '伟诚', '博文', '立诚'];
const FEMALE_NAMES = ['欣怡', '梓涵', '语嫣', '思妤', '若曦', '雪丽'];
const OTHER_NAMES = ['星辰', '云舒', '秋水', '凌风', '晓月'];
const OCCUPATIONS = ['艺术家', '科学家', '医生', '律师', '教师', '工程师', '企业家', '自由职业者'];
const TRAITS = ['幽默', '体贴', '富有创造力', '理性', '感性', '冒险精神', '内向', '外向', '有责任心'];
const PERSONALITIES = ['阳光开朗，充满正能量', '安静内敛，内心世界丰富', '成熟稳重，值得信赖', '古灵精怪，总有新奇想法'];
const APPEARANCES = ['清爽的短发，眼眸深邃如星辰', '及腰长发，笑起来有两个可爱的酒窝', '戴着一副金丝眼镜，显得斯文儒雅', '运动风格，充满青春活力'];

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomAge = () => (Math.floor(Math.random() * 18) + 22).toString(); // Age 22-39

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
    <div className="mb-4">
        <label className="block text-pink-700 text-sm font-bold mb-2">{label}</label>
        <input
            className="shadow appearance-none border border-pink-200 rounded-lg w-full py-2 px-3 text-gray-800 bg-white/70 placeholder:text-gray-400 leading-tight focus:outline-none focus:bg-white focus:ring-2 focus:ring-pink-400 transition-colors"
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    </div>
);

const TextAreaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number }> = ({ label, value, onChange, placeholder, rows=3 }) => (
     <div className="mb-4">
        <label className="block text-pink-700 text-sm font-bold mb-2 text-center">{label}</label>
        <textarea
            className="shadow appearance-none border border-pink-200 rounded-lg w-full py-2 px-3 text-gray-800 bg-white/70 placeholder:text-gray-400 leading-tight focus:outline-none focus:bg-white focus:ring-2 focus:ring-pink-400 transition-colors"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
        />
    </div>
);

const GenderSelector: React.FC<{ label: string; value: Gender; onChange: (value: Gender) => void; }> = ({ label, value, onChange }) => (
    <div className="mb-4">
        <label className="block text-pink-700 text-sm font-bold mb-2">{label}</label>
        <div className="flex space-x-4">
            {(['男性', '女性', '其他'] as Gender[]).map(gender => (
                <button
                    key={gender}
                    type="button"
                    onClick={() => onChange(gender)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${value === gender ? 'bg-pink-500 text-white shadow-md' : 'bg-white text-pink-500 border border-pink-300 hover:bg-pink-100'}`}
                >
                    {gender}
                </button>
            ))}
        </div>
    </div>
);

const HeartIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);


export const CharacterCreation: React.FC<CharacterCreationProps> = ({ onComplete }) => {
    const [player, setPlayer] = useState<Character>({ name: '阿杰', gender: '男性', age: '25', occupation: '程序员', traits: '善良, 有点内向' });
    const [partner, setPartner] = useState<Partner>({ name: '小雅', gender: '女性', age: '24', occupation: '设计师', traits: '开朗, 喜欢艺术', personality: '温柔体贴，偶尔有点小调皮', appearance: '长发及腰，有着明亮的眼睛和甜美的微笑', imageUrl: PARTNER_PORTRAITS[0] });
    const [relationshipStory, setRelationshipStory] = useState('我们是青梅竹马，从小一起长大，分享着无数的秘密和梦想。');

    const handleRandomize = (characterType: 'player' | 'partner') => {
        const gender = getRandomItem<Gender>(['男性', '女性', '其他']);
        let name = '';
        if (gender === '男性') name = getRandomItem(MALE_NAMES);
        else if (gender === '女性') name = getRandomItem(FEMALE_NAMES);
        else name = getRandomItem(OTHER_NAMES);

        const newChar = {
            name,
            gender,
            age: getRandomAge(),
            occupation: getRandomItem(OCCUPATIONS),
            traits: `${getRandomItem(TRAITS)}, ${getRandomItem(TRAITS)}`,
        };

        if (characterType === 'player') {
            setPlayer(newChar);
        } else {
            setPartner({
                ...newChar,
                personality: getRandomItem(PERSONALITIES),
                appearance: getRandomItem(APPEARANCES),
                imageUrl: getRandomItem(PARTNER_PORTRAITS),
            });
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onComplete(player, partner, relationshipStory);
    };

    return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:shadow-pink-200/50">
                <h1 className="text-4xl font-bold text-center text-pink-600 mb-2">创建你的浪漫故事</h1>
                <p className="text-center text-gray-500 mb-8">定义你和你的理想伴侣，开启一段独一无二的恋情。</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row items-stretch justify-center gap-6">
                        {/* Player Column */}
                        <div className="bg-pink-100/50 p-6 rounded-xl flex-1">
                            <div className="flex justify-between items-center mb-6 border-b-2 border-pink-200 pb-2">
                                <h2 className="text-2xl font-semibold text-pink-800">关于你</h2>
                                <button type="button" onClick={() => handleRandomize('player')} className="text-sm bg-pink-200 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-300 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400">
                                    随机生成
                                </button>
                            </div>
                            <InputField label="你的名字" value={player.name} onChange={e => setPlayer({...player, name: e.target.value})} />
                            <GenderSelector label="你的性别" value={player.gender} onChange={value => setPlayer(p => ({...p, gender: value}))} />
                            <InputField label="你的年龄" value={player.age} onChange={e => setPlayer({...player, age: e.target.value})} />
                            <InputField label="你的职业" value={player.occupation} onChange={e => setPlayer({...player, occupation: e.target.value})} />
                            <TextAreaField label="你的特征" value={player.traits} onChange={e => setPlayer({...player, traits: e.target.value})} placeholder="例如：善良, 幽默, 热爱运动" />
                        </div>

                        {/* Relationship Column */}
                        <div className="flex flex-col items-center justify-center p-4 flex-none md:w-1/4">
                             <HeartIcon className="w-12 h-12 text-pink-400 mb-4" />
                             <TextAreaField 
                                label="你们的关系"
                                value={relationshipStory}
                                onChange={e => setRelationshipStory(e.target.value)}
                                placeholder="例如：我们是一见钟情..."
                                rows={8}
                            />
                        </div>
                        

                        {/* Partner Column */}
                        <div className="bg-rose-100/50 p-6 rounded-xl flex-1">
                             <div className="flex justify-between items-center mb-6 border-b-2 border-rose-200 pb-2">
                                <h2 className="text-2xl font-semibold text-rose-800">关于你的伴侣</h2>
                                <button type="button" onClick={() => handleRandomize('partner')} className="text-sm bg-rose-200 text-rose-700 px-3 py-1 rounded-full hover:bg-rose-300 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400">
                                    随机生成
                                </button>
                            </div>
                             <InputField label="伴侣的名字" value={partner.name} onChange={e => setPartner({...partner, name: e.target.value})} />
                            <GenderSelector label="伴侣的性别" value={partner.gender} onChange={value => setPartner(p => ({...p, gender: value}))} />
                            <InputField label="伴侣的年龄" value={partner.age} onChange={e => setPartner({...partner, age: e.target.value})} />
                            <InputField label="伴侣的职业" value={partner.occupation} onChange={e => setPartner({...partner, occupation: e.target.value})} />
                            <TextAreaField label="伴侣的特征" value={partner.traits} onChange={e => setPartner({...partner, traits: e.target.value})} placeholder="例如：开朗, 喜欢小动物" />
                            <TextAreaField label="伴侣的性格" value={partner.personality} onChange={e => setPartner({...partner, personality: e.target.value})} placeholder="例如：温柔体贴，善解人意" />
                            <TextAreaField label="具体身材描述" value={partner.appearance} onChange={e => setPartner({...partner, appearance: e.target.value})} placeholder="例如：长发，大眼睛，笑容很甜" />
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                            开启心动之旅
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};