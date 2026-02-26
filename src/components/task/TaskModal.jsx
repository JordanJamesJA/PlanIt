import { useState } from 'react';
import { Modal }       from '@/components/ui/Modal';
import { Button }      from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge }       from '@/components/ui/Badge';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/constants/config';

/**
 * TaskModal
 *
 * @prop {object|null} task     - null = create mode
 * @prop {string}      phaseId  - required in create mode
 * @prop {string}      projectId
 * @prop {object[]}    phases   - all phases for this project (for "Move to" dropdown)
 * @prop {(data) => void}  onSave
 * @prop {() => void}      onClose
 * @prop {() => void}      onDelete - only available in edit mode
 */
export function TaskModal({ task = null, phaseId, projectId, phases = [], onSave, onClose, onDelete }) {
  const isEdit = !!task;

  const [title,       setTitle]       = useState(task?.title       ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status,      setStatus]      = useState(task?.status      ?? 'todo');
  const [priority,    setPriority]    = useState(task?.priority    ?? 'medium');
  const [assignee,    setAssignee]    = useState(task?.assignee    ?? '');
  const [dueDate,     setDueDate]     = useState(task?.dueDate     ?? '');
  const [tagInput,    setTagInput]    = useState('');
  const [tags,        setTags]        = useState(task?.tags        ?? []);
  const [refLabel,    setRefLabel]    = useState('');
  const [refUrl,      setRefUrl]      = useState('');
  const [references,  setReferences]  = useState(task?.references  ?? []);
  const [targetPhase, setTargetPhase] = useState(task?.phaseId     ?? phaseId);
  const [errors,      setErrors]      = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  function validate() {
    const e = {};
    if (!title.trim()) e.title = 'Task title is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave({
      ...(isEdit ? { id: task.id } : { projectId, phaseId: targetPhase }),
      title:       title.trim(),
      description: description.trim(),
      status,
      priority,
      assignee:    assignee.trim(),
      dueDate:     dueDate || null,
      tags,
      references,
      // Allow moving to a different phase in edit mode
      ...(isEdit && targetPhase !== task.phaseId ? { phaseId: targetPhase } : {}),
    });
    onClose();
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  }

  function removeTag(t) { setTags(prev => prev.filter(x => x !== t)); }

  function addReference() {
    if (!refLabel.trim() && !refUrl.trim()) return;
    setReferences(prev => [...prev, { label: refLabel.trim(), url: refUrl.trim() }]);
    setRefLabel(''); setRefUrl('');
  }

  function removeReference(i) { setReferences(prev => prev.filter((_, idx) => idx !== i)); }

  const statusOptions   = Object.entries(STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label }));
  const priorityOptions = Object.entries(PRIORITY_CONFIG).map(([v, c]) => ({ value: v, label: c.label }));
  const phaseOptions    = phases.map(p => ({ value: p.id, label: p.name }));

  return (
    <Modal
      title={isEdit ? 'Edit Task' : 'New Task'}
      size="lg"
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            {isEdit && !confirmDelete && (
              <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                Delete Task
              </Button>
            )}
            {confirmDelete && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--danger)' }}>Sure?</span>
                <Button variant="danger"  onClick={() => { onDelete?.(task.id); onClose(); }}>Yes, Delete</Button>
                <Button variant="ghost"   onClick={() => setConfirmDelete(false)}>Cancel</Button>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost"   onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>
              {isEdit ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Title */}
        <Input
          id="task-title"
          label="Title"
          value={title}
          onChange={e => { setTitle(e.target.value); setErrors({}); }}
          placeholder="What needs to be done?"
          error={errors.title}
          autoFocus
        />

        {/* Description */}
        <Input
          id="task-desc"
          label="Description"
          multiline rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Additional context, acceptance criteria, notes…"
        />

        {/* Status + Priority + Phase row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Select
            id="task-status"
            label="Status"
            value={status}
            onChange={e => setStatus(e.target.value)}
            options={statusOptions}
          />
          <Select
            id="task-priority"
            label="Priority"
            value={priority}
            onChange={e => setPriority(e.target.value)}
            options={priorityOptions}
          />
          <Select
            id="task-phase"
            label={isEdit ? 'Move to Phase' : 'Phase'}
            value={targetPhase}
            onChange={e => setTargetPhase(e.target.value)}
            options={phaseOptions}
          />
        </div>

        {/* Assignee + Due Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input
            id="task-assignee"
            label="Assignee"
            value={assignee}
            onChange={e => setAssignee(e.target.value)}
            placeholder="e.g. @alice"
          />
          <Input
            id="task-due"
            label="Due Date"
            type="date"
            value={dueDate ?? ''}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Tags
          </label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            {tags.map(t => (
              <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Badge color="var(--info)" bg="var(--info-dim)" size="md">#{t}</Badge>
                <button onClick={() => removeTag(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 13, padding: 0 }}>×</button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder="Add tag and press Enter"
              style={{
                flex: 1, background: 'var(--surface)', border: '1px solid var(--border-mid)',
                borderRadius: 'var(--r-md)', color: 'var(--text)', fontFamily: 'var(--font-body)',
                fontSize: 13, padding: '7px 10px', outline: 'none',
              }}
            />
            <Button variant="secondary" onClick={addTag} size="sm">Add</Button>
          </div>
        </div>

        {/* References */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            References & Links
          </label>
          {references.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px', background: 'var(--surface)', border: '1px solid var(--border)',
              borderLeft: '3px solid var(--accent)', borderRadius: 'var(--r-md)',
            }}>
              {r.url ? (
                <a href={r.url} target="_blank" rel="noopener noreferrer"
                   style={{ color: 'var(--accent)', fontSize: 12, flex: 1, textDecoration: 'none' }}>
                  {r.label || r.url}
                </a>
              ) : (
                <span style={{ color: 'var(--text-2)', fontSize: 12, flex: 1 }}>{r.label}</span>
              )}
              <button onClick={() => removeReference(i)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 13 }}>×</button>
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8 }}>
            <input
              value={refLabel}
              onChange={e => setRefLabel(e.target.value)}
              placeholder="Label"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-mid)', borderRadius: 'var(--r-md)', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 13, padding: '7px 10px', outline: 'none' }}
            />
            <input
              value={refUrl}
              onChange={e => setRefUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addReference(); } }}
              placeholder="URL (optional)"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-mid)', borderRadius: 'var(--r-md)', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 13, padding: '7px 10px', outline: 'none' }}
            />
            <Button variant="secondary" onClick={addReference} size="sm">Add</Button>
          </div>
        </div>

      </div>
    </Modal>
  );
}
