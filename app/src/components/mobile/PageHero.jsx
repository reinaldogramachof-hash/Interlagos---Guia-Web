import { sectionThemes, mobileUi, cx } from '../../theme/mobileDesignTokens';

export default function PageHero({
  section = 'news',
  title,
  subtitle,
  icon: Icon,
  imageSrc,
  children,
  compact = false,
  className = '',
}) {
  const theme = sectionThemes[section] || sectionThemes.news;
  const height = compact ? mobileUi.hero.compactHeight : mobileUi.hero.height;

  return (
    <section className={cx('relative overflow-hidden bg-slate-900', height, className)}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          width="800"
          height="180"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800" />
      )}

      <div className={cx('absolute inset-0 bg-gradient-to-r', theme.heroGradient)} />
      <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute right-14 bottom-[-40px] h-24 w-24 rounded-full bg-white/10" />

      <div className={cx('relative z-10 flex h-full items-center justify-between', mobileUi.hero.overlayPadding)}>
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <div className={mobileUi.hero.iconBox}>
              <Icon size={20} className="text-white" aria-hidden="true" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className={mobileUi.hero.title}>{title || theme.label}</h1>
            {subtitle && <p className={mobileUi.hero.subtitle}>{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
