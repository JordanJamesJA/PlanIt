import React from 'react';

/**
 * Button
 *
 * @prop {'primary'|'secondary'|'ghost'|'danger'|'outline'} variant
 * @prop {'sm'|'md'|'lg'} size
 * @prop {React.ReactNode} icon - rendered before label
 * @prop {React.ReactNode} iconRight - rendered after label
 * @prop {boolean} loading
 * @prop {boolean} fullWidth
 */
export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  children,
  style,
  className = '',
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      style={{
        ...SIZE_STYLES[size] ?? SIZE_STYLES.md,
        ...VARIANT_STYLES[variant] ?? VARIANT_STYLES.secondary,
        ...(fullWidth ? { width: '100%' } : {}),
        ...(isDisabled ? { opacity: 0.45, cursor: 'not-allowed' } : {}),
        ...style,
      }}
      className={`inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-[var(--r-md)] border-0 font-[var(--font-body)] font-medium tracking-[0.01em] transition-[background,color,box-shadow,opacity] duration-200 ease-[var(--ease)] ${className}`}
    >
      {loading ? (
        <span className="mr-1.5 inline-block animate-spin">◌</span>
      ) : icon ? (
        <span className="flex shrink-0 items-center">{icon}</span>
      ) : null}

      {children && <span>{children}</span>}

      {iconRight && !loading && (
        <span className="flex shrink-0 items-center">{iconRight}</span>
      )}
    </button>
  );
}

const SIZE_STYLES = {
  sm: { fontSize: 12, padding: '4px 10px', height: 28 },
  md: { fontSize: 13, padding: '6px 14px', height: 34 },
  lg: { fontSize: 14, padding: '8px 18px', height: 40 },
};

const VARIANT_STYLES = {
  primary: {
    background: 'var(--accent)',
    color: 'var(--text-inv)',
    boxShadow: '0 0 0 0 transparent',
  },
  secondary: {
    background: 'var(--elevated)',
    color: 'var(--text-2)',
    border: '1px solid var(--border-mid)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-2)',
  },
  danger: {
    background: 'var(--danger-dim)',
    color: 'var(--danger)',
    border: '1px solid var(--danger)30',
  },
  outline: {
    background: 'transparent',
    color: 'var(--accent)',
    border: '1px solid var(--accent)',
  },
};
