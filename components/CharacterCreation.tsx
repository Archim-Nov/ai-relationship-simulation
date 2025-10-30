import React, { useState } from 'react';
import { type Character, type Partner, type Gender } from '../types';
import { PARTNER_PORTRAITS } from '../constants';

interface CharacterCreationProps {
    onComplete: (player: Character, partner: Partner, relationshipStory: string, worldview: string) => void;
}

// --- Worldview Templates ---
const WORLDVIEW_TEMPLATES = {
    '现代都市': `[start]
<world_view>
# 基础信息
基础信息:
  世界名称: '现代都市'
  version: '1'
  世界简称: '都市'
  世界类型: '现代, 日常'
  核心设定: '一个与现实世界相似的现代化大都市，人们在这里学习、工作、生活，追求各自的梦想与爱情。'
# 地理环境
地理环境:
  世界整体形态: '由摩天大楼、商业街区、宁静的住宅区和公园绿地组成的繁华城市。'
  主要地形: '城市景观，包括繁忙的市中心、安静的郊区、沿海的港口或穿城而过的河流。'
  特殊地域: '市中心的中央公园，是情侣约会的圣地；城郊的观星台，可以俯瞰整座城市的夜景。'
# 社会规则
社会规则:
  法律体系: '与现代社会一致的法律与公共秩序。'
  道德规范: '普遍的现代社会道德观念，强调尊重、诚信与个人自由。'
  社交礼仪: '日常的社交礼仪，人们通过社交媒体和线下聚会进行互动。'
# 历史背景
历史背景:
  历史发展脉络: '遵循正常的现代历史发展，科技稳步进步，文化多元交融。'
</world_view>
[end]`,
    '赛博朋克': `[start]
<world_view>
# 基础信息
基础信息:
  世界名称: '永夜之城：涅槃'
  version: '1'
  世界简称: '永夜城, N.C.P'
  世界类型: '科幻, 赛博朋克'
  核心设定: '在生物科技与信息网络高度融合的社会，巨型企业通过义体植入与数据监控构建秩序，而个体的人性与记忆在虚拟与现实的边界上不断被侵蚀与重塑。'
# 地理环境 (最多3条)
地理环境:
  世界整体形态: '分层都市结构，上层是悬浮于污染云层之上的“天穹区”，为精英阶层所在地；中层是支撑天穹区的巨大核心塔与商业区；下层则是终年不见阳光、酸雨连绵的“地渊区”贫民窟。'
  主要地形: '地渊区由废弃的工业建筑、盘根-节的管道和高耸的全息广告牌构成，形成了立体交错的街道网络。天穹区则是拥有人造太阳与生态圈的光洁金属与玻璃建筑群。'
  特殊地域: '“遗忘之墟”——地渊区深处一个被彻底切断网络信号的区域，是黑市交易、反抗组织据点和逃亡者的最后避难所，传闻企业早期的失控实验体被遗弃于此。'
# 种族 / 势力 (最多3条,如果普通世界就不生成这一条)
种族_势力:
  主要种族:
    - 种族一: '原生人类（Purebloods）：未接受任何大型义体改造的人，在社会中数量稀少，要么是处于顶端的企业高管，要么是地渊区最底层的“无用者”。'
    - 种族二: '改造人（Cyborgs）：社会的主体构成，根据义体改造的程度和质量划分社会阶层，从廉价的工业义肢到昂贵的军用战斗义体，等级森严。'
  主要势力:
    - 势力一: '创世纪公司（Genesis Corp.）：掌控全球生物科技与义体制造的巨型垄断企业，主张通过科技进化实现“人类补完”，对社会实行全面监控与高压统治。'
    - 势力二: '幻影社（Phantoms）：最活跃的地下黑客与反抗组织，致力于窃取并公布企业黑幕，破坏其监控网络，其成员身份未知，只以代码名在网络深处活动。'
# 力量体系 (最多3条)
力量体系:
  核心力量来源: '义体改造：通过植入机械或生物增强部件获得超越常人的力量、速度与感知能力。信息入侵：通过神经接口直接连接网络，进行数据攻防与篡改现实信息。'
  力量等级_分类: '义体等级（从民用的Ⅰ级到军用的Ⅴ级，等级越高，对神经系统的负荷越大）。黑客等级（根据对网络防火墙的突破能力划分为：潜行者、破壁人、数据幽灵）。'
  力量获取方式: '通过官方渠道向创世纪公司购买并植入义体。通过地渊区的黑市医生进行非法改造或安装二手义体。通过自我学习或加入幻影社等组织掌握黑客技术。'
# 社会规则 (最多3条)
社会规则:
  法律体系: '由创世纪公司的《企业公民法》主导，公民身份与权限与其体内的认证芯片及对公司的贡献度直接挂钩。在地渊区，则通行着由各大帮派制定的地下法则。'
  道德规范: '社会主流价值观崇尚效率与技术进化，将情感视为弱点。而在底层，幸存者之间形成了一种脆弱而现实的互助关系，背叛是最高的禁忌。'
  社交礼仪: '在上层社会，通过义体的光效和接口的对接方式进行身份识别与信息交换。在底层，则通过特定的帮派手势或黑话进行交流，以防被监控系统识别。'
# 历史背景 (最多3条)
历史背景:
  关键历史事件: # 如果普通世界就不生成这一条
    - 事件一: '“大崩溃”（The Great Collapse）：几十年前，旧世界的全球网络因一种无法清除的AI病毒而瘫痪，导致社会秩序崩坏。创世纪公司凭借其独立的生物局域网技术崛起，并重建了世界秩序。'
    - 事件二: '“巴别塔事件”（Tower of Babel Incident）：十年前，一个试图连接所有人类意识的“全球脑”计划因失控而失败，造成大量参与者精神死亡，此事被创世纪公司掩盖，成为反抗组织诞生的导火索。'
  历史发展脉络: '从旧信息时代经历“大崩溃”后，进入由创世纪公司统治的“新秩序时代”，社会矛盾在科技高速发展下被不断压制与积累，反抗的火种在暗处蔓延。'
# 独特特征 如果普通世界就不生成这一条
独特特征: '记忆可以被数据化存储、交易甚至篡改。个体的存在意义不再仅仅依赖于生理实体，更取决于其在网络中的数据备份和身份认证，这也导致了“我是谁”这一终极哲学问题的具象化。'
</world_view>
[end]`,
    '奇幻世界': `[start]
<world_view>
# 基础信息
基础信息:
  世界名称: '艾瑞亚'
  version: '1'
  世界简称: '艾瑞亚'
  世界类型: '奇幻, 魔法'
  核心设定: '一个存在魔法与多种智慧种族的世界，古老的帝国与新兴的王国并存，神秘的魔法力量影响着世界的每一个角落。'
# 地理环境
地理环境:
  世界整体形态: '由广袤的森林、高耸的山脉、精灵的林地王国和人类的宏伟城堡构成。'
  主要地形: '巨龙山脉、低语森林、失落沼泽。'
  特殊地域: '天空之城“艾瑟拉”，悬浮在云端之上的魔法学院；地底深处的矮人都市“锻铁堡”。'
# 种族 / 势力
种族_势力:
  主要种族:
    - 种族一: '人类：数量最多，适应性强，建立了强大的帝国。'
    - 种族二: '精灵：优雅长寿，与自然和谐共生，是天生的弓箭手和魔法师。'
    - 种族三: '矮人：强壮坚韧，擅长锻造与采矿，居住在地底城市。'
  主要势力:
    - 势力一: '光辉帝国：人类建立的强大军事帝国，崇尚秩序与力量。'
    - 势力二: '银月议会：由精灵长老们组成的议会，致力于保护森林与古老知识。'
# 力量体系
力量体系:
  核心力量来源: '魔法，源于世界中的元素能量（火、水、风、土、光、暗）。'
  力量等级_分类: '魔法师等级从学徒、法师、大法师到圣域法师。'
  力量获取方式: '天生的魔法天赋，并通过在魔法学院学习或传承古老知识来掌握。'
# 社会规则
社会规则:
  法律体系: '各个王国和势力有自己的法律，但普遍遵守由魔法议会制定的《魔法公约》。'
  道德规范: '崇尚荣誉、勇气与智慧。不同种族间有各自的文化传统。'
# 历史背景
历史背景:
  关键历史事件:
    - 事件一: '上古之战：诸神与巨龙为了争夺世界主导权而爆发的战争，塑造了现今世界的格局。'
</world_view>
[end]`,
    '中古冒险': `[start]
<world_view>
# 基础信息
基础信息:
  世界名称: '法兰大陆'
  version: '1'
  世界简称: '法兰'
  世界类型: '中古, 冒险, 低魔'
  核心设定: '一个骑士精神与封建领主制度并存的时代，各个王国为了土地和荣誉纷争不断，佣兵和冒险者在大陆上寻找机遇。'
# 地理环境
地理环境:
  世界整体形态: '由多个王国、公国和自由城邦组成的大陆，被广阔的平原、森林和山脉分割。'
  主要地形: '雄鹰山脉隔绝了南北王国，黑森林中潜藏着盗匪与野兽。'
  特殊地域: '自由港“海鸥镇”，是商人和佣兵的聚集地；国王谷，是历代国王的埋骨之地。'
# 种族 / 势力
种族_势力:
  主要势力:
    - 势力一: '雄狮王国：大陆最强的王国，拥有最精锐的骑士团。'
    - 势力二: '白鹿公国：富饶的商业国度，外交手段高明。'
    - 势力三: '佣兵工会：遍布大陆的中立组织，为冒险者提供任务和庇护。'
# 力量体系
力量体系:
  核心力量来源: '精湛的武技和骑士的战斗技巧。魔法是稀有且不被信任的力量，只有少数人掌握。'
  力量等级_分类: '骑士等级分为见习骑士、正式骑士、骑士队长和圣骑士。'
  力量获取方式: '通过在骑士学院接受严酷的训练，或在战场上立下功勋。'
# 社会规则
社会规则:
  法律体系: '封建领主法，领主在其领地内拥有最高权力。国王的法律仅在直属领地有效。'
  道德规范: '骑士八德（谦卑、荣誉、牺牲、英勇、怜悯、诚实、精神、公正）是社会推崇的最高道德标准。'
# 历史背景
历史背景:
  关键历史事件:
    - 事件一: '百年战争：雄狮王国与邻国的长期战争，虽已结束，但留下了深刻的仇恨和影响。'
</world_view>
[end]`,
};


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
        <div className="flex rounded-lg shadow-sm">
            {(['男性', '女性', '其他'] as Gender[]).map(gender => (
                <button
                    key={gender}
                    type="button"
                    onClick={() => onChange(gender)}
                    className={`flex-1 py-2 px-4 text-sm font-medium transition-colors first:rounded-l-lg last:rounded-r-lg focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                        value === gender ? 'bg-pink-500 text-white' : 'bg-white/70 hover:bg-pink-100 text-pink-700'
                    }`}
                >
                    {gender}
                </button>
            ))}
        </div>
    </div>
);


