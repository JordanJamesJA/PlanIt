/**
 * ProgressBar
 *
 * @prop {number} value  - 0 to 100
 * @prop {string} color
 * @prop {number} height - track height in px
 * @prop {boolean} showLabel
 * @prop {boolean} animated
 */
export function ProgressBar({
  value = 0,
  color = 'var(--accent)',
  height = 4,
  showLabel = false,
  animated = true,
  style,
}) {
  const pct = Math.min(100, Math.max(0, value));

  const resolvedColor = pct === 100 ? 'var(--success)' : pct < 30 ? 'var(--danger)' : color;

  return (
    <div className="flex items-center gap-2" style={style}>
      <div
        className="flex-1 overflow-hidden bg-[var(--border)]"
        style={{ height, borderRadius: height }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: resolvedColor,
            borderRadius: height,
            transition: animated ? 'width 0.5s cubic-bezier(0.4,0,0.2,1)' : 'none',
            boxShadow: pct > 0 ? `0 0 6px ${resolvedColor}60` : 'none',
          }}
        />
      </div>

      {showLabel && (
        <span
          className="min-w-7 text-right font-[var(--font-mono)] text-[11px]"
          style={{ color: resolvedColor }}
        >
          {pct}%
        </span>
      )}
    </div>
  );
}
