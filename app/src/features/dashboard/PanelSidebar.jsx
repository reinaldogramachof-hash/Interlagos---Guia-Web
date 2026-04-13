import React, { useState } from 'react';
import { Store, User, LifeBuoy, ChevronLeft, ChevronRight } from 'lucide-react';

function NavButton({ id, label, icon: Icon, colorClass, activeTab, onTabChange, isCollapsed }) {
    const isActive = activeTab === id;
    return (
        <button
            onClick={() => onTabChange(id)}
            className={`p-4 text-left font-bold text-sm flex items-center transition-all duration-300 relative group ${
                isCollapsed ? 'justify-center' : 'gap-3'
            } ${
                isActive
                    ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${colorClass} border-indigo-600`
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 border-l-4 border-transparent'
            }`}
            title={isCollapsed ? label : ''}
        >
            <div className="shrink-0 flex items-center justify-center w-6">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            {!isCollapsed && <span className="truncate animate-in fade-in slide-in-from-left-2 duration-300">{label}</span>}

            {isActive && isCollapsed && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-l-full" />
            )}
        </button>
    );
}

export default function PanelSidebar({
    uiMode,
    activeTab,
    onTabChange
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={`hidden md:flex bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex-col transition-all duration-300 ease-in-out ${
            isCollapsed ? 'w-20' : 'w-64'
        }`}>
            {/* Toggle Button */}
            <div className="flex justify-end p-2 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-white/5">
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
                <div className="py-2">
                    {/* "Meu Negócio" — apenas para comerciantes */}
                    {uiMode === 'merchant' && (
                        <NavButton
                            id="business"
                            label="Meu Negócio"
                            icon={Store}
                            colorClass="text-indigo-600"
                            activeTab={activeTab}
                            onTabChange={onTabChange}
                            isCollapsed={isCollapsed}
                        />
                    )}

                    {/* "Pessoal" — sempre visível */}
                    <NavButton
                        id="personal"
                        label="Pessoal"
                        icon={User}
                        colorClass={uiMode === 'merchant' ? 'text-indigo-600' : 'text-emerald-600'}
                        activeTab={activeTab}
                        onTabChange={onTabChange}
                        isCollapsed={isCollapsed}
                    />
                </div>

                <div className="mt-auto py-2 border-t border-slate-200 dark:border-slate-800">
                    {/* CTA Cadastro — apenas para moradores sem negócio */}
                    {uiMode === 'resident' && !isCollapsed && (
                        <div className="px-3 py-4 animate-in fade-in duration-500">
                            <button
                                onClick={() => onTabChange('merchant-setup')}
                                className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                            >
                                <Store size={14} /> Cadastre sua Loja
                            </button>
                        </div>
                    )}
                    {uiMode === 'resident' && isCollapsed && (
                        <NavButton
                            id="merchant-setup"
                            label="Cadastrar Loja"
                            icon={Store}
                            colorClass="text-indigo-600"
                            activeTab={activeTab}
                            onTabChange={onTabChange}
                            isCollapsed={isCollapsed}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
