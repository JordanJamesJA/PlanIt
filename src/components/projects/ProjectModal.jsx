import { useState } from 'react';
import { Modal }  from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input }  from '@/components/ui/Input';
import { PROJECT_COLORS, PROJECT_TEMPLATES } from '@/constants/config';

/**
 * ProjectModal
 *
 * @prop {object|null} project  - null = create mode, object = edit mode
 * @prop {(data: object) => void} onSave
 * @prop {() => void} onClose
 */
export function ProjectModal({ project = null, onSave, onClose }) {
  const isEdit = !!project;

  const [name,       setName]       = useState(project?.name        ?? '');
  const [description,setDescription]= useState(project?.description ?? '');
  const [emoji,      setEmoji]      = useState(project?.emoji       ?? '⬡');
  const [color,      setColor]      = useState(project?.color       ?? PROJECT_COLORS[0]);
  const [template,   setTemplate]   = useState('blank');
  const [errors,     setErrors]     = useState({});

  const EMOJI_OPTIONS = ['⬡', '⚡', '🌐', '🔬', '🏃', '🎯', '🛠', '🚀', '🌿', '🔥', '💡', '⚙️', '🧩', '📦', '🏆'];

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Project name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const selectedTemplate = PROJECT_TEMPLATES.find(t => t.id === template);
    onSave({
      name:        name.trim(),
      description: description.trim(),
      emoji,
      color,
      phases: isEdit ? undefined : (selectedTemplate?.phases ?? []),
    });
    onClose();
  }

  return (
    <Modal
      title={isEdit ? 'Edit Project' : 'New Project'}
      onClose={onClose}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {isEdit ? 'Save Changes' : 'Create Project'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Emoji + Name row */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          {/* Emoji picker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Icon
            </label>
            <div style={{
              width: 44, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--overlay)', border: '1px solid var(--border-mid)',
              borderRadius: 'var(--r-md)', fontSize: 20, cursor: 'pointer',
              position: 'relative',
            }}
              title="Click to pick an emoji"
              onClick={() => {
                const next = EMOJI_OPTIONS[(EMOJI_OPTIONS.indexOf(emoji) + 1) % EMOJI_OPTIONS.length];
                setEmoji(next);
              }}
            >
              {emoji}
            </div>
          </div>

          <Input
            id="proj-name"
            label="Project Name"
            value={name}
            onChange={e => { setName(e.target.value); setErrors({}); }}
            placeholder="e.g. Hackathon 2025"
            error={errors.name}
            autoFocus
            style={{ flex: 1 }}
          />
        </div>

        {/* Description */}
        <Input
          id="proj-desc"
          label="Description"
          multiline
          rows={2}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Short description of the project (optional)"
        />

        {/* Colour */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Colour
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PROJECT_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: c,
                  border: color === c ? `3px solid var(--text)` : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'transform var(--ease-spring)',
                  transform: color === c ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Template — only in create mode */}
        {!isEdit && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Template
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {PROJECT_TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  style={{
                    background:   template === t.id ? 'var(--accent-dim)' : 'var(--surface)',
                    border:       `1px solid ${template === t.id ? 'var(--accent)' : 'var(--border-mid)'}`,
                    borderRadius: 'var(--r-md)',
                    padding:      '10px 12px',
                    cursor:       'pointer',
                    textAlign:    'left',
                    transition:   'all var(--ease)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 16 }}>{t.emoji}</span>
                    <span style={{ fontWeight: 600, fontSize: 13, color: template === t.id ? 'var(--accent)' : 'var(--text)' }}>
                      {t.label}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.4 }}>
                    {t.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
