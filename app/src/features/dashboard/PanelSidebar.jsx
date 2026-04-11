import React from 'react';
import { 
    X, LayoutDashboard, Tag, Store, Settings, 
    BarChart3, Megaphone, User, Heart, Briefcase, Menu, BarChart2, Lightbulb 
} from 'lucide-react';

export default function PanelSidebar({ 
    uiMode, 
    activeTab, 
    onTabChange, 
    isOpen, 
    onClose 
}) {
    const activeSidebarBg = uiMode === 'merchant' 
        ? 'text-indigo-600 border-indigo-600' 
        : 'text-emerald-600 border-emerald-600';

    const renderNavItems = () => (
        <div className="flex flex-col h-full">
            {uiMode === 'merchant' && (
                <button 
                    onClick={() => { onTabChange('dashboard'); onClose?.(); }} 
                    className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'dashboard' ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${activeSidebarBg}` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}
                >
                    <LayoutDashboard size={18} /> Visão Geral
                </button>
            )}

            <button 
                onClick={() => { onTabChange('personal'); onClose?.(); }} 
                className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'personal' ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${activeSidebarBg}` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}
            >
                {uiMode === 'merchant' ? <User size={18} /> : <Briefcase size={18} />} 
                {uiMode === 'merchant' ? 'Aba Pessoal' : 'Meu Conteúdo'}
            </button>

            <button 
                onClick={() => { onTabChange('favorites'); onClose?.(); }} 
                className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'favorites' ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${activeSidebarBg}` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}
            >
                <Heart size={18} /> Favoritos
            </button>

            <button 
                onClick={() => { onTabChange('settings'); onClose?.(); }} 
                className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'settings' ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${activeSidebarBg}` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}
            >
                <Settings size={18} /> Configurações
            </button>

            {uiMode === 'merchant' && (
                <>
                    <button 
                        onClick={() => { onTabChange('ads'); onClose?.(); }} 
                        className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'ads' ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${activeSidebarBg}` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}
                    >
                        <Tag size={18} /> Meus Anúncios PRO
                    </button>
                    <button 
                        onClick={() => { onTabChange('reports'); onClose?.(); }} 
                        className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'reports' ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${activeSidebarBg}` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}
                    >
                        <BarChart3 size={18} /> Relatórios PRO
                    </button>
                    <button 
                        onClick={() => { onTabChange('campaigns'); onClose?.(); }} 
                        className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'campaigns' ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${activeSidebarBg}` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}
                    >
                        <Megaphone size={18} /> Campanhas PRO
                    </button>
                </>
            )}

            {uiMode === 'resident' && (
                <div className="flex flex-col flex-1">
                    <button 
                        onClick={() => { onTabChange('polls'); onClose?.(); }} 
                        className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'polls' ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${activeSidebarBg}` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}
                    >
                        <BarChart2 size={18} /> Enquetes
                    </button>
                    <button 
                        onClick={() => { onTabChange('suggestions'); onClose?.(); }} 
                        className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'suggestions' ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${activeSidebarBg}` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}
                    >
                        <Lightbulb size={18} /> Sugestões
                    </button>

                    <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button 
                            onClick={() => { onTabChange('merchant-setup'); onClose?.(); }} 
                            className={`w-full p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'merchant-setup' ? `bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 border-l-4 border-indigo-600` : 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10'}`}
                        >
                            <Store size={18} /> Cadastre sua Loja (Grátis)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex-col overflow-y-auto">
                {renderNavItems()}
            </div>

            {/* Mobile Drawer */}
            <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/40" onClick={onClose} />
                
                {/* Drawer */}
                <div className={`absolute inset-y-0 left-0 w-64 bg-slate-50 dark:bg-slate-950 shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <span className="font-bold text-slate-900 dark:text-white">Menu</span>
                            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {renderNavItems()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
