import React from 'react';

/**
 * Input / Textarea
 *
 * @prop {string} label
 * @prop {string} hint   - helper text below input
 * @prop {string} error  - error message (highlights red)
 * @prop {boolean} multiline - renders <textarea>
 * @prop {number} rows
 * @prop {React.ReactNode} prefix - rendered inside input on left
 * @prop {React.ReactNode} suffix - rendered inside input on right
 */
export function Input({
  label,
  hint,
  error,
  multiline = false,
  rows = 3,
  prefix,
  suffix,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  autoFocus = false,
  style,
  inputStyle,
  id,
  name,
  maxLength,
}) {
  const borderColor = error ? 'var(--danger)' : 'var(--border-mid)';
  const focusColor = error ? 'var(--danger)' : 'var(--accent)';

  const baseInput = {
    width: '100%',
    background: 'var(--surface)',
    border: `1px solid ${borderColor}`,
    borderRadius: 'var(--r-md)',
    color: 'var(--text)',
    fontSize: 13,
    padding: prefix || suffix ? '7px 10px 7px 0' : '7px 10px',
    outline: 'none',
    transition: 'border-color var(--ease)',
    resize: multiline ? 'vertical' : undefined,
    lineHeight: 1.5,
    ...inputStyle,
  };

  const sharedProps = {
    id,
    name,
    value,
    onChange,
    placeholder,
    disabled,
    autoFocus,
    maxLength,
    style: baseInput,
    className: 'font-[var(--font-body)]',
    onFocus: e => (e.target.style.borderColor = focusColor),
    onBlur: e => (e.target.style.borderColor = borderColor),
  };

  const elem = multiline ? (
    <textarea {...sharedProps} rows={rows} />
  ) : (
    <input {...sharedProps} type={type} />
  );

  return (
    <div className="flex flex-col gap-[5px]" style={style}>
      {label && (
        <label
          htmlFor={id}
          className="text-[12px] font-medium uppercase tracking-[0.04em] text-[var(--text-2)]"
        >
          {label}
        </label>
      )}

      {prefix || suffix ? (
        <div
          className="flex items-center overflow-hidden rounded-[var(--r-md)] bg-[var(--surface)]"
          style={{ border: `1px solid ${borderColor}` }}
        >
          {prefix && <span className="shrink-0 px-[10px] text-[var(--text-3)]">{prefix}</span>}
          {React.cloneElement(elem, {
            style: { ...baseInput, border: 'none', borderRadius: 0, flex: 1 },
          })}
          {suffix && <span className="shrink-0 px-[10px] text-[var(--text-3)]">{suffix}</span>}
        </div>
      ) : elem}

      {hint && !error && <span className="text-[11px] text-[var(--text-3)]">{hint}</span>}
      {error && <span className="text-[11px] text-[var(--danger)]">{error}</span>}
    </div>
  );
}

/**
 * Native <select> wrapper, styled to match Input.
 */
export function Select({ label, value, onChange, options = [], style, id, disabled }) {
  return (
    <div className="flex flex-col gap-[5px]" style={style}>
      {label && (
        <label
          htmlFor={id}
          className="text-[12px] font-medium uppercase tracking-[0.04em] text-[var(--text-2)]"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="cursor-pointer appearance-none rounded-[var(--r-md)] border border-[var(--border-mid)] bg-[var(--surface)] bg-no-repeat pr-7 font-[var(--font-body)] text-[13px] text-[var(--text)] outline-none"
        style={{
          padding: '7px 10px',
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'%3E%3Cpath d=\'M0 0l5 6 5-6z\' fill=\'%239090a8\'/%3E%3C/svg%3E")',
          backgroundPosition: 'right 10px center',
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
