import { Search, X } from 'lucide-react';
import { mobileUi, cx } from '../../theme/mobileDesignTokens';

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Buscar...',
  className = '',
  inputClassName = '',
  autoComplete = 'off',
}) {
  const handleClear = () => {
    if (onClear) {
      onClear();
      return;
    }
    onChange?.('');
  };

  return (
    <div className={cx(mobileUi.search.wrapper, className)}>
      <Search size={16} className={mobileUi.search.icon} aria-hidden="true" />
      <input
        type="search"
        value={value || ''}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cx(mobileUi.search.input, inputClassName)}
      />
      {!!value && (
        <button
          type="button"
          onClick={handleClear}
          className={mobileUi.search.clearButton}
          aria-label="Limpar busca"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
