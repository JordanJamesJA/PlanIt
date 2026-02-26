import { useState } from 'react';
import { Modal }  from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input }  from '@/components/ui/Input';

/**
 * PhaseModal
 *
 * @prop {object|null} phase      - null = create mode
 * @prop {string}      projectId
 * @prop {(data) => void} onSave
 * @prop {() => void}    onClose
 */
export function PhaseModal({ phase = null, projectId, onSave, onClose }) {
  const isEdit = !!phase;

  const [name,        setName]        = useState(phase?.name        ?? '');
  const [description, setDescription] = useState(phase?.description ?? '');
  const [errors,      setErrors]      = useState({});

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Phase name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave({
      ...(isEdit ? { id: phase.id } : { projectId }),
      name:        name.trim(),
      description: description.trim(),
    });
    onClose();
  }

  return (
    <Modal
      title={isEdit ? 'Edit Phase' : 'New Phase'}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="ghost"   onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {isEdit ? 'Save Changes' : 'Add Phase'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input
          id="phase-name"
          label="Phase Name"
          value={name}
          onChange={e => { setName(e.target.value); setErrors({}); }}
          placeholder="e.g. Design, Backend, QA…"
          error={errors.name}
          autoFocus
        />
        <Input
          id="phase-desc"
          label="Description"
          multiline
          rows={2}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="What does this phase cover? (optional)"
        />
      </div>
    </Modal>
  );
}
