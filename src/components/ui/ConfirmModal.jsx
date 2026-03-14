import { useEffect, useRef } from 'react';
import { Button } from './Button';

/**
 * ConfirmModal — a lightweight destructive-action confirmation dialog.
 *
 * @prop {string}      title
 * @prop {string}      message
 * @prop {string}      confirmLabel   – defaults to "Delete"
 * @prop {() => void}  onConfirm
 * @prop {() => void}  onCancel
 */
export function ConfirmModal({
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}) {
  const overlayRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCancel?.();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  // Focus the confirm button on mount for keyboard accessibility
  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  return (
    <div
      ref={overlayRef}
      onClick={e => {
        if (e.target === overlayRef.current) onCancel?.();
      }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-5 backdrop-blur-[4px] animate-fade-in"
    >
      <div
        className="animate-scale-in flex w-full max-w-[380px] flex-col overflow-hidden rounded-[var(--r-xl)] border border-[var(--border-mid)] bg-[var(--elevated)] shadow-[var(--shadow-lg)]"
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-1">
          <h3 className="font-[var(--font-display)] text-[16px] font-semibold text-[var(--text)]">
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className="px-5 py-3 text-[13px] leading-relaxed text-[var(--text-2)]">
          {message}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-[var(--border)] px-5 py-3.5">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            ref={confirmRef}
            variant="danger"
            size="sm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
