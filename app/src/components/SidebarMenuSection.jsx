import React from 'react';
import { ChevronRight } from 'lucide-react';

export function SectionLabel({ label }) {
    if (!label) return null;
    return (
        <p className="px-5 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {label}
        </p>
    );
}

export function Divider() {
    return <div className="my-3 mx-5 border-t border-gray-100" />;
}

export function MenuItem({ item, onClick, accent = false }) {
    const Icon = item.icon;
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors group`}
        >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${accent ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-500'
                } transition-colors`}>
                <Icon size={18} />
            </div>
            <div className="text-left flex-1 min-w-0">
                <p className={`text-sm font-semibold ${accent ? 'text-indigo-700' : 'text-gray-800'}`}>
                    {item.label}
                </p>
                {item.desc && (
                    <p className="text-[11px] text-gray-400 truncate">{item.desc}</p>
                )}
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400 shrink-0" />
        </button>
    );
}

export default function SidebarMenuSection({ title, items, onNavigate, accent = false }) {
    return (
        <>
            {title && <SectionLabel label={title} />}
            {items.map((item) => (
                <MenuItem
                    key={item.id}
                    item={item}
                    onClick={() => onNavigate(item.id, item.requireAuth)}
                    accent={accent}
                />
            ))}
        </>
    );
}
