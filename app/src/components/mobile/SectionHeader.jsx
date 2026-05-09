import { cx } from '../../theme/mobileDesignTokens';

export default function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  action,
  className = '',
}) {
  return (
    <div className={cx('flex items-end justify-between gap-3 px-4 pb-2 pt-4', className)}>
      <div className="min-w-0">
        <h2 className="mobile-section-title truncate">{title}</h2>
        {subtitle && <p className="mobile-muted-text mt-0.5 truncate">{subtitle}</p>}
      </div>

      {action || (actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-brand-600 active:bg-brand-50"
        >
          {actionLabel}
        </button>
      ) : null)}
    </div>
  );
}
