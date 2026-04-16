import { useState, useEffect } from 'react';
import { Sparkles, ImageIcon } from 'lucide-react';
import { getNeighborhoodPosts } from '../../services/merchantPostsService';

const TYPE_BADGE = {
  product: { label: 'Produto', cls: 'bg-blue-100 text-blue-700' },
  service: { label: 'Serviço', cls: 'bg-amber-100 text-amber-700' },
  news: { label: 'Novidade', cls: 'bg-emerald-100 text-emerald-700' },
  promo: { label: 'Promoção', cls: 'bg-indigo-100 text-indigo-700' },
};

function PostCard({ post, onMerchantClick }) {
  const badge = TYPE_BADGE[post.type] ?? TYPE_BADGE.product;
  return (
    <div
      className="w-36 flex-shrink-0 cursor-pointer"
      onClick={() => onMerchantClick({
        id: post.merchant_id,
        name: post.merchants?.name,
        plan: post.merchants?.plan,
        image_url: post.merchants?.image_url,
        category: post.merchants?.category,
      })}
    >
      <div className="relative">
        {post.image_url ? (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-36 h-36 rounded-xl object-cover bg-gray-100"
            loading="lazy"
          />
        ) : (
          <div className="w-36 h-36 rounded-xl bg-gray-100 flex items-center justify-center">
            <ImageIcon size={28} className="text-gray-300" />
          </div>
        )}
        <span className={`absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${badge.cls}`}>
          {badge.label}
        </span>
      </div>
      <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight mt-1.5">{post.title}</p>
      {post.price != null && (
        <p className="text-xs font-bold text-emerald-600 mt-0.5">
          R$ {Number(post.price).toLocaleString('pt-BR')}
        </p>
      )}
      <p className="text-[10px] text-gray-400 mt-1 truncate">{post.merchants?.name}</p>
    </div>
  );
}

export default function NeighborhoodFeed({ onMerchantClick }) {
  const neighborhood = import.meta.env.VITE_NEIGHBORHOOD;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNeighborhoodPosts(neighborhood, 12).then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, [neighborhood]);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="px-3 pt-4 pb-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
          <Sparkles size={14} className="text-indigo-500" /> O que há de novo
        </h2>
        <span className="text-xs text-gray-400">{posts.length} publicações</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-36 h-36 bg-gray-100 rounded-xl animate-pulse flex-shrink-0" />
            ))
          : posts.map(post => (
              <PostCard key={post.id} post={post} onMerchantClick={onMerchantClick} />
            ))}
      </div>
    </section>
  );
}
