import { MessageCircle } from 'lucide-react';
import { cleanWhatsapp } from '../../../utils/whatsapp';

export default function StoreStickyCTA({ merchant }) {
  if (!merchant?.whatsapp) return null;
  const href = `https://wa.me/${cleanWhatsapp(merchant.whatsapp)}?text=${encodeURIComponent(
    `Olá! Vi sua loja "${merchant.name}" no app Tem no Bairro e gostaria de mais informações!`
  )}`;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 pb-4 bg-white/90 backdrop-blur-md border-t border-gray-100">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-14 rounded-2xl font-bold text-white flex items-center justify-center gap-3 text-sm shadow-lg bg-emerald-500 hover:bg-emerald-600 active:scale-[0.97] transition-all duration-150 cursor-pointer"
      >
        <MessageCircle size={22} />
        Falar com {merchant.name}
      </a>
    </div>
  );
}
