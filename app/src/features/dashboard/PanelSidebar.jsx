import React from 'react';
import { Store, User } from 'lucide-react';

export default function PanelSidebar({ 
    uiMode, 
    activeTab, 
    onTabChange
}) {
    const renderNavItems = () => (
        <div className="flex flex-col h-full">
            {/* "Meu Negócio" — apenas para comerciantes */}
            {uiMode === 'merchant' && (
                <button
                    onClick={() => { onTabChange('business'); }}
                    className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${
                        activeTab === 'business'
                            ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm text-indigo-600 border-indigo-600`
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                >
                    <Store size={18} /> Meu Negócio
                </button>
            )}

            {/* "Pessoal" — sempre visível */}
            <button
                onClick={() => { onTabChange('personal'); }}
                className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${
                    activeTab === 'personal'
                        ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${uiMode === 'merchant' ? 'text-indigo-600 border-indigo-600' : 'text-emerald-600 border-emerald-600'}`
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
            >
                <User size={18} /> Pessoal
            </button>

            {/* CTA Cadastro — apenas para moradores sem negócio */}
            {uiMode === 'resident' && (
                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => { onTabChange('merchant-setup'); }}
                        className={`w-full p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${
                            activeTab === 'merchant-setup'
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 border-l-4 border-indigo-600'
                                : 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10'
                        }`}
                    >
                        <Store size={18} /> Cadastre sua Loja (Grátis)
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="hidden md:flex w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex-col overflow-y-auto">
            {renderNavItems()}
        </div>
    );
}
