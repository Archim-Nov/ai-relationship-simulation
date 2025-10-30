import React, { useState, useMemo } from 'react';

interface StatusPanelProps {
    statusText: string;
}

interface Item {
    label: string;
    value: string;
}

interface Section {
    title: string;
    items: Item[];
}

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const ChevronIcon = ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
    );

    return (
        <div className="bg-white/80 rounded-lg shadow-sm mb-3 transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-2 text-left font-semibold text-pink-700 bg-pink-100/70 rounded-t-lg hover:bg-pink-200/70 transition-colors"
            >
                <span>{title}</span>
                <ChevronIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className="overflow-hidden transition-all duration-500 ease-in-out"
                style={{ maxHeight: isOpen ? '1000px' : '0' }}
            >
                <div className="p-3">
                    {children}
                </div>
            </div>
        </div>
    );
};


export const StatusPanel: React.FC<StatusPanelProps> = ({ statusText }) => {

    const sections = useMemo<Section[]>(() => {
        const parsedSections: Section[] = [];
        const regex = /┌─(.+?)─+┐\n([\s\S]*?)└─+┘/g;
        let match;
        while ((match = regex.exec(statusText)) !== null) {
            const title = match[1].trim();
            const content = match[2]
                .trim()
                .split('\n')
                .map(line => line.replace(/^│\s?/, ''))
                .filter(line => line.trim() !== '');
            
            const items: Item[] = content.map(line => {
                const separatorIndex = line.indexOf(':');
                if (separatorIndex === -1) {
                    return { label: '', value: line.trim() };
                }
                const label = line.substring(0, separatorIndex).trim();
                const value = line.substring(separatorIndex + 1).trim();
                return { label, value };
            });

            if (items.length > 0) {
                 parsedSections.push({ title, items });
            }
        }
        return parsedSections;
    }, [statusText]);

    if (sections.length === 0) {
        return (
             <div className="h-full w-full flex items-center justify-center bg-white/60 rounded-xl shadow-inner p-4 text-gray-500 font-mono">
                正在加载状态...
            </div>
        )
    }

    return (
        <div className="h-full w-full">
            {sections.map((section, index) => (
                <CollapsibleSection key={index} title={section.title} defaultOpen={true}>
                    {section.items.map((item, itemIndex) => (
                         <div key={itemIndex} className="bg-white/90 p-2 rounded-md mb-2 last:mb-0 border border-pink-100 shadow-sm">
                            <p className="font-semibold text-pink-600 text-xs mb-1">{item.label}</p>
                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{item.value}</p>
                        </div>
                    ))}
                </CollapsibleSection>
            ))}
        </div>
    );
};