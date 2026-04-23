import { useState, useRef } from 'react';
import { Loader2, CheckCircle, Sparkles, UploadCloud, X } from 'lucide-react';
import { updateMerchantStore } from '../../../../services/merchantService';
import { uploadImage } from '../../../../services/storageService';
import { PLANS_CONFIG, hasPlanAccess } from '../../../../constants/plans';
import { SocialSection } from './SocialSection';

const SWATCHES = [
  '#4f46e5', '#dc2626', '#16a34a', '#d97706',
  '#0891b2', '#7c3aed', '#be185d', '#374151',
];

const THEMES = {
  negocios:  { label: 'Negócios',  desc: 'Sério, limpo, profissional',      nicho: 'Consultoria, escritórios, serviços B2B', preview: '#3b4a6b', plan: 'pro' },
  mercado:   { label: 'Mercado',   desc: 'Preços em destaque, grid direto',  nicho: 'Alimentação, mercearia, varejo',           preview: '#16a34a', plan: 'pro' },
  atelier:   { label: 'Atelier',   desc: 'Elegante, foto-centrado',          nicho: 'Beleza, moda, artesanato',                 preview: '#be185d', plan: 'pro' },
  'dark-tech':{ label: 'Dark Tech', desc: 'Dark + dourado, Liquid Glass',    nicho: 'Tech, eletrônicos, games',                 preview: '#1c1917', plan: 'premium' },
  luxury:    { label: 'Luxury',    desc: 'Minimalista, espaçado, alto padrão', nicho: 'Clínicas, joias, estética premium',      preview: '#0f0f0f', plan: 'premium' },
  vibrante:  { label: 'Vibrante',  desc: 'Cores fortes, CTAs agressivos',   nicho: 'Academia, delivery, eventos',              preview: '#7c3aed', plan: 'premium' },
};

