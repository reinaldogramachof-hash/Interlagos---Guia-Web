import { useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '../../../../components/Toast';
import { updateMerchantStore } from '../../../../services/merchantService';

export function SocialSection({ merchant, onUpdate, isPro, isPremium }) {
  const showToast = useToast();
  const [socials, setSocials] = useState({
    instagram: merchant?.social_links?.instagram || merchant?.instagram || '',
    facebook: merchant?.social_links?.facebook || '',
    tiktok: merchant?.social_links?.tiktok || '',
    linkedin: merchant?.social_links?.linkedin || '',
    youtube: merchant?.social_links?.youtube || '',
    website: merchant?.social_links?.website || ''
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Se não tem nem pro nem premium, significa que não tem hasSocialLinks
  if (!isPro && !isPremium) {
    return (
      <div className="mt-8 pt-8 border-t border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Redes Sociais
          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">Pro/Premium</span>
        </h3>
        <p className="text-sm text-slate-500 mt-0.5 mb-4">Conecte suas redes para os clientes seguirem.</p>
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 opacity-70">
          <p className="text-sm font-bold text-slate-600">Recurso bloqueado</p>
          <p className="text-xs text-slate-500 mt-1">Faça upgrade para exibir suas redes sociais na vitrine.</p>
        </div>
      </div>
    );
  }

  const handleFieldChange = (field, value) => {
    setSocials(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Limpar campos vazios
    const cleanedSocials = {};
    Object.entries(socials).forEach(([key, val]) => {
      const trimmed = val.trim();
      if (trimmed) {
        cleanedSocials[key] = trimmed;
      }
    });

    try {
      const ok = await updateMerchantStore(merchant.id, {
        social_links: cleanedSocials,
        instagram: cleanedSocials.instagram || null
      });

      if (ok) {
        showToast('Redes sociais salvas!', 'success');
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        if (onUpdate) {
          onUpdate({
            ...merchant,
            social_links: cleanedSocials,
            instagram: cleanedSocials.instagram || null
          });
        }
      } else {
        showToast('Erro ao salvar redes sociais.', 'error');
      }
    } catch (error) {
      showToast('Erro ao salvar redes sociais.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-100">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Redes Sociais</h3>
      <p className="text-sm text-slate-500 mt-0.5 mb-4">Links exibidos na sua vitrine. Deixe em branco os que não possuir.</p>
      
      <div className="space-y-4">
        {/* Instagram e Website disponíveis no Pro e Premium */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Instagram</label>
          <input type="text" value={socials.instagram} onChange={e => handleFieldChange('instagram', e.target.value)}
            placeholder="@suanota"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Website</label>
          <input type="text" value={socials.website} onChange={e => handleFieldChange('website', e.target.value)}
            placeholder="https://seunegocio.com.br"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        {/* Campos adicionais apenas para Premium */}
        {isPremium && (
          <>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex justify-between">
                Facebook
                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded ml-1">Premium</span>
              </label>
              <input type="text" value={socials.facebook} onChange={e => handleFieldChange('facebook', e.target.value)}
                placeholder="Nome da página ou link"
                className="w-full px-4 py-2.5 rounded-xl border border-amber-100 bg-white dark:bg-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-amber-300" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex justify-between">
                TikTok
                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded ml-1">Premium</span>
              </label>
              <input type="text" value={socials.tiktok} onChange={e => handleFieldChange('tiktok', e.target.value)}
                placeholder="@seunegocio"
                className="w-full px-4 py-2.5 rounded-xl border border-amber-100 bg-white dark:bg-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-amber-300" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex justify-between">
                LinkedIn
                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded ml-1">Premium</span>
              </label>
              <input type="text" value={socials.linkedin} onChange={e => handleFieldChange('linkedin', e.target.value)}
                placeholder="Link da company page"
                className="w-full px-4 py-2.5 rounded-xl border border-amber-100 bg-white dark:bg-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-amber-300" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex justify-between">
                YouTube
                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded ml-1">Premium</span>
              </label>
              <input type="text" value={socials.youtube} onChange={e => handleFieldChange('youtube', e.target.value)}
                placeholder="@seucanal ou link"
                className="w-full px-4 py-2.5 rounded-xl border border-amber-100 bg-white dark:bg-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-amber-300" />
            </div>
          </>
        )}
        
        <button onClick={handleSave} disabled={saving || saved}
          className={`w-full mt-4 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-150 min-h-[44px] cursor-pointer active:scale-[0.97] ${saved ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20'}`}>
          {saving ? <Loader2 size={18} className="animate-spin" /> : saved ? <CheckCircle size={18} /> : null}
          {saving ? 'Salvando...' : saved ? 'Salvo com sucesso!' : 'Salvar Redes Sociais'}
        </button>
      </div>
    </div>
  );
}
