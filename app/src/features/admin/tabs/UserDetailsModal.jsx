import { Calendar, CheckCircle2, Clock, IdCard, Mail, MapPin, Phone, Shield, X } from 'lucide-react';

function formatDate(value) {
  if (!value) return 'Nao informado';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
        <Icon size={14} /> {label}
      </div>
      <div className="mt-1 break-words text-sm font-semibold text-slate-800">{value || 'Nao informado'}</div>
    </div>
  );
}

export default function UserDetailsModal({ user, termsAcceptedAt, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4"
      onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Detalhes do usuário"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between bg-slate-900 p-4 lg:p-5 text-white gap-3 sticky top-0">
          <div className="flex items-center gap-3">
            {user.photo_url
              ? <img src={user.photo_url} alt={`Foto de ${user.display_name || user.email}`} className="h-12 w-12 rounded-full object-cover flex-shrink-0" />
              : <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg font-black flex-shrink-0">{user.display_name?.[0]?.toUpperCase() ?? '?'}</div>
            }
            <div className="min-w-0">
              <h4 className="text-base lg:text-lg font-bold truncate">{user.display_name || user.full_name || 'Sem Nome'}</h4>
              <p className="text-xs text-slate-300 truncate">{user.email || user.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 hover:bg-white/20 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fechar detalhes do usuário"
          >
            <X size={20} />
          </button>
        </div>

        {/* Details Grid — Responsivo */}
        <div className="grid gap-3 p-4 lg:p-5 grid-cols-1 md:grid-cols-2">
          <DetailItem icon={Mail} label="E-mail" value={user.email} />
          <DetailItem icon={Shield} label="Funcao" value={user.role || 'resident'} />
          <DetailItem icon={IdCard} label="ID Auth" value={user.id} />
          <DetailItem icon={MapPin} label="Bairro" value={user.neighborhood} />
          <DetailItem icon={Phone} label="Telefone" value={user.phone} />
          <DetailItem icon={CheckCircle2} label="E-mail confirmado" value={formatDate(user.email_confirmed_at)} />
          <DetailItem icon={Clock} label="Ultimo login" value={formatDate(user.last_sign_in_at)} />
          <DetailItem icon={Calendar} label="Cadastro auth" value={formatDate(user.auth_created_at || user.profile_created_at)} />
          <DetailItem icon={CheckCircle2} label="Termos" value={termsAcceptedAt ? `Aceito em ${formatDate(termsAcceptedAt)}` : 'Pendente'} />
          <DetailItem icon={CheckCircle2} label="Onboarding" value={user.onboarding_completed ? 'Concluido' : 'Pendente'} />
        </div>
      </div>
    </div>
  );
}
