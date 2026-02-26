import { useEffect, useRef } from 'react';

/**
 * Modal
 *
 * @prop {string} title
 * @prop {'sm'|'md'|'lg'|'xl'} size
 * @prop {() => void} onClose
 * @prop {React.ReactNode} footer
 */
export function Modal({ title, size = 'md', onClose, footer, children }) {
  const overlayRef = useRef(null);

  const widths = { sm: 420, md: 560, lg: 700, xl: 900 };
  const width  = widths[size] ?? widths.md;

  // Close on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose?.(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        className="animate-scale-in"
        style={{
          width: '100%', maxWidth: width,
          maxHeight: 'calc(100vh - 40px)',
          display: 'flex', flexDirection: 'column',
          background:   'var(--elevated)',
          border:       '1px solid var(--border-mid)',
          borderRadius: 'var(--r-xl)',
          boxShadow:    'var(--shadow-lg)',
          overflow:     'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17, color: 'var(--text)',
          }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none',
              cursor: 'pointer', color: 'var(--text-3)',
              fontSize: 18, padding: '2px 6px',
              borderRadius: 'var(--r-sm)',
              transition: 'color var(--ease)',
            }}
            onMouseEnter={e => (e.target.style.color = 'var(--text)')}
            onMouseLeave={e => (e.target.style.color = 'var(--text-3)')}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '20px',
        }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'flex-end', gap: 8,
            flexShrink: 0,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
