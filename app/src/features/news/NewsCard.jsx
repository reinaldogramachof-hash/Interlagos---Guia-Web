import { useState } from 'react';
import { Heart, MessageCircle, Share2, Newspaper, PenLine } from 'lucide-react';

const CATEGORY_COLORS = {
    Urgente: 'bg-red-100 text-red-700',
    Eventos: 'bg-purple-100 text-purple-700',
    Saúde: 'bg-green-100 text-green-700',
    Trânsito: 'bg-orange-100 text-orange-700',
    Urbanismo: 'bg-blue-100 text-blue-700',
    default: 'bg-brand-50 text-brand-600',
};

// Avatar colorido gerado por inicial
function AuthorAvatar({ name }) {
    const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-sky-500', 'bg-violet-500'];
    const idx = (name?.charCodeAt(0) ?? 0) % colors.length;
    return (
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${colors[idx]}`}>
            {name?.[0]?.toUpperCase() ?? 'IC'}
        </div>
    );
}

// Tempo relativo legível
function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'agora';
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

// Estado local de likes (sem backend — prova de conceito)
function useLocalLike(id) {
    const key = `like_${id}`;
    const [liked, setLiked] = useState(() => !!localStorage.getItem(key));
    const toggle = () => {
        setLiked(v => {
            const next = !v;
            next ? localStorage.setItem(key, '1') : localStorage.removeItem(key);
            return next;
        });
    };
    return [liked, toggle];
}

// Card de notícia individual
export default function NewsCard({ item, onClick, onCommentClick, commentCount }) {
    const [liked, toggleLike] = useLocalLike(item.id);
    const catColor = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.default;
    const author = item.author ?? item.author_name ?? 'Interlagos Conectado';
    const imgSrc = item.image_url ?? item.image;

    const handleShare = (e) => {
        e.stopPropagation();
        const text = `*${item.title}*\n\n${item.summary || item.content || ''}\n\n📍 Parque Interlagos — via App IC`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <article className="bg-white border-b border-gray-100 pb-1 mb-1 cursor-pointer" onClick={onClick}>
            {/* ── Cabeçalho ── */}
            <div className="flex items-center gap-2.5 px-4 pt-4 pb-2">
                <AuthorAvatar name={author} />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{author}</p>
                    <p className="text-xs text-gray-400">{timeAgo(item.date || item.created_at)}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catColor}`}>
                        {item.category}
                    </span>
                    {item.author_name
                        ? <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full ml-auto flex items-center gap-1"><Newspaper size={12} /> {item.author_name}</span>
                        : <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full ml-auto flex items-center gap-1"><PenLine size={12} /> Redação</span>
                    }
                </div>
            </div>

            {/* ── Título + resumo ── */}
            <div className="px-4 pb-2">
                <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug">{item.title}</h3>
                {(item.summary || item.content) && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {item.summary || item.content}
                    </p>
                )}
            </div>

            {/* ── Imagem edge-to-edge ── */}
            {imgSrc && (
                <div className="w-full overflow-hidden">
                    <img
                        src={imgSrc}
                        alt={item.title}
                        className="w-full object-cover max-h-56"
                        loading="lazy"
                    />
                </div>
            )}

            {/* ── Rodapé de ações ── */}
            <div className="flex items-center gap-1 px-3 pt-2">
                {/* Curtir */}
                <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(); }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-colors ${liked ? 'text-rose-600 bg-rose-50' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
                    Curtir
                </button>

                {/* Comentar */}
                <button
                    onClick={(e) => { e.stopPropagation(); (onCommentClick ?? onClick)?.(); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    <MessageCircle size={15} />
                    {commentCount > 0 ? `${commentCount} Comentários` : 'Comentar'}
                </button>

                {/* Compartilhar WhatsApp */}
                <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-gray-500 hover:bg-green-50 hover:text-green-600 transition-colors ml-auto"
                >
                    <Share2 size={15} />
                    Compartilhar
                </button>
            </div>
        </article>
    );
}
