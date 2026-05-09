import { useState } from 'react';
import { escalateItem } from '../../services/adminService';
import { useAuth } from '../auth/AuthContext';
import {
  Shield,
  Database,
  CheckCircle,
  Trophy,
  Bell,
  Heart,
  User,
  FileText,
  ClipboardList,
  X,
  Lock,
  Lightbulb,
  BarChart2,
  Phone,
  MessageSquare,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useToast } from '../../components/Toast';

import ApprovalsTab from './tabs/ApprovalsTab';
import MerchantsTab from './tabs/MerchantsTab';
import NewsTab from './tabs/NewsTab';
import CampaignsTab from './tabs/CampaignsTab';
import SuggestionsTab from './tabs/SuggestionsTab';
import PollsTab from './tabs/PollsTab';
import UtilitiesTab from './tabs/UtilitiesTab';
import UsersTab from './tabs/UsersTab';
import TicketsTab from './tabs/TicketsTab';
import AuditTab from './tabs/AuditTab';
import DatabaseTab from './tabs/DatabaseTab';
import EscalationDialog from './EscalationDialog';
import ReviewsTab from './tabs/ReviewsTab';

const NAV_ITEMS = [
  { id: 'approvals', label: 'Aprovacoes', icon: CheckCircle },
  { id: 'merchants', label: 'Comercios', icon: Trophy },
  { id: 'news', label: 'Noticias', icon: Bell },
  { id: 'campaigns', label: 'Campanhas', icon: Heart },
  { id: 'reviews', label: 'Avaliacoes', icon: MessageSquare },
  { id: 'suggestions', label: 'Sugestoes', icon: Lightbulb },
  { id: 'polls', label: 'Enquetes', icon: BarChart2 },
  { id: 'utilities', label: 'Utilidade Publica', icon: Phone },
];

const MASTER_NAV_ITEMS = [
  { id: 'tickets', label: 'Torre de Controle', icon: FileText },
  { id: 'users', label: 'Usuarios do Sistema', icon: User },
  { id: 'audit', label: 'Auditoria e Logs', icon: ClipboardList },
  { id: 'database', label: 'Banco de Dados', icon: Database },
];

const ALL_NAV_ITEMS = [...NAV_ITEMS, ...MASTER_NAV_ITEMS];

