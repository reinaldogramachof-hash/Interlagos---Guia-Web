import { ImageIcon, Store } from 'lucide-react';
import { cx } from '../../theme/mobileDesignTokens';

const categoryColors = {
  Alimentação: 'from-orange-500 to-amber-500',
  Saúde: 'from-emerald-500 to-teal-500',
  Beleza: 'from-pink-500 to-rose-500',
  Serviços: 'from-indigo-500 to-blue-500',
  Educação: 'from-sky-500 to-cyan-500',
  Casa: 'from-lime-500 to-emerald-500',
  Tecnologia: 'from-violet-500 to-indigo-500',
};

function getInitial(text) {
  return (text || '?').trim().charAt(0).toUpperCase();
}

export default function SmartImage({
  src,
  alt = '',
  title,
  category,
  variant = 'cover',
  aspect = 'aspect-[4/3]',
  rounded = 'rounded-2xl',
  className = '',
  imgClassName = '',
  loading = 'lazy',
  icon: Icon,
}) {
  const gradient = categoryColors[category] || 'from-indigo-500 to-slate-700';
  const FallbackIcon = Icon || (variant === 'logo' ? Store : ImageIcon);

  if (src) {
    return (
      <div className={cx('overflow-hidden bg-gray-100', aspect, rounded, className)}>
        <img
          src={src}
          alt={alt || title || ''}
          loading={loading}
          decoding="async"
          className={cx(
            'h-full w-full',
            variant === 'logo' ? 'object-contain p-2' : 'object-cover',
            imgClassName
          )}
        />
      </div>
    );
  }

  return (
    <div className={cx('relative flex items-center justify-center overflow-hidden bg-gradient-to-br text-white', gradient, aspect, rounded, className)}>
      <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-white/15" />
      <div className="absolute -bottom-6 -left-3 h-16 w-16 rounded-full bg-white/10" />
      <div className="relative z-10 flex flex-col items-center gap-1 text-center">
        {title ? (
          <span className="text-2xl font-black leading-none">{getInitial(title)}</span>
        ) : (
          <FallbackIcon size={24} aria-hidden="true" />
        )}
        {category && <span className="max-w-[120px] truncate px-2 text-[10px] font-bold uppercase tracking-wide text-white/85">{category}</span>}
      </div>
    </div>
  );
}
