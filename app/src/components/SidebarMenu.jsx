import { useEffect, useRef } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import {
    X,
    Newspaper,
    Zap,
    History,
    Heart,
    Lightbulb,
    ShieldCheck,
    ShieldAlert,
    LayoutDashboard,
    Store,
    LogIn,
    LogOut,
    MapPin,
    CreditCard,
    Download,
    BarChart2,
    Medal,
    Shield,
    Home,
} from 'lucide-react';
import usePwaInstall from '../hooks/usePwaInstall';
import SidebarMenuSection, { Divider, SectionLabel, MenuItem } from './SidebarMenuSection';

// ─── Seções do menu ───────────────────────────────────────────────────────────
const COMMUNITY_ITEMS = [
    { id: 'utility', label: 'Utilidade Pública', icon: Zap, desc: 'Serviços e emergências' },
    { id: 'polls', label: 'Enquetes', icon: BarChart2, desc: 'Vote e opine no bairro' },
    { id: 'suggestions', label: 'Sugestões', icon: Lightbulb, desc: 'Dê sua opinião' },
    { id: 'history', label: 'História do Bairro', icon: History, desc: 'Conheça Interlagos' },
];

// A seção de negócios (Business/Resident) será gerada dinamicamente dentro do componente
const MEMBERS_ITEMS = [
    { id: 'members-landing', label: 'Seja Membro', icon: Heart, desc: 'Apoie o bairro' },
    { id: 'member-panel', label: 'Meu Plano de Membro', icon: Medal, desc: 'Benefícios e badge', requireAuth: true },
];

const SYSTEM_ITEMS = [
    { id: 'security', label: 'Central de Segurança', icon: ShieldAlert, desc: 'Termos, privacidade e conduta' },
];

// ─── SidebarMenu ──────────────────────────────────────────────────────────────
export default function SidebarMenu({ isOpen, onClose, onNavigate, onLoginOpen }) {
    const { currentUser, isAdmin, isMaster, isMerchant, logout } = useAuth();
    const { canInstall, isInstalled, install } = usePwaInstall();

    const onCloseRef = useRef(onClose);
    useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onCloseRef.current?.(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

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

    // ── Geração do Bloco Evolutivo (Morador VS Comerciante) ──
    const renderEvolutionSection = () => {
        if (!currentUser || !isMerchant) {
            // Morador ou Não Logado (Foco no convite de evolução)
            const residentItems = [
                { id: 'resident-panel', label: 'Meu Painel', icon: Home, desc: 'Seus classificados e histórico', requireAuth: true },
                { id: 'merchant-landing', label: 'Venda no Bairro', icon: Store, desc: 'Evolua para Comerciante e Anuncie' },
            ];
            return <SidebarMenuSection title="Minha Conta" items={residentItems} onNavigate={handleNav} />;
        }

        // Comerciante Ativo (Foco em gerenciamento comercial)
        const merchantItems = [
            { id: 'merchant-panel', label: 'Painel do Proprietário', icon: LayoutDashboard, desc: 'Gerencie sua loja e anúncios', requireAuth: true },
            { id: 'plans', label: 'Planos e Upgrades', icon: CreditCard, desc: 'Básico · Pro · Premium' },
        ];
        return <SidebarMenuSection title="Meu Negócio" items={merchantItems} onNavigate={handleNav} />;
    };

    return (
        <>
            <div
                className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <aside
                className={`fixed top-0 left-0 z-[60] h-full w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Cabeçalho */}
                <div className="bg-gradient-to-br from-brand-600 to-brand-700 px-5 pt-10 pb-6 shrink-0 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-indigo-200" />
                            <span className="text-indigo-100 text-xs font-semibold tracking-widest uppercase">Interlagos Conectado</span>
                        </div>
                        <button onClick={onClose} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><X size={18} /></button>
                    </div>

                    {currentUser ? (
                        <div className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-1 rounded-xl transition-colors" onClick={() => handleNav('profile')}>
                            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg shrink-0">{currentUser.email?.[0]?.toUpperCase() ?? '?'}</div>
                            <div className="min-w-0">
                                <p className="font-semibold text-sm truncate">{currentUser.displayName || currentUser.email}</p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${isMaster ? 'bg-purple-400/30' : isAdmin ? 'bg-blue-400/30' : isMerchant ? 'bg-amber-400/30' : 'bg-white/20'}`}>
                                    {isMaster ? <><Zap size={14} /> Master</> : isAdmin ? <><Shield size={14} /> Admin</> : isMerchant ? <><Store size={14} /> Comerciante</> : <><Home size={14} /> Morador</>}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div onClick={() => { onLoginOpen(); onClose(); }} className="cursor-pointer group">
                            <p className="text-indigo-100 text-sm mb-3">Faça login para acessar recursos exclusivos</p>
                            <div className="flex items-center gap-2 bg-white text-indigo-700 font-bold text-sm px-4 py-2 rounded-xl group-hover:bg-indigo-50 transition-colors inline-flex">
                                <LogIn size={16} /> Entrar / Cadastrar
                            </div>
                        </div>
                    )}
                </div>

                {/* Corpo do menu */}
                <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
                    <SidebarMenuSection title="Comunidade" items={COMMUNITY_ITEMS} onNavigate={handleNav} />
                    <Divider />
                    {renderEvolutionSection()}
                    <Divider />
                    <SidebarMenuSection title="Membros" items={MEMBERS_ITEMS} onNavigate={handleNav} />

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

                    <Divider />
                    <SidebarMenuSection title="Sistema" items={SYSTEM_ITEMS} onNavigate={handleNav} />
                </div>

                {canInstall && !isInstalled && (
                    <div className="px-3 py-2 border-t border-gray-100">
                        <button onClick={() => { install(); onClose(); }} className="w-full flex items-center gap-3 bg-brand-600 hover:bg-brand-700 text-white px-4 py-3 rounded-xl transition-colors text-sm font-bold shadow-md shadow-brand-500/20">
                            <Download size={18} />
                            <div className="text-left"><p className="leading-none">Instalar o App</p><p className="text-indigo-200 text-[10px] font-normal mt-0.5">Use offline, sem abrir o navegador</p></div>
                        </button>
                    </div>
                )}

                {/* Rodapé */}
                <div className="border-t border-gray-100 p-4 shrink-0 flex flex-col gap-2">
                    {/* Link para a landing page / trocar de bairro */}
                    <a
                        href={import.meta.env.VITE_LANDING_URL || '/'}
                        className="w-full flex items-center gap-3 text-brand-500 hover:bg-brand-50 px-3 py-2.5 rounded-xl transition-colors text-sm font-semibold"
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
                            Tem No Bairro © 2026. Todos os direitos reservados.
                        </p>
                    )}
                </div>
            </aside>
        </>
    );
}


