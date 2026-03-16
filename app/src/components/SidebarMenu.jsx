import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
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
    ChevronRight,
    MapPin,
    CreditCard,
    User,
} from 'lucide-react';

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
                    <SectionLabel label="Comunidade" />
                    {COMMUNITY_ITEMS.map((item) => (
                        <MenuItem
                            key={item.id}
                            item={item}
                            onClick={() => handleNav(item.id, item.requireAuth)}
                        />
                    ))}

                    <Divider />

                    {/* Seção: Para Comerciantes */}
                    <SectionLabel label="Para Comerciantes" />
                    {MERCHANT_ITEMS.map((item) => (
                        <MenuItem
                            key={item.id}
                            item={item}
                            onClick={() => handleNav(item.id, item.requireAuth)}
                        />
                    ))}

                    {/* Seção: Admin — só visível para admin/master */}
                    {(isAdmin || isMaster) && (
                        <>
                            <Divider />
                            <SectionLabel label="Administração" />
                            <MenuItem
                                item={{ id: 'admin', label: 'Painel Administrativo', icon: ShieldCheck, desc: 'Gestão do sistema' }}
                                onClick={() => handleNav('admin', true)}
                                accent
                            />
                        </>
                    )}
                </div>

                {/* Rodapé */}
                <div className="border-t border-gray-100 p-4 shrink-0">
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
                            Interlagos Conectado © 2025
                        </p>
                    )}
                </div>
            </aside>
        </>
    );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────
function SectionLabel({ label }) {
    return (
        <p className="px-5 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {label}
        </p>
    );
}

function Divider() {
    return <div className="my-3 mx-5 border-t border-gray-100" />;
}

function MenuItem({ item, onClick, accent = false }) {
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