export const CharacterCreation: React.FC<CharacterCreationProps> = ({ onComplete }) => {
    const [player, setPlayer] = useState<Character>({
        name: '一',
        gender: '男性',
        age: getRandomAge(),
        occupation: getRandomItem(OCCUPATIONS),
        traits: `${getRandomItem(TRAITS)}, ${getRandomItem(TRAITS)}`,
    });

    const [partner, setPartner] = useState<Partner>({
        name: '珀',
        gender: '女性',
        age: getRandomAge(),
        occupation: getRandomItem(OCCUPATIONS),
        traits: `${getRandomItem(TRAITS)}, ${getRandomItem(TRAITS)}`,
        personality: getRandomItem(PERSONALITIES),
        appearance: getRandomItem(APPEARANCES),
        imageUrl: getRandomItem(PARTNER_PORTRAITS),
    });
    
    const [relationshipStory, setRelationshipStory] = useState('我们是青梅竹马');
    const [worldview, setWorldview] = useState(WORLDVIEW_TEMPLATES['现代都市']);

    const handlePlayerChange = (field: keyof Character, value: string) => {
        setPlayer(p => ({ ...p, [field]: value }));
    };

    const handlePartnerChange = (field: keyof Partner, value: string) => {
        setPartner(p => ({ ...p, [field]: value }));
    };
    
    const handlePlayerGenderChange = (gender: Gender) => {
        setPlayer(p => ({...p, gender, name: '一'}));
    };
    
     const handlePartnerGenderChange = (gender: Gender) => {
        setPartner(p => {
            let newName = p.name;
            if (gender === '男性' && !MALE_NAMES.includes(p.name)) newName = getRandomItem(MALE_NAMES);
            if (gender === '女性' && !FEMALE_NAMES.includes(p.name)) newName = getRandomItem(FEMALE_NAMES);
            if (gender === '其他' && !OTHER_NAMES.includes(p.name)) newName = getRandomItem(OTHER_NAMES);
            return { ...p, gender, name: newName };
        });
    };

    const handleRandomize = () => {
        const newPlayerGender = getRandomItem(['男性', '女性', '其他']) as Gender;
        const newPartnerGender = getRandomItem(['男性', '女性']) as Gender;

        setPlayer({
            name: '一',
            gender: newPlayerGender,
            age: getRandomAge(),
            occupation: getRandomItem(OCCUPATIONS),
            traits: `${getRandomItem(TRAITS)}, ${getRandomItem(TRAITS)}`,
        });

        setPartner({
            name: newPartnerGender === '男性' ? getRandomItem(MALE_NAMES) : getRandomItem(FEMALE_NAMES),
            gender: newPartnerGender,
            age: getRandomAge(),
            occupation: getRandomItem(OCCUPATIONS),
            traits: `${getRandomItem(TRAITS)}, ${getRandomItem(TRAITS)}`,
            personality: getRandomItem(PERSONALITIES),
            appearance: getRandomItem(APPEARANCES),
            imageUrl: getRandomItem(PARTNER_PORTRAITS),
        });
        
        setRelationshipStory('我们是青梅竹马');
        setWorldview(WORLDVIEW_TEMPLATES['现代都市']);
    };
    
    const handleWorldviewSelect = (key: keyof typeof WORLDVIEW_TEMPLATES) => {
        setWorldview(WORLDVIEW_TEMPLATES[key]);
    };

    const handleSubmit = () => {
        onComplete(player, partner, relationshipStory, worldview);
    };

    return (
        <div className="min-h-screen w-screen bg-pink-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-7xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 animate-fade-in">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-pink-600 mb-6">创建你的恋爱故事</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                    <div className="bg-pink-50/50 p-6 rounded-xl shadow-inner">
                        <h2 className="text-2xl font-semibold text-pink-700 mb-4 text-center">关于你</h2>
                        <InputField label="姓名" value={player.name} onChange={e => handlePlayerChange('name', e.target.value)} />
                        <GenderSelector label="性别" value={player.gender} onChange={handlePlayerGenderChange} />
                        <InputField label="年龄" value={player.age} onChange={e => handlePlayerChange('age', e.target.value)} />
                        <InputField label="职业" value={player.occupation} onChange={e => handlePlayerChange('occupation', e.target.value)} />
                        <InputField label="特征" value={player.traits} onChange={e => handlePlayerChange('traits', e.target.value)} placeholder="如：幽默, 善良" />
                    </div>
                    
                    <div className="bg-rose-50/50 p-6 rounded-xl shadow-inner">
                        <h2 className="text-2xl font-semibold text-rose-700 mb-4 text-center">关于你的伴侣</h2>
                        <InputField label="姓名" value={partner.name} onChange={e => handlePartnerChange('name', e.target.value)} />
                        <GenderSelector label="性别" value={partner.gender} onChange={handlePartnerGenderChange} />
                        <InputField label="年龄" value={partner.age} onChange={e => handlePartnerChange('age', e.target.value)} />
                        <InputField label="职业" value={partner.occupation} onChange={e => handlePartnerChange('occupation', e.target.value)} />
                        <InputField label="特征" value={partner.traits} onChange={e => handlePartnerChange('traits', e.target.value)} placeholder="如：体贴, 有创造力" />
                        <InputField label="性格" value={partner.personality} onChange={e => handlePartnerChange('personality', e.target.value)} />
                        <TextAreaField label="外貌" value={partner.appearance} onChange={e => handlePartnerChange('appearance', e.target.value)} rows={2} />
                        
                        <div className="mt-4">
                            <label className="block text-rose-700 text-sm font-bold mb-2">选择立绘</label>
                            <div className="grid grid-cols-5 gap-2">
                                {PARTNER_PORTRAITS.map(url => (
                                    <button key={url} onClick={() => handlePartnerChange('imageUrl', url)} className={`rounded-lg overflow-hidden border-4 transition-all ${partner.imageUrl === url ? 'border-pink-500 shadow-lg' : 'border-transparent hover:border-pink-300'}`}>
                                        <img src={url} alt="Partner Portrait" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6 bg-purple-50/50 p-6 rounded-xl shadow-inner">
                     <TextAreaField 
                        label="你们的关系背景故事"
                        value={relationshipStory}
                        onChange={e => setRelationshipStory(e.target.value)}
                        placeholder="例如：我们是青梅竹马 / 我们在一次旅行中相遇..."
                     />
                </div>
                
                <div className="mb-8 bg-sky-50/50 p-6 rounded-xl shadow-inner">
                    <h2 className="text-2xl font-semibold text-sky-700 mb-4 text-center">设定世界观</h2>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {(Object.keys(WORLDVIEW_TEMPLATES) as Array<keyof typeof WORLDVIEW_TEMPLATES>).map(key => (
                            <button key={key} onClick={() => handleWorldviewSelect(key)} className="px-4 py-2 bg-white/80 rounded-lg shadow-sm text-sky-800 hover:bg-sky-100 transition-colors font-medium">
                                {key}
                            </button>
                        ))}
                    </div>
                     <TextAreaField 
                        label="世界观详细设定"
                        value={worldview}
                        onChange={e => setWorldview(e.target.value)}
                        placeholder="你可以选择一个预设，或者在这里输入你自己的世界观..."
                        rows={10}
                     />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={handleRandomize}
                        className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        随机生成
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        开启故事
                    </button>
                </div>
            </div>
        </div>
    );
};
