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
  variant   = 'secondary',
  size      = 'md',
  icon,
  iconRight,
  loading   = false,
  fullWidth = false,
  disabled  = false,
  onClick,
  type      = 'button',
  children,
  style,
  className = '',
}) {
  const styles = getStyles(variant, size, fullWidth, disabled || loading);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ ...styles, ...style }}
      className={className}
    >
      {loading ? (
        <span className="animate-spin" style={{ display: 'inline-block', marginRight: children ? 6 : 0 }}>
          ◌
        </span>
      ) : icon ? (
        <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>
      ) : null}

      {children && <span>{children}</span>}

      {iconRight && !loading && (
        <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{iconRight}</span>
      )}
    </button>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const BASE = {
  display:        'inline-flex',
  alignItems:     'center',
  justifyContent: 'center',
  gap:            6,
  border:         'none',
  borderRadius:   'var(--r-md)',
  cursor:         'pointer',
  fontFamily:     'var(--font-body)',
  fontWeight:     500,
  letterSpacing:  '0.01em',
  transition:     'background var(--ease), color var(--ease), box-shadow var(--ease), opacity var(--ease)',
  whiteSpace:     'nowrap',
  userSelect:     'none',
};

const SIZES = {
  sm: { fontSize: 12, padding: '4px 10px', height: 28 },
  md: { fontSize: 13, padding: '6px 14px', height: 34 },
  lg: { fontSize: 14, padding: '8px 18px', height: 40 },
};

const VARIANTS = {
  primary: {
    background: 'var(--accent)',
    color:      'var(--text-inv)',
    boxShadow:  '0 0 0 0 transparent',
  },
  secondary: {
    background: 'var(--elevated)',
    color:      'var(--text-2)',
    border:     '1px solid var(--border-mid)',
  },
  ghost: {
    background: 'transparent',
    color:      'var(--text-2)',
  },
  danger: {
    background: 'var(--danger-dim)',
    color:      'var(--danger)',
    border:     '1px solid var(--danger)30',
  },
  outline: {
    background: 'transparent',
    color:      'var(--accent)',
    border:     '1px solid var(--accent)',
  },
};

function getStyles(variant, size, fullWidth, isDisabled) {
  return {
    ...BASE,
    ...SIZES[size] ?? SIZES.md,
    ...VARIANTS[variant] ?? VARIANTS.secondary,
    ...(fullWidth ? { width: '100%' } : {}),
    ...(isDisabled ? { opacity: 0.45, cursor: 'not-allowed' } : {}),
  };
}
