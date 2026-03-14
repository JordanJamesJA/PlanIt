import { useState, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { parseJsonToTasks, buildImportPayload } from '@/utils/jsonIngest';
import { useAppStore } from '@/hooks/useAppStore';

export function ImportModal({ onClose }) {
  const { importProject } = useAppStore();
  const [jsonText, setJsonText] = useState('');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  function handleParse() {
    setError(null);
    setPreview(null);

    const result = parseJsonToTasks(jsonText);
    if (result.error) {
      setError(result);
      return;
    }

    const payload = buildImportPayload(result);
    if (payload.error) {
      setError(payload);
      return;
    }

    setPreview(payload);
  }

  function handleImport() {
    if (!preview) return;
    importProject({
      project: preview.project,
      phases: preview.phases,
      tasks: preview.tasks,
    });
    onClose();
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setJsonText(ev.target.result);
      setPreview(null);
      setError(null);
    };
    reader.readAsText(file);
  }

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose}>Cancel</Button>
      {!preview && (
        <Button variant="primary" onClick={handleParse} disabled={!jsonText.trim()}>
          Parse JSON
        </Button>
      )}
      {preview && (
        <Button variant="primary" onClick={handleImport}>
          Import {preview.summary.tasks_detected} Tasks
        </Button>
      )}
    </>
  );

  return (
    <Modal title="Import from JSON" size="lg" onClose={onClose} footer={footer}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Instructions */}
        <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0, lineHeight: 1.6 }}>
          Paste any JSON containing tasks. The importer auto-detects keys like{' '}
          <code style={{ background: 'var(--surface)', padding: '1px 5px', borderRadius: 4, fontSize: 12 }}>task</code>,{' '}
          <code style={{ background: 'var(--surface)', padding: '1px 5px', borderRadius: 4, fontSize: 12 }}>title</code>,{' '}
          <code style={{ background: 'var(--surface)', padding: '1px 5px', borderRadius: 4, fontSize: 12 }}>steps</code>,{' '}
          <code style={{ background: 'var(--surface)', padding: '1px 5px', borderRadius: 4, fontSize: 12 }}>checklist</code>{' '}
          and normalizes statuses, priorities, and dates.
        </p>

        {/* File upload */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <Button
            variant="secondary"
            size="sm"
            icon="+"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload .json file
          </Button>
        </div>

        {/* Textarea */}
        <textarea
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            setPreview(null);
            setError(null);
          }}
          placeholder='{\n  "project": "My Project",\n  "tasks": [\n    { "title": "First task", "status": "todo" },\n    { "title": "Second task", "priority": "high" }\n  ]\n}'
          spellCheck={false}
          style={{
            width: '100%',
            minHeight: 220,
            padding: 12,
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            lineHeight: 1.5,
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border-mid)',
            borderRadius: 'var(--r-md)',
            resize: 'vertical',
            outline: 'none',
          }}
        />

        {/* Error */}
        {error && (
          <div style={{
            padding: '10px 14px',
            background: 'var(--danger-dim)',
            border: '1px solid var(--danger)',
            borderRadius: 'var(--r-md)',
            fontSize: 13,
            color: 'var(--danger)',
          }}>
            <strong>{error.message}</strong>
            {error.details && <p style={{ margin: '4px 0 0', opacity: 0.85, fontSize: 12 }}>{error.details}</p>}
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div style={{
            padding: '12px 14px',
            background: 'var(--surface)',
            border: '1px solid var(--border-mid)',
            borderRadius: 'var(--r-md)',
            fontSize: 13,
          }}>
            <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
              Import Preview
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
              <Stat label="Project" value={preview.project.name} />
              <Stat label="Phases" value={preview.summary.phases_detected} />
              <Stat label="Tasks" value={preview.summary.tasks_detected} />
              {preview.summary.subtasks_detected > 0 && (
                <Stat label="Subtasks" value={preview.summary.subtasks_detected} />
              )}
            </div>

            {/* Phase breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {preview.phases.map((phase) => {
                const phaseTasks = preview.tasks.filter(t => t.phaseId === phase.id);
                return (
                  <div key={phase.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 10px',
                    background: 'var(--elevated)',
                    borderRadius: 'var(--r-sm)',
                    fontSize: 12,
                  }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{phase.name}</span>
                    <span style={{ color: 'var(--text-3)' }}>
                      {phaseTasks.length} task{phaseTasks.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                );
              })}
            </div>

            {preview.summary.ignored_fields.length > 0 && (
              <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-3)' }}>
                Ignored fields: {preview.summary.ignored_fields.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
        {value}
      </span>
    </div>
  );
}
