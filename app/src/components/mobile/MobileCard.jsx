import { mobileUi, cx } from '../../theme/mobileDesignTokens';

export default function MobileCard({
  as: Component = 'div',
  children,
  onClick,
  className = '',
  bodyClassName = '',
  padded = true,
  pressable,
  ...props
}) {
  const isPressable = pressable ?? Boolean(onClick);

  return (
    <Component
      onClick={onClick}
      className={cx(
        mobileUi.card.base,
        isPressable && mobileUi.card.interactive,
        isPressable && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {padded ? (
        <div className={cx(mobileUi.card.body, bodyClassName)}>{children}</div>
      ) : children}
    </Component>
  );
}
