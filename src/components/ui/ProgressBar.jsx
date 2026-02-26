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
  value    = 0,
  color    = 'var(--accent)',
  height   = 4,
  showLabel = false,
  animated  = true,
  style,
}) {
  const pct = Math.min(100, Math.max(0, value));

  // Colour shifts: 0-30% danger, 31-70% warn, 71-99% accent, 100% success
  const resolvedColor =
    pct === 100 ? 'var(--success)' :
    pct < 30    ? 'var(--danger)'  :
    pct < 70    ? color            : color;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}>
      <div style={{
        flex:         1,
        height,
        background:   'var(--border)',
        borderRadius: height,
        overflow:     'hidden',
      }}>
        <div style={{
          width:      `${pct}%`,
          height:     '100%',
          background: resolvedColor,
          borderRadius: height,
          transition: animated ? 'width 0.5s cubic-bezier(0.4,0,0.2,1)' : 'none',
          boxShadow:  pct > 0 ? `0 0 6px ${resolvedColor}60` : 'none',
        }} />
      </div>

      {showLabel && (
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize:   11,
          color:      resolvedColor,
          minWidth:   28,
          textAlign:  'right',
        }}>
          {pct}%
        </span>
      )}
    </div>
  );
}
