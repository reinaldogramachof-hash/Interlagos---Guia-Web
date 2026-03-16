import { useState } from 'react';
import { MapPin, Search, Menu, User, LayoutDashboard, Store, UserCircle, LogOut, ChevronDown, X, PlusCircle } from 'lucide-react';
import NotificationBell from '../components/NotificationBell';
import { useAuth } from '../context/AuthContext';
import { categories } from '../constants/categories';

export default function AppHeader({
  currentView,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onMenuOpen,
  onLoginOpen,
  onCreateAd,
  onNavigate,
}) {
  const { currentUser, logout, isAdmin, isMaster, isMerchant } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 8);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    onNavigate('merchants');
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden bg-slate-900/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onMenuOpen} className="p-2 -ml-2 text-slate-400 hover:text-white">
            <Menu size={24} />
          </button>
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <MapPin className="text-white" size={20} />
          </div>
          <h1 className="font-bold text-lg text-white">TemNoBairro</h1>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <button
            onClick={() => currentUser ? setUserMenuOpen(!userMenuOpen) : onLoginOpen()}
            className="p-2 hover:bg-white/5 rounded-full transition-colors relative group"
          >
            {currentUser ? (
              currentUser.photoURL
                ? <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-8 h-8 rounded-full border-2 border-indigo-500" />
                : <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">{currentUser.displayName?.[0] || 'U'}</div>
            ) : (
              <User className="text-slate-400 group-hover:text-white transition-colors" size={24} />
            )}
          </button>
        </div>
      </header>

      {/* Desktop Header + Barra de Busca */}
      <div className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 p-4 lg:p-6 mb-6 lg:mb-8 transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 max-w-6xl mx-auto">

          {/* Busca */}
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300" size={20} />
            </div>
            <input
              type="text"
              placeholder="O que você procura hoje?"
              className="w-full bg-slate-800/50 border border-white/5 text-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-slate-800 transition-all duration-300 placeholder:text-slate-500 shadow-sm"
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
            />
          </div>

          {/* Desktop: Ações do usuário */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <NotificationBell />
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 bg-slate-800/50 p-1.5 pr-4 rounded-full border border-white/5 hover:border-white/10 transition-all"
                >
                  {currentUser.photoURL
                    ? <img src={currentUser.photoURL} alt="User" className="w-9 h-9 rounded-full border border-indigo-500/30" />
                    : <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm">{currentUser.displayName?.[0] || 'U'}</div>
                  }
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-slate-400 font-medium">Olá,</span>
                    <span className="text-sm font-bold text-slate-200 leading-none">{currentUser.displayName?.split(' ')[0]}</span>
                  </div>
                  <ChevronDown size={16} className="text-slate-400" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-xl border border-white/10 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                      <div className="p-2 space-y-1">
                        {(isAdmin || isMaster) && (
                          <button onClick={() => { onNavigate('admin'); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
                            <LayoutDashboard size={16} /> Painel Admin
                          </button>
                        )}
                        {isMerchant && (
                          <button onClick={() => { onNavigate('merchant-panel'); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
                            <Store size={16} /> Painel do Comerciante
                          </button>
                        )}
                        <button onClick={() => { onNavigate('resident-panel'); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
                          <UserCircle size={16} /> Minha Conta
                        </button>
                        <div className="h-px bg-white/10 my-1" />
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <LogOut size={16} /> Sair
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginOpen}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-95"
              >
                <User size={20} /> <span>Entrar</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile: Filtro de categorias */}
        <div className="lg:hidden mt-4">
          <div className={`flex flex-wrap gap-2 ${showAllCategories ? '' : 'overflow-x-auto pb-2 scrollbar-hide flex-nowrap'}`}>
            {displayedCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all shrink-0 ${selectedCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'bg-slate-800/50 text-slate-400 border border-white/5'}`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
            {!showAllCategories ? (
              <button onClick={() => setShowAllCategories(true)} className="flex items-center gap-1 px-4 py-2 rounded-full bg-slate-800 text-slate-400 border border-white/5 text-sm font-medium shrink-0">
                <PlusCircle size={16} /> Mais
              </button>
            ) : (
              <button onClick={() => setShowAllCategories(false)} className="flex items-center gap-1 px-4 py-2 rounded-full bg-slate-800 text-slate-400 border border-white/5 text-sm font-medium shrink-0">
                <X size={16} /> Menos
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
