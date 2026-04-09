import { useAuth } from '../features/auth/AuthContext';
import { Menu, Download } from 'lucide-react';
import usePwaInstall from '../hooks/usePwaInstall';
import NotificationBell from './NotificationBell';

export default function AppHeader({ currentView, onLoginOpen, onSidebarOpen }) {
  const { currentUser } = useAuth();
  const { canInstall, install } = usePwaInstall();

  const titles = {
    news: 'Jornal do Bairro',
    merchants: 'Comércios',
    ads: 'Classificados',
    profile: 'Meu Perfil',
    utility: 'Utilidade Pública',
    history: 'Historia do Bairro',
    donations: 'Doações e Campanhas',
    suggestions: 'Sugestões',
    plans: 'Planos e Preços',
    'merchant-landing': 'Para Comerciantes',
    coupons: 'Cupons & Ofertas',
  };
  const title = titles[currentView] || 'Interlagos Conectado';

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* Banner de instalação PWA — aparece só quando disponível */}
      {canInstall && (
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2 flex items-center justify-between gap-3">
          <p className="text-white text-xs font-medium leading-tight">
            Instale o app e use offline, sem abrir o navegador
          </p>
          <button
            onClick={install}
            className="flex-shrink-0 flex items-center gap-1.5 bg-white text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Download size={13} />
            Instalar
          </button>
        </div>
      )}
      <div className="flex items-center justify-between px-4 h-14 gap-2">

        {/* Esquerda */}
        <button
          onClick={onSidebarOpen}
          className="flex-shrink-0 p-2.5 -ml-1 rounded-xl text-gray-500 hover:bg-gray-100 transition-all active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>

        {/* Centro — flex-1 com min-w-0 para truncar se necessário */}
        <div className="flex items-center gap-2 flex-1 justify-center min-w-0">
          <h1 className="text-base font-black text-gray-900 tracking-tight truncate">
            {title}
          </h1>
        </div>

        {/* Direita — largura flexível para acomodar botões dinamicamente */}
        <div className="flex-shrink-0 flex items-center justify-end min-w-[44px]">
          {!currentUser ? (
            <button
              onClick={onLoginOpen}
              className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-pill hover:bg-brand-100 transition-colors whitespace-nowrap"
            >
              Entrar
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <NotificationBell />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
