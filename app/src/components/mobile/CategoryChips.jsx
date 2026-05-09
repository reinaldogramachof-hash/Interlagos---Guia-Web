import { cloneElement, isValidElement } from 'react';
import { sectionThemes, mobileUi, cx } from '../../theme/mobileDesignTokens';

function renderChipIcon(icon) {
  if (!icon) return null;

  if (isValidElement(icon)) {
    return cloneElement(icon, {
      size: icon.props?.size ?? 14,
      'aria-hidden': true,
      className: cx('shrink-0', icon.props?.className),
    });
  }

  if (typeof icon === 'function') {
    const Icon = icon;
    return <Icon size={14} className="shrink-0" aria-hidden="true" />;
  }

  if (typeof icon === 'string' || typeof icon === 'number') {
    return <span className="shrink-0" aria-hidden="true">{icon}</span>;
  }

  return null;
}

export default function CategoryChips({
  items = [],
  value,
  onChange,
  section = 'news',
  getId = (item) => item.id ?? item.value ?? item,
  getLabel = (item) => item.label ?? item.name ?? item,
  getIcon = (item) => item.icon,
  className = '',
}) {
  const theme = sectionThemes[section] || sectionThemes.news;

  return (
    <div className={cx(mobileUi.chips.row, className)} role="listbox" aria-label="Filtros">
      {items.map((item) => {
        const id = getId(item);
        const label = getLabel(item);
        const icon = getIcon(item);
        const active = id === value;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange?.(id, item)}
            className={cx(
              mobileUi.chips.item,
              active ? theme.chipActive : mobileUi.chips.inactive
            )}
            aria-pressed={active}
          >
            {renderChipIcon(icon)}
            {label}
          </button>
        );
      })}
    </div>
  );
}
