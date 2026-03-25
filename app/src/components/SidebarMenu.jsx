import { useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import {
    X,
    Newspaper,
    Zap,
    History,
    Heart,
    Lightbulb,
    ShieldCheck,
    LayoutDashboard,
    Store,
    LogIn,
    LogOut,
    MapPin,
    CreditCard,
    User,
    Download,
} from 'lucide-react';
import usePwaInstall from '../hooks/usePwaInstall';
import SidebarMenuSection, { Divider, SectionLabel, MenuItem } from './SidebarMenuSection';

// ─── Seções do menu ───────────────────────────────────────────────────────────
const COMMUNITY_ITEMS = [
    { id: 'utility', label: 'Utilidade Pública', icon: Zap, desc: 'Serviços e emergências' },
    { id: 'history', label: 'História do Bairro', icon: History, desc: 'Conheça Interlagos' },
    { id: 'suggestions', label: 'Sugestões', icon: Lightbulb, desc: 'Dê sua opinião' },
    { id: 'profile', label: 'Meu Perfil', icon: User, desc: 'Informações e configurações', requireAuth: false },
];

const MERCHANT_ITEMS = [
    { id: 'merchant-panel', label: 'Meu Painel', icon: LayoutDashboard, desc: 'Gerencie seu negócio', requireAuth: true },
    { id: 'merchant-landing', label: 'Anunciar meu Negócio', icon: Store, desc: 'Veja nossos planos' },
    { id: 'plans', label: 'Planos e Preços', icon: CreditCard, desc: 'Básico · Pro · Premium' },
];

// ─── SidebarMenu ──────────────────────────────────────────────────────────────
export default function SidebarMenu({ isOpen, onClose, onNavigate, onLoginOpen }) {
    const { currentUser, isAdmin, isMaster, isMerchant, logout } = useAuth();
    const { canInstall, isInstalled, install } = usePwaInstall();

    // Fechar com Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    // Bloqueia scroll do body quando aberto
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleNav = (id, requireAuth) => {
        if (requireAuth && !currentUser) {
            onClose();
            onLoginOpen();
            return;
        }
        onNavigate(id);
        onClose();
    };

    return (
        <>
            {/* ── Overlay escuro ── */}
            <div
                className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* ── Drawer (desliza da esquerda) ── */}
            <aside
                className={`fixed top-0 left-0 z-[60] h-full w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Cabeçalho do Sidebar */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 px-5 pt-10 pb-6 shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-indigo-200" />
                            <span className="text-indigo-100 text-xs font-semibold tracking-widest uppercase">
                                Interlagos Conectado
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Info do usuário */}
                    {currentUser ? (
                        <div 
                            className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-1 rounded-xl transition-colors"
                            onClick={() => handleNav('profile')}
                        >
                            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                {currentUser.email?.[0]?.toUpperCase() ?? '?'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-white font-semibold text-sm truncate">
                                    {currentUser.displayName || currentUser.email}
                                </p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isMaster ? 'bg-purple-400/30 text-purple-100' :
                                        isAdmin ? 'bg-blue-400/30 text-blue-100' :
                                            isMerchant ? 'bg-amber-400/30 text-amber-100' :
                                                'bg-white/20 text-indigo-100'
                                    }`}>
                                    {isMaster ? '⚡ Master' : isAdmin ? '🛡️ Admin' : isMerchant ? '🏪 Comerciante' : '🏘️ Morador'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-indigo-100 text-sm mb-3">Faça login para acessar recursos exclusivos</p>
                            <button
                                onClick={() => { onLoginOpen(); onClose(); }}
                                className="flex items-center gap-2 bg-white text-indigo-700 font-bold text-sm px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors"
                            >
                                <LogIn size={16} />
                                Entrar / Cadastrar
                            </button>
                        </div>
                    )}
                </div>

                {/* Corpo do menu — scrollável */}
                <div className="flex-1 overflow-y-auto py-4">

                    {/* Seção: Comunidade */}
                    <SidebarMenuSection
                        title="Comunidade"
                        items={COMMUNITY_ITEMS}
                        onNavigate={handleNav}
                    />

                    <Divider />

                    {/* Seção: Para Comerciantes */}
                    <SidebarMenuSection
                        title="Para Comerciantes"
                        items={MERCHANT_ITEMS}
                        onNavigate={handleNav}
                    />

                    {/* Seção: Admin — só visível para admin/master */}
                    {(isAdmin || isMaster) && (
                        <>
                            <Divider />
                            <SidebarMenuSection
                                title="Administração"
                                items={[{ id: 'admin', label: 'Painel Administrativo', icon: ShieldCheck, desc: 'Gestão do sistema', requireAuth: true }]}
                                onNavigate={handleNav}
                                accent
                            />
                        </>
                    )}
                </div>

                {/* Instalar App — aparece somente quando disponível e não instalado */}
                {canInstall && !isInstalled && (
                    <>
                        <Divider />
                        <div className="px-3 py-2">
                            <button
                                onClick={() => { install(); onClose(); }}
                                className="w-full flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl transition-colors text-sm font-bold shadow-md shadow-indigo-500/20"
                            >
                                <Download size={18} />
                                <div className="text-left">
                                    <p className="leading-none">Instalar o App</p>
                                    <p className="text-indigo-200 text-[10px] font-normal mt-0.5">Use offline, sem abrir o navegador</p>
                                </div>
                            </button>
                        </div>
                    </>
                )}

                {/* Rodapé */}
                <div className="border-t border-gray-100 p-4 shrink-0 flex flex-col gap-2">
                    {/* Link para a landing page / trocar de bairro */}
                    <a
                        href="https://www.temnobairro.online/"
                        className="w-full flex items-center gap-3 text-indigo-500 hover:bg-indigo-50 px-3 py-2.5 rounded-xl transition-colors text-sm font-semibold"
                    >
                        <MapPin size={18} />
                        Trocar de bairro
                    </a>

                    {currentUser ? (
                        <button
                            onClick={async () => { await logout(); onClose(); }}
                            className="w-full flex items-center gap-3 text-red-500 hover:bg-red-50 px-3 py-2.5 rounded-xl transition-colors text-sm font-semibold"
                        >
                            <LogOut size={18} />
                            Sair da conta
                        </button>
                    ) : (
                        <p className="text-center text-xs text-gray-400">
                            Tem No Bairro © 2025
                        </p>
                    )}
                </div>
            </aside>
        </>
    );
}


