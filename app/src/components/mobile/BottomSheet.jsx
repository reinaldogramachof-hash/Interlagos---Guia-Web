import { X } from 'lucide-react';
import { cx } from '../../theme/mobileDesignTokens';

export default function BottomSheet({
  open,
  title,
  description,
  children,
  onClose,
  footer,
  className = '',
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-3 pb-safe-bottom" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div className={cx('relative z-10 w-full max-w-shell rounded-t-[28px] bg-white shadow-modal', className)}>
        <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-gray-300" />
        <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-4">
          <div className="min-w-0">
            {title && <h2 className="text-lg font-black tracking-tight text-gray-900">{title}</h2>}
            {description && <p className="mt-1 text-sm leading-5 text-gray-500">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 active:bg-gray-200"
            aria-label="Fechar"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 pb-5">{children}</div>
        {footer && <div className="border-t border-gray-100 px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
