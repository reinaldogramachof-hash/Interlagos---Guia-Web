import React from 'react';
import { 
  ShieldCheck, 
  Shield, 
  ShieldAlert, 
  CheckCircle, 
  Circle, 
  ArrowRight 
} from 'lucide-react';

/**
 * Componente de Checklist e Status de Verificação de Perfil
 * @param {Object} profile - Dados do perfil do usuário (Zustand authStore)
 * @param {Object} merchant - Dados do comerciante (opcional)
 * @param {Object} currentUser - Usuário atual (dados do Firebase/Auth)
 * @param {Function} onNavigate - Callback para navegação interna ('settings')
 */
export default function VerificationCard({ profile, merchant = null, currentUser, onNavigate }) {
  // Configuração do Checklist para Morador
  const baseChecklist = [
    { id: 'email',        label: 'E-mail confirmado',          done: true }, // Auth OTP garante no fluxo atual
    { id: 'name',         label: 'Nome completo preenchido',   done: !!profile?.full_name },
    { id: 'photo',        label: 'Foto de perfil enviada',     done: !!currentUser?.photoURL },
    { id: 'neighborhood', label: 'Bairro selecionado',         done: !!profile?.neighborhood },
    { id: 'phone',        label: 'Telefone cadastrado',        done: !!profile?.phone },
    { id: 'terms',        label: 'Termos LGPD aceitos',        done: !!profile?.terms_accepted_at },
  ];

  // Requisitos extras para Comerciantes
  const merchantChecklist = merchant ? [
    { id: 'business_photo',  label: 'Foto do negócio enviada',    done: !!merchant?.image_url },
    { id: 'whatsapp',        label: 'WhatsApp cadastrado',         done: !!merchant?.whatsapp },
    { id: 'address',         label: 'Endereço preenchido',         done: !!merchant?.address },
    { id: 'hours',           label: 'Horário de funcionamento',    done: !!merchant?.opening_hours },
  ] : [];

  const checklist = [...baseChecklist, ...merchantChecklist];

  // Cálculos de Status
  const completedCount = checklist.filter(r => r.done).length;
  const totalCount = checklist.length;
  const percentage = Math.round((completedCount / totalCount) * 100);
  const isFullyVerified = percentage === 100;

  // Visual Props Baseadas no Progresso
  let statusColor = 'bg-slate-400';
  let Icon = ShieldAlert;
  let statusText = 'Não Verificado';
  let progressColor = 'bg-slate-400';

  if (percentage === 100) {
    statusColor = 'bg-emerald-600';
    Icon = ShieldCheck;
    statusText = 'Perfil Verificado';
    progressColor = 'bg-emerald-500';
  } else if (percentage >= 60) {
    statusColor = 'bg-amber-500';
    Icon = Shield;
    statusText = 'Em Verificação';
    progressColor = 'bg-amber-500';
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Status */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-white text-[11px] font-bold ${statusColor} transition-colors duration-500`}>
          <Icon size={14} />
          {statusText}
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-slate-800 dark:text-white">{percentage}%</span>
          <span className="text-[10px] text-slate-400 block -mt-1 uppercase tracking-wider font-bold">Completo</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${progressColor} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 pt-2">
        {checklist.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            {item.done ? (
              <CheckCircle size={15} className="text-emerald-500 shrink-0" />
            ) : (
              <Circle size={15} className="text-slate-300 dark:text-slate-700 shrink-0" />
            )}
            <span className={`text-[11px] leading-tight ${item.done ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>
              {item.label}
            </span>
            {!item.done && (
              <button 
                onClick={() => onNavigate?.('settings')}
                className="text-[10px] text-indigo-500 hover:text-indigo-600 hover:underline flex items-center gap-0.5 ml-auto font-semibold shrink-0"
              >
                Completar <ArrowRight size={10} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer / Message */}
      {isFullyVerified ? (
        <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/20 rounded-xl p-3 text-center">
          <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
            Parabéns! Seu perfil está 100% completo.
          </p>
        </div>
      ) : (
        <p className="text-[10px] text-slate-400 italic text-center">
          Perfis verificados têm prioridade na busca e maior confiança da comunidade.
        </p>
      )}
    </div>
  );
}
