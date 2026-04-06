import { useAuth } from './AuthContext';
import useMerchantPlan from '../../hooks/useMerchantPlan';
import { uploadImage } from '../../services/storageService';
import { updateUserProfile } from '../../services/authService';
import { useToast } from '../../components/Toast';
import ImageUpload from '../../components/ImageUpload';
import useAuthStore from '../../stores/authStore';

function QuickAction({ emoji, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
    >
      <span className="text-xl">{emoji}</span>
      <span className="text-sm font-semibold text-gray-700 flex-1 text-left">{label}</span>
      <span className="text-gray-300 text-xs">›</span>
    </button>
  );
}

export default function ProfileView({ onLoginOpen, onNavigate }) {
  const { currentUser, isMerchant, isAdmin, isMaster, logout } = useAuth();
  const { planId, plan } = useMerchantPlan();
  const showToast = useToast();

  const handleAvatarChange = async (file) => {
    try {
      const ext = file.name.split('.').pop();
      const path = `avatars/${currentUser.uid}/${Date.now()}.${ext}`;
      const url = await uploadImage('avatars', file, path);
      await updateUserProfile(currentUser.uid, { photo_url: url });
      showToast('Foto atualizada!', 'success');
      await useAuthStore.getState().refreshProfile();
    } catch (err) {
      console.error(err);
      showToast('Erro ao carregar perfil.', 'error');
    }
  };

  // ── Visitante (sem login) ──────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <div className="px-4 pt-8 pb-24 flex flex-col items-center gap-5">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-5xl">
          👤
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Bem-vindo!</h2>
          <p className="text-gray-500 text-sm">Faça login para acessar seu perfil e recursos exclusivos.</p>
        </div>

        <button
          onClick={onLoginOpen}
          className="w-full max-w-xs bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
        >
          Entrar / Cadastrar
        </button>

        <div className="w-full max-w-xs bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col gap-1">
          <p className="text-amber-800 font-bold text-sm">🏪 Tem um negócio no bairro?</p>
          <p className="text-amber-700 text-xs">Cadastre seu comércio e alcance milhares de moradores.</p>
          <button
            onClick={() => onNavigate('merchant-landing')}
            className="text-amber-700 font-bold text-xs hover:underline text-left mt-1"
          >
            Ver planos e preços →
          </button>
        </div>
      </div>
    );
  }

  // ── Usuário logado ─────────────────────────────────────────────────────────
  const roleMeta = {
    master: { label: 'Master', emoji: '⚡', color: 'bg-purple-100 text-purple-700' },
    admin: { label: 'Admin', emoji: '🛡️', color: 'bg-blue-100 text-blue-700' },
    merchant: { label: 'Comerciante', emoji: '🏪', color: 'bg-amber-100 text-amber-700' },
    resident: { label: 'Morador', emoji: '🏘️', color: 'bg-green-100 text-green-700' },
  };
  const role = isMaster ? 'master' : isAdmin ? 'admin' : isMerchant ? 'merchant' : 'resident';
  const rmeta = roleMeta[role];

  return (
    <div className="pb-24">
      {/* Banner */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 px-5 pt-10 pb-16 relative">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl" />
      </div>

      <div className="px-4 -mt-12 flex flex-col items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <ImageUpload
            preview={currentUser.photoURL}
            onFileSelect={handleAvatarChange}
            label=""
          />
        </div>

        {/* Nome + Role */}
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900">
            {currentUser.displayName || currentUser.email?.split('@')[0]}
          </h2>
          <p className="text-xs text-gray-400 mb-2">{currentUser.email}</p>
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${rmeta.color}`}>
            {rmeta.emoji} {rmeta.label}
          </span>
        </div>

        {/* Card do Comerciante */}
        {isMerchant && (
          <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mt-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800 text-sm">Plano Atual</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${planId === 'premium' ? 'bg-amber-100 text-amber-700' :
                  planId === 'pro' ? 'bg-emerald-100 text-emerald-700' :
                  planId === 'basic' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                }`}>
                {plan.badge ?? '🔵 Básico'}
              </span>
            </div>
            <button
              onClick={() => onNavigate('merchant-panel')}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
            >
              📊 Abrir Painel do Comerciante
            </button>
            {planId !== 'premium' && (
              <button
                onClick={() => onNavigate('plans')}
                className="w-full mt-2 text-indigo-600 text-sm font-semibold py-2 hover:bg-indigo-50 rounded-xl transition-colors"
              >
                Fazer Upgrade de Plano ↗️
              </button>
            )}
          </div>
        )}

        {/* Card do Admin/Master */}
        {(isAdmin || isMaster) && (
          <div className="w-full mt-1">
            <button
              onClick={() => onNavigate('admin')}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
            >
              🛡️ Painel Administrativo
            </button>
          </div>
        )}

        {/* Ações rápidas */}
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 mt-1">
          <QuickAction emoji="💡" label="Enviar Sugestão" onClick={() => onNavigate('suggestions')} />
          <QuickAction emoji="❤️" label="Doações e Campanhas" onClick={() => onNavigate('donations')} />
          <QuickAction emoji="🆘" label="Utilidade Pública" onClick={() => onNavigate('utility')} />
          {!isMerchant && (
            <QuickAction emoji="🏪" label="Quero anunciar meu comércio" onClick={() => onNavigate('merchant-landing')} />
          )}
        </div>

        {/* Sair */}
        <button
          onClick={async () => { await logout(); }}
          className="mt-2 text-red-500 text-sm font-semibold hover:underline"
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}
