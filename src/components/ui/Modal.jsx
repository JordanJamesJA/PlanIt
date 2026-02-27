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
  const width = widths[size] ?? widths.md;

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      onClick={e => {
        if (e.target === overlayRef.current) onClose?.();
      }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-5 backdrop-blur-[4px] animate-fade-in"
    >
      <div
        className="animate-scale-in flex max-h-[calc(100vh-40px)] w-full flex-col overflow-hidden rounded-[var(--r-xl)] border border-[var(--border-mid)] bg-[var(--elevated)] shadow-[var(--shadow-lg)]"
        style={{ maxWidth: width }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h3 className="font-[var(--font-display)] text-[17px] text-[var(--text)]">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-[var(--r-sm)] border-none bg-transparent px-1.5 py-0.5 text-[18px] text-[var(--text-3)] transition-colors duration-200 ease-[var(--ease)] hover:text-[var(--text)]"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {footer && (
          <div className="flex shrink-0 justify-end gap-2 border-t border-[var(--border)] px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
