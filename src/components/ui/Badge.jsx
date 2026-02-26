/**
 * Badge — small inline label with semantic colouring.
 *
 * @prop {'status'|'priority'|'tag'|string} variant
 * @prop {string} color  - overrides default colour
 * @prop {string} bg     - overrides default background
 * @prop {'sm'|'md'} size
 * @prop {React.ReactNode} dot  - renders a leading dot
 */
export function Badge({
  children,
  variant,
  color,
  bg,
  size    = 'sm',
  dot     = false,
  style,
}) {
  const sz = size === 'md'
    ? { fontSize: 12, padding: '3px 8px', height: 22 }
    : { fontSize: 11, padding: '2px 7px', height: 19 };

  const resolvedColor = color ?? 'var(--text-2)';
  const resolvedBg    = bg    ?? 'var(--overlay)';

  return (
    <span style={{
      display:        'inline-flex',
      alignItems:     'center',
      gap:            4,
      borderRadius:   'var(--r-sm)',
      fontFamily:     'var(--font-mono)',
      fontWeight:     500,
      letterSpacing:  '0.02em',
      whiteSpace:     'nowrap',
      color:          resolvedColor,
      background:     resolvedBg,
      ...sz,
      ...style,
    }}>
      {dot && (
        <span style={{
          width: 5, height: 5,
          borderRadius: '50%',
          background: resolvedColor,
          flexShrink: 0,
        }} />
      )}
      {children}
    </span>
  );
}
