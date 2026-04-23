import { useState } from 'react';
import { escalateItem } from '../../services/adminService';
import { useAuth } from '../auth/AuthContext';
import { Shield, Database, CheckCircle, Trophy, Bell, Heart, User, FileText, ClipboardList, X, Lock, Lightbulb, BarChart2, Phone, MessageSquare } from 'lucide-react';
import { useToast } from '../../components/Toast';

import ApprovalsTab  from './tabs/ApprovalsTab';
import MerchantsTab  from './tabs/MerchantsTab';
import NewsTab       from './tabs/NewsTab';
import CampaignsTab  from './tabs/CampaignsTab';
import SuggestionsTab from './tabs/SuggestionsTab';
import PollsTab      from './tabs/PollsTab';
import UtilitiesTab  from './tabs/UtilitiesTab';
import UsersTab      from './tabs/UsersTab';
import TicketsTab    from './tabs/TicketsTab';
import AuditTab      from './tabs/AuditTab';
import DatabaseTab   from './tabs/DatabaseTab';
import EscalationDialog from './EscalationDialog';
import ReviewsTab     from './tabs/ReviewsTab';

const NAV_ITEMS = [
  { id: 'approvals',   label: 'Aprovações',       icon: CheckCircle,   masterOnly: false },
  { id: 'merchants',   label: 'Comércios',         icon: Trophy,        masterOnly: false },
  { id: 'news',        label: 'Notícias',          icon: Bell,          masterOnly: false },
  { id: 'campaigns',   label: 'Campanhas',         icon: Heart,         masterOnly: false },
  { id: 'reviews',     label: 'Avaliações',        icon: MessageSquare, masterOnly: false },
  { id: 'suggestions', label: 'Sugestões',         icon: Lightbulb,     masterOnly: false },
  { id: 'polls',       label: 'Enquetes',           icon: BarChart2,     masterOnly: false },
  { id: 'utilities',   label: 'Utilidade Pública', icon: Phone,         masterOnly: false },
];

const MASTER_NAV_ITEMS = [
  { id: 'tickets',  label: 'Torre de Controle', icon: FileText,     badge: true },
  { id: 'users',    label: 'Usuários do Sistema',icon: User,        badge: false },
  { id: 'audit',    label: 'Auditoria e Logs',  icon: ClipboardList,badge: false },
  { id: 'database', label: 'Banco de Dados',    icon: Database,     badge: false },
];

export default function AdminPanel({ onClose }) {
  const { currentUser, isMaster, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('approvals');
  const [pendingCount, setPendingCount] = useState(0);
  const [ticketsCount, setTicketsCount] = useState(0);
  const showToast = useToast();

  // Escalation state (gerenciado aqui pois o dialog flutua sobre o shell)
  const [escalationTarget, setEscalationTarget] = useState(null);
  const [escalationReason, setEscalationReason] = useState('');
  const [escalationLoading, setEscalationLoading] = useState(false);

  if (!currentUser || (!isMaster && !isAdmin)) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <Shield size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
        <p className="text-gray-500 mb-6">Você não tem permissão de Administrador.</p>
        <button onClick={onClose} className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors">Voltar</button>
      </div>
    );
  }

  const handleEscalate = async () => {
    if (!escalationReason.trim()) return showToast('Por favor, informe o motivo.', 'warning');
    setEscalationLoading(true);
    try {
      await escalateItem({
        type: 'escalation',
        target_id: escalationTarget.id,
        target_collection: escalationTarget.collection,
        subject: escalationTarget.title,
        status: 'open',
        body: escalationReason,
        author_id: currentUser.id,
        resolved_by: currentUser.email,
      }, escalationTarget.collection, escalationTarget.id);

      showToast('Item escalado com sucesso para a Torre de Controle!', 'success');
      setEscalationTarget(null);
    } catch (error) {
      showToast('Erro ao escalar: ' + error.message, 'error');
    } finally {
      setEscalationLoading(false);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'approvals': return <ApprovalsTab onEscalate={(col, id, title) => { setEscalationTarget({ id, collection: col, title }); setEscalationReason(''); }} onCountChange={setPendingCount} />;
      case 'merchants': return <MerchantsTab />;
      case 'news':      return <NewsTab />;
      case 'campaigns': return <CampaignsTab />;
      case 'reviews':   return <ReviewsTab />;
      case 'suggestions': return <SuggestionsTab />;
      case 'polls':       return <PollsTab />;
      case 'utilities':   return <UtilitiesTab />;
      case 'users':
      case 'tickets':
      case 'audit':
      case 'database': {
        if (!isMaster) {
          return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
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
      default:          return null;
    }
  };

  return (
    <div className="flex-1 animate-in fade-in">
      <div className="bg-white w-full min-h-[calc(100vh-160px)] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="text-emerald-400" /> Painel Administrativo
            </h2>
            <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
              {isMaster ? (
                <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-xs font-bold border border-purple-500/30 flex items-center gap-1">
                  <Database size={12} /> MASTER — Acesso Total
                </span>
              ) : (
                <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs font-bold border border-blue-500/30 flex items-center gap-1">
                  <Lock size={12} /> ADMIN — Acesso Limitado
                </span>
              )}
            </p>
          </div>
          <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><X size={24} /></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar nav */}
          <nav className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col py-6 gap-1 overflow-y-auto shrink-0">
            <div className="px-6 mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operação Diária</h3>
            </div>
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)} className={`mx-3 px-3 py-2.5 rounded-lg text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Icon size={18} /> {label}
                {id === 'approvals' && pendingCount > 0 && (
                  <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-auto">{pendingCount}</span>
                )}
              </button>
            ))}

            {isMaster && (
              <>
                <div className="my-4 mx-6 border-t border-slate-200" />
                <div className="px-6 mb-2">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    <Shield size={12} /> Governança Master
                  </h3>
                </div>
                {MASTER_NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setActiveTab(id)} className={`mx-3 px-3 py-2.5 rounded-lg text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                    <Icon size={18} /> {label}
                    {id === 'tickets' && ticketsCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-auto">{ticketsCount}</span>
                    )}
                  </button>
                ))}
              </>
            )}
          </nav>

          {/* Conteúdo da tab ativa */}
          <div className="flex-1 bg-white overflow-y-auto p-6">
            {renderTab()}
          </div>
        </div>
      </div>

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
