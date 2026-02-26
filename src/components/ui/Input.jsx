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
  rows      = 3,
  prefix,
  suffix,
  value,
  onChange,
  placeholder,
  type      = 'text',
  disabled  = false,
  autoFocus = false,
  style,
  inputStyle,
  id,
  name,
  maxLength,
}) {
  const borderColor = error ? 'var(--danger)' : 'var(--border-mid)';
  const focusColor  = error ? 'var(--danger)' : 'var(--accent)';

  const baseInput = {
    width:      '100%',
    background: 'var(--surface)',
    border:     `1px solid ${borderColor}`,
    borderRadius: 'var(--r-md)',
    color:      'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize:   13,
    padding:    prefix || suffix ? '7px 10px 7px 0' : '7px 10px',
    outline:    'none',
    transition: `border-color var(--ease)`,
    resize:     multiline ? 'vertical' : undefined,
    lineHeight:  1.5,
    ...inputStyle,
  };

  const elem = multiline ? (
    <textarea
      id={id}
      name={name}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      maxLength={maxLength}
      style={baseInput}
      onFocus={e => (e.target.style.borderColor = focusColor)}
      onBlur={e  => (e.target.style.borderColor = borderColor)}
    />
  ) : (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      maxLength={maxLength}
      style={baseInput}
      onFocus={e => (e.target.style.borderColor = focusColor)}
      onBlur={e  => (e.target.style.borderColor = borderColor)}
    />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, ...style }}>
      {label && (
        <label htmlFor={id} style={{
          fontSize: 12, fontWeight: 500,
          color: 'var(--text-2)', letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          {label}
        </label>
      )}

      {prefix || suffix ? (
        <div style={{
          display: 'flex', alignItems: 'center',
          background: 'var(--surface)',
          border: `1px solid ${borderColor}`,
          borderRadius: 'var(--r-md)',
          overflow: 'hidden',
        }}>
          {prefix && (
            <span style={{ padding: '0 10px', color: 'var(--text-3)', flexShrink: 0 }}>
              {prefix}
            </span>
          )}
          {React.cloneElement(elem, {
            style: { ...baseInput, border: 'none', borderRadius: 0, flex: 1 },
          })}
          {suffix && (
            <span style={{ padding: '0 10px', color: 'var(--text-3)', flexShrink: 0 }}>
              {suffix}
            </span>
          )}
        </div>
      ) : elem}

      {hint && !error && (
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{hint}</span>
      )}
      {error && (
        <span style={{ fontSize: 11, color: 'var(--danger)' }}>{error}</span>
      )}
    </div>
  );
}

// ─── SELECT ───────────────────────────────────────────────────────────────────

/**
 * Native <select> wrapper, styled to match Input.
 */
export function Select({ label, value, onChange, options = [], style, id, disabled }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, ...style }}>
      {label && (
        <label htmlFor={id} style={{
          fontSize: 12, fontWeight: 500,
          color: 'var(--text-2)', letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          background:   'var(--surface)',
          border:       '1px solid var(--border-mid)',
          borderRadius: 'var(--r-md)',
          color:        'var(--text)',
          fontFamily:   'var(--font-body)',
          fontSize:     13,
          padding:      '7px 10px',
          outline:      'none',
          cursor:       'pointer',
          appearance:   'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%239090a8'/%3E%3C/svg%3E")`,
          backgroundRepeat:   'no-repeat',
          backgroundPosition: 'right 10px center',
          paddingRight:       28,
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// Need React for cloneElement
import React from 'react';
