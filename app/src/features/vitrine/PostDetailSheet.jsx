import { useState, useEffect } from 'react';
import { ShoppingBag, Wrench, Megaphone, Tag, Crown, MessageCircle, ArrowLeft, Share2 } from 'lucide-react';
import { cleanWhatsapp } from '../../utils/whatsapp';

const TYPE_BADGE = {
  product: { label: 'Produto', cls: 'bg-blue-100 text-blue-700' },
  service: { label: 'Serviço', cls: 'bg-amber-100 text-amber-700' },
  news:    { label: 'Novidade', cls: 'bg-emerald-100 text-emerald-700' },
  promo:   { label: 'Promoção', cls: 'bg-indigo-100 text-indigo-700' },
};

const TYPE_ICON = {
  product: ShoppingBag,
  service: Wrench,
  news:    Megaphone,
  promo:   Tag,
};

export default function PostDetailSheet({ post, merchant, storeColor, _theme, onClose }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setActive(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const badge = TYPE_BADGE[post.type] ?? TYPE_BADGE.product;
  const Icon = TYPE_ICON[post.type] ?? ShoppingBag;
  const waNumber = cleanWhatsapp(merchant.whatsapp || '');
  const waMsg = encodeURIComponent(`Olá! Vi "${post.title}" na vitrine do bairro e tenho interesse!`);

  function handleClose() {
    setActive(false);
    setTimeout(onClose, 300);
  }

  return (
    <>
      {/* BACKDROP */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* SHEET CONTAINER */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto transform transition-transform duration-300 ease-out ${active ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* HANDLE BAR */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-0" />

        {/* IMAGEM DO PRODUTO */}
        <div className="w-full relative">
          {post.image_url ? (
            <img src={post.image_url} alt={post.title} className="w-full aspect-square object-cover" />
          ) : (
            <div 
              className="w-full aspect-square flex items-center justify-center"
              style={{ backgroundColor: `${storeColor}12` }}
            >
              <Icon size={48} style={{ color: storeColor }} />
            </div>
          )}
        </div>

        {/* CORPO */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>
              {badge.label}
            </span>
            {merchant.plan === 'premium' && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                <Crown size={10} /> Premium
              </span>
            )}
          </div>

          <h2 className="font-black text-xl text-gray-900 mt-2 leading-tight">
            {post.title}
          </h2>

          <div className="mt-2">
            {post.price != null ? (
              <p>
                <span className="font-black text-2xl" style={{ color: storeColor }}>
                  R$ {Number(post.price).toLocaleString('pt-BR')}
                </span>
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">Consultar preço</p>
            )}
          </div>

          <hr className="border-gray-100 my-3" />

          {post.description && (
            <p className="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-line">
              {post.description}
            </p>
          )}
        </div>

        {/* AÇÕES */}
        <div className="px-5 pb-8 pt-2 flex flex-col gap-3">
          {merchant.whatsapp && (
            <a 
              href={`https://wa.me/${waNumber}?text=${waMsg}`}
              target="_blank" rel="noopener noreferrer"
              className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base flex items-center justify-center gap-3 shadow-lg active:scale-[0.97] transition-all"
            >
              <MessageCircle size={22} /> Tenho interesse
            </a>
          )}
          <button
            onClick={() => {
              const text = `Confira "${post.title}" na loja ${merchant.name} no Tem no Bairro!`;
              if (navigator.share) {
                navigator.share({ title: post.title, text }).catch(() => {});
              } else {
                navigator.clipboard?.writeText(text);
              }
            }}
            className="w-full h-11 rounded-xl bg-gray-100 font-bold text-sm text-gray-700 flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
          >
            <Share2 size={16} /> Compartilhar
          </button>
          <button 
            onClick={handleClose}
            className="w-full h-11 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2"
            style={{ color: storeColor, borderColor: storeColor }}
          >
            <ArrowLeft size={16} /> Voltar à loja
          </button>
        </div>
      </div>
    </>
  );
}
