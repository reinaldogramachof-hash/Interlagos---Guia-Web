import { sectionThemes, mobileUi, cx } from '../../theme/mobileDesignTokens';

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
        const Icon = getIcon(item);
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
            {Icon && <Icon size={14} aria-hidden="true" />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