export default function CustomizeTab({ merchant, onUpdate }) {
  const plan = merchant?.plan || 'free';
  const planConfig = PLANS_CONFIG[plan] || PLANS_CONFIG.free;
  const isPremium = hasPlanAccess(plan, 'premium');

  const [color, setColor] = useState(merchant?.store_color || '#4f46e5');
  const [coverUrl, setCoverUrl] = useState(merchant?.store_cover_url || '');
  const [coverFile, setCoverFile] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef(null);
  const [tagline, setTagline] = useState(merchant?.store_tagline || '');
  const [description, setDescription] = useState(merchant?.store_description || '');
  const [badgeText, setBadgeText] = useState(merchant?.store_badge_text || '');
  const [theme, setTheme] = useState(merchant?.store_theme || 'negocios');
  const [storeUrl, setStoreUrl] = useState(merchant?.store_url || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const visibleThemes = Object.entries(THEMES);

  async function handleSave() {
    setSaving(true);
    let finalCoverUrl = coverUrl;
    if (coverFile) {
      try {
        setUploadingCover(true);
        const path = `merchants/${merchant.id}/cover/${Date.now()}.${coverFile.name.split('.').pop()}`;
        finalCoverUrl = await uploadImage('merchant-images', coverFile, path);
        setCoverUrl(finalCoverUrl);
        setCoverFile(null);
      } catch {
        setSaving(false);
        setUploadingCover(false);
        return;
      } finally {
        setUploadingCover(false);
      }
    }
    const ok = await updateMerchantStore(merchant.id, {
      store_color: color,
      store_cover_url: finalCoverUrl || null,
      store_tagline: tagline || null,
      store_description: isPremium ? (description || null) : undefined,
      store_badge_text: isPremium ? (badgeText || null) : undefined,
      store_theme: theme,
      store_url: planConfig.hasStoreUrl ? (storeUrl || null) : undefined,
    });
    setSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      if (onUpdate) onUpdate({ ...merchant, store_color: color, store_cover_url: finalCoverUrl, store_tagline: tagline, store_theme: theme });
    }
  }

  if (!planConfig.hasVitrineStore) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Personalizar Loja</h3>
        <p className="text-sm text-slate-500 mt-0.5">Configure a identidade visual da sua vitrine pública.</p>
      </div>

      {/* PREVIEW */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="h-24 flex items-end px-4 pb-3 relative"
          style={{ background: coverUrl ? `url(${coverUrl}) center/cover` : color }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="relative text-white z-10">
            <p className="font-black text-base">{merchant?.name}</p>
            {tagline && <p className="text-xs text-white/80">{tagline}</p>}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 px-4 py-2">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Prévia do topo da sua loja</p>
        </div>
      </div>

      {/* TEMAS */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tema Visual</label>
        <div className="grid grid-cols-3 gap-2">
          {visibleThemes.map(([key, t]) => {
            const isLocked = !isPremium && t.plan === 'premium';
            return (
              <button key={key} onClick={() => !isLocked && setTheme(key)}
                className={`p-3 rounded-xl border-2 text-left transition-all active:scale-95 duration-150
                  ${theme === key ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'}
                  ${isLocked ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-slate-300'}`}>
                <div className="w-6 h-6 rounded-full mb-1.5" style={{ backgroundColor: t.preview }} />
                <p className="font-bold text-xs text-slate-800 leading-tight">{t.label}</p>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{t.desc}</p>
                {t.plan === 'premium' && (
                  <span className="text-[10px] bg-amber-100 text-amber-600 rounded px-1 mt-1 inline-block">Premium</span>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 italic mt-2">Nicho: {THEMES[theme]?.nicho}</p>
      </div>

      {/* COR */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Cor de Destaque</label>
        <div className="flex gap-2 flex-wrap">
          {SWATCHES.map(sw => (
            <button key={sw} onClick={() => setColor(sw)}
              className={`w-8 h-8 rounded-full transition-all duration-150 ${color === sw ? 'ring-2 ring-offset-2 ring-slate-600 scale-110' : ''}`}
              style={{ backgroundColor: sw }} />
          ))}
          {isPremium && (
            <div className="flex items-center gap-2 mt-1 w-full">
              <label className="text-xs text-slate-500 font-bold">Cor personalizada (Premium):</label>
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0" />
            </div>
          )}
        </div>
      </div>

      {/* CAPA — UPLOAD */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Foto de Capa</label>
        <p className="text-xs text-slate-400 mb-2">Formato ideal: <strong>1200 × 400 px</strong> (proporção 3:1, horizontal). JPG ou PNG, máx. 3 MB.</p>
        {coverUrl || coverFile ? (
          <div className="relative rounded-xl overflow-hidden h-28 bg-gray-100">
            <img
              src={coverFile ? URL.createObjectURL(coverFile) : coverUrl}
              alt="capa"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => { setCoverFile(null); setCoverUrl(''); }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer">
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="w-full h-28 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50 flex flex-col items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer active:scale-[0.98]">
            <UploadCloud size={24} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-500">Clique para enviar a foto de capa</span>
            <span className="text-[10px] text-slate-400">1200×400px · JPG ou PNG · máx. 3MB</span>
          </button>
        )}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 3 * 1024 * 1024) {
              return;
            }
            setCoverFile(file);
          }}
        />
        {uploadingCover && (
          <p className="text-xs text-indigo-500 flex items-center gap-1 mt-1">
            <Loader2 size={12} className="animate-spin" /> Fazendo upload da capa...
          </p>
        )}
      </div>

      {/* TAGLINE */}
      <div>
        <div className="flex justify-between mb-1">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tagline da loja</label>
          <span className="text-xs text-slate-400">{tagline.length}/60</span>
        </div>
        <input type="text" value={tagline} onChange={e => setTagline(e.target.value.slice(0, 60))}
          placeholder="Ex: A melhor padaria do Parque Interlagos"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* LINK EXTERNO */}
      {planConfig.hasStoreUrl && (
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Link da Loja Externa (opcional)</label>
          <input type="url" value={storeUrl} onChange={e => setStoreUrl(e.target.value)} placeholder="https://minhaloja.com.br"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <p className="text-xs text-slate-400 mt-1">Se você tem um site próprio, ele aparecerá como botão 'Ver Loja Completa' na sua vitrine.</p>
        </div>
      )}

      {/* PREMIUM ONLY */}
      {isPremium && (
        <>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-bold text-amber-700">Descrição da Loja <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded ml-1">Premium</span></label>
              <span className="text-xs text-slate-400">{description.length}/200</span>
            </div>
            <textarea value={description} onChange={e => setDescription(e.target.value.slice(0, 200))}
              rows={3} placeholder="Descreva sua loja..."
              className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-700 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-bold text-amber-700">Faixa de Destaque <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded ml-1">Premium</span></label>
              <span className="text-xs text-slate-400">{badgeText.length}/60</span>
            </div>
            <input type="text" value={badgeText} onChange={e => setBadgeText(e.target.value.slice(0, 60))}
              placeholder="Ex: 🔥 20% OFF esta semana!"
              className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-700 text-base focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <p className="text-xs text-slate-400 mt-1">Aparece como banner no topo da sua loja</p>
          </div>
        </>
      )}

      <SocialSection 
        merchant={merchant} 
        onUpdate={onUpdate} 
        isPro={hasPlanAccess(plan, 'pro')} 
        isPremium={isPremium} 
      />

      {/* CARD UPSELL */}
      <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-4">
        <div className="flex items-start gap-3">
          <Sparkles size={20} className="text-indigo-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm text-indigo-900">Quer uma loja 100% sua?</p>
            <p className="text-xs text-indigo-700 mt-1">Desenvolvemos sites e lojas profissionais integrados ao app do bairro. Domínio próprio, catálogo completo e muito mais.</p>
            <button onClick={() => window.open('https://wa.me/5512981260116?text=' + encodeURIComponent('Olá! Vi a opção de loja personalizada no app Tem no Bairro e quero saber mais!'), '_blank')}
              className="text-xs font-bold text-white bg-indigo-600 px-4 py-2 rounded-lg mt-3 hover:bg-indigo-700 transition-colors duration-150 cursor-pointer min-h-[44px] inline-flex items-center active:scale-[0.97]">
              Saber Mais →
            </button>
          </div>
        </div>
      </div>

      {/* SALVAR */}
      <button onClick={handleSave} disabled={saving || saved}
        className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-150 min-h-[44px] cursor-pointer active:scale-[0.97] ${saved ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25'}`}>
        {saving ? <Loader2 size={18} className="animate-spin" /> : saved ? <CheckCircle size={18} /> : null}
        {saving ? 'Salvando...' : saved ? 'Salvo com sucesso!' : 'Salvar Personalização'}
      </button>
    </div>
  );
}