export default function AdminPanel({ onClose }) {
  const { currentUser, isMaster, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('approvals');
  const [pendingCount, setPendingCount] = useState(0);
  const [ticketsCount, setTicketsCount] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const showToast = useToast();

  const [escalationTarget, setEscalationTarget] = useState(null);
  const [escalationReason, setEscalationReason] = useState('');
  const [escalationLoading, setEscalationLoading] = useState(false);

  if (!currentUser || (!isMaster && !isAdmin)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <Shield size={32} />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Acesso Negado</h2>
        <p className="mb-6 text-gray-500">Voce nao tem permissao de Administrador.</p>
        <button
          onClick={onClose}
          className="rounded-xl bg-gray-900 px-6 py-2 font-bold text-white transition-colors hover:bg-gray-800"
        >
          Voltar
        </button>
      </div>
    );
  }

  const handleEscalate = async () => {
    if (!escalationReason.trim()) {
      return showToast('Por favor, informe o motivo.', 'warning');
    }

    setEscalationLoading(true);
    try {
      await escalateItem(
        {
          type: 'escalation',
          subject: escalationTarget.title,
          status: 'open',
          body: escalationReason,
          author_id: currentUser.id,
        },
        escalationTarget.collection,
        escalationTarget.id,
        { id: currentUser.id, email: currentUser.email }
      );

      showToast('Item escalado com sucesso para a Torre de Controle!', 'success');
      setEscalationTarget(null);
    } catch (error) {
      showToast(`Erro ao escalar: ${error.message}`, 'error');
    } finally {
      setEscalationLoading(false);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'approvals':
        return (
          <ApprovalsTab
            onEscalate={(collection, id, title) => {
              setEscalationTarget({ id, collection, title });
              setEscalationReason('');
            }}
            onCountChange={setPendingCount}
          />
        );
      case 'merchants':
        return <MerchantsTab />;
      case 'news':
        return <NewsTab />;
      case 'campaigns':
        return <CampaignsTab />;
      case 'reviews':
        return <ReviewsTab />;
      case 'suggestions':
        return <SuggestionsTab />;
      case 'polls':
        return <PollsTab />;
      case 'utilities':
        return <UtilitiesTab />;
      case 'users':
      case 'tickets':
      case 'audit':
      case 'database': {
        if (!isMaster) {
          return (
            <div className="flex h-64 flex-col items-center justify-center text-gray-400">
              <Lock size={32} className="mb-3 opacity-40" />
              <p className="text-sm font-medium">Acesso restrito a administradores master</p>
            </div>
          );
        }

        if (activeTab === 'users') return <UsersTab />;
        if (activeTab === 'tickets') return <TicketsTab onCountChange={setTicketsCount} />;
        if (activeTab === 'audit') return <AuditTab />;
        return <DatabaseTab />;
      }
      default:
        return null;
    }
  };

  const activeNavItem = ALL_NAV_ITEMS.find((item) => item.id === activeTab);

  const renderNavButton = ({ id, label, icon: Icon }) => {
    const isActive = activeTab === id;
    const badgeCount = id === 'approvals' ? pendingCount : id === 'tickets' ? ticketsCount : 0;
    const showLabel = !isSidebarCollapsed;

    return (
      <button
        key={id}
        type="button"
        onClick={() => {
          setActiveTab(id);
          setMobileNavOpen(false);
        }}
        title={label}
        className={`group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition-all ${
          isActive
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
            : 'text-slate-600 hover:bg-slate-100'
        } ${isSidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
      >
        <Icon size={18} className="shrink-0" />
        <span className={`${showLabel ? 'inline' : 'lg:hidden'} truncate`}>{label}</span>
        {badgeCount > 0 && (
          <span
            className={`min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-extrabold ${
              isActive ? 'bg-white/20 text-white' : 'bg-emerald-500 text-white'
            } ${showLabel ? 'ml-auto' : 'absolute -right-1 -top-1 lg:right-2 lg:top-2'}`}
          >
            {badgeCount}
          </span>
        )}
      </button>
    );
  };

  const renderSidebarContent = () => (
    <>
      <div className={`flex items-center gap-3 px-4 py-4 ${isSidebarCollapsed ? 'lg:justify-center' : 'justify-between'}`}>
        <div className={`flex min-w-0 items-center gap-3 ${isSidebarCollapsed ? 'lg:justify-center' : ''}`}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            <Shield size={20} className="text-emerald-400" />
          </div>
          <div className={`${isSidebarCollapsed ? 'lg:hidden' : ''} min-w-0`}>
            <p className="truncate text-sm font-black text-slate-900">Painel Admin</p>
            <p className="text-xs text-slate-400">
              {isMaster ? 'Governanca master' : 'Operacao administrativa'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className="hidden rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-100 lg:flex"
          aria-label={isSidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
        >
          {isSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        <section className="space-y-2">
          <div className={`${isSidebarCollapsed ? 'lg:hidden' : ''} px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400`}>
            Operacao Diaria
          </div>
          <div className="space-y-1.5">
            {NAV_ITEMS.map(renderNavButton)}
          </div>
        </section>

        {isMaster && (
          <section className="space-y-2 border-t border-slate-200 pt-5">
            <div className={`${isSidebarCollapsed ? 'lg:hidden' : ''} flex items-center gap-2 px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-400`}>
              <Shield size={12} />
              Governanca Master
            </div>
            <div className="space-y-1.5">
              {MASTER_NAV_ITEMS.map(renderNavButton)}
            </div>
          </section>
        )}
      </div>
    </>
  );

  const renderCompactNavButton = ({ id, label, icon: Icon }) => {
    const isActive = activeTab === id;
    const badgeCount = id === 'approvals' ? pendingCount : id === 'tickets' ? ticketsCount : 0;

    return (
      <button
        key={id}
        type="button"
        onClick={() => setActiveTab(id)}
        className={`relative flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-xs font-bold transition-colors ${
          isActive
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
            : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
        }`}
      >
        <Icon size={14} className="shrink-0" />
        <span className="whitespace-nowrap">{label}</span>
        {badgeCount > 0 && (
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
            isActive ? 'bg-white/20 text-white' : 'bg-emerald-500 text-white'
          }`}>
            {badgeCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="flex-1 animate-in fade-in">
      <div className="flex min-h-[calc(100vh-160px)] w-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="flex shrink-0 flex-col gap-3 bg-slate-900 px-4 py-4 text-white lg:flex-row lg:items-center lg:justify-between lg:px-6 lg:py-5">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="rounded-2xl bg-white/10 p-2.5 transition-colors hover:bg-white/20 lg:hidden"
              aria-label="Abrir menu administrativo"
            >
              <Menu size={18} />
            </button>

            <div>
              <h2 className="flex items-center gap-2 text-base font-bold lg:text-2xl">
                <Shield className="h-5 w-5 text-emerald-400 lg:h-6 lg:w-6" />
                <span className="hidden lg:inline">Painel Administrativo</span>
                <span className="text-sm lg:hidden">Admin</span>
              </h2>

              <p className="mt-2 flex items-center gap-2 text-xs text-slate-400 lg:mt-1 lg:text-sm">
                {isMaster ? (
                  <span className="flex items-center gap-1 whitespace-nowrap rounded border border-purple-500/30 bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 lg:text-xs">
                    <Database size={10} />
                    <span className="hidden lg:inline">MASTER - Acesso Total</span>
                    <span className="lg:hidden">MASTER</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 whitespace-nowrap rounded border border-blue-500/30 bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 lg:text-xs">
                    <Lock size={10} />
                    <span className="hidden lg:inline">ADMIN - Acesso Limitado</span>
                    <span className="lg:hidden">ADMIN</span>
                  </span>
                )}
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-slate-200">
                <span className="opacity-70">Secao ativa</span>
                <span>{activeNavItem?.label || 'Painel'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="self-end rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20 lg:self-auto"
            aria-label="Fechar painel administrativo"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden bg-slate-100/70">
          <aside
            className={`hidden border-r border-slate-200 bg-white transition-all duration-300 lg:flex lg:flex-col ${
              isSidebarCollapsed ? 'lg:w-[88px]' : 'lg:w-[296px]'
            }`}
          >
            {renderSidebarContent()}
          </aside>

          <main className="flex-1 overflow-y-auto p-3 lg:p-5">
            <div className="min-h-full rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:p-6">
              <div className="mb-4 space-y-3 lg:hidden">
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Navegacao</p>
                    <p className="text-sm font-bold text-slate-700">{activeNavItem?.label || 'Painel'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen(true)}
                    className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600"
                    aria-label="Abrir menu completo do painel"
                  >
                    <Menu size={16} />
                  </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {NAV_ITEMS.map(renderCompactNavButton)}
                  {isMaster && MASTER_NAV_ITEMS.map(renderCompactNavButton)}
                </div>
              </div>

              {renderTab()}
            </div>
          </main>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Fechar menu administrativo"
          />

          <aside className="absolute inset-y-0 left-0 flex w-[88vw] max-w-[340px] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
              <div>
                <p className="text-sm font-black text-slate-900">Navegacao Admin</p>
                <p className="text-xs text-slate-400">Acesso rapido as areas do painel</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="rounded-xl border border-slate-200 p-2 text-slate-500"
                aria-label="Fechar menu lateral"
              >
                <X size={16} />
              </button>
            </div>
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      <EscalationDialog
        target={escalationTarget}
        reason={escalationReason}
        onReasonChange={setEscalationReason}
        onConfirm={handleEscalate}
        onClose={() => setEscalationTarget(null)}
        isLoading={escalationLoading}
      />
    </div>
  );
}
