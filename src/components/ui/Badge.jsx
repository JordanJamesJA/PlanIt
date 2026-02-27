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
  size = 'sm',
  dot = false,
  style,
}) {
  const sizeStyle = size === 'md'
    ? { fontSize: 12, padding: '3px 8px', height: 22 }
    : { fontSize: 11, padding: '2px 7px', height: 19 };

  const resolvedColor = color ?? 'var(--text-2)';
  const resolvedBg = bg ?? 'var(--overlay)';

  return (
    <span
      className="inline-flex items-center gap-1 whitespace-nowrap rounded-[var(--r-sm)] font-[var(--font-mono)] font-medium tracking-[0.02em]"
      style={{
        color: resolvedColor,
        background: resolvedBg,
        ...sizeStyle,
        ...style,
      }}
    >
      {dot && (
        <span
          className="size-[5px] shrink-0 rounded-full"
          style={{ background: resolvedColor }}
        />
      )}
      {children}
    </span>
  );
}
