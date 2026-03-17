import { useMemo, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { invokeAiAssistant, buildSuggestTasksPayload, extractTaskSuggestions } from '@/services/aiService';

export function AiSuggestionsModal({ project, phases, tasks, onApplyTask, onClose }) {
  const [selectedPhaseId, setSelectedPhaseId] = useState(phases[0]?.id ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const selectedPhase = useMemo(
    () => phases.find((phase) => phase.id === selectedPhaseId) ?? phases[0] ?? null,
    [phases, selectedPhaseId],
  );

  async function handleGenerate() {
    if (!selectedPhase) return;

    setLoading(true);
    setError('');

    try {
      const payload = buildSuggestTasksPayload({
        project,
        phases,
        tasks,
        selectedPhaseId: selectedPhase.id,
      });

      const response = await invokeAiAssistant(payload);
      const normalized = extractTaskSuggestions(response);

      if (normalized.length === 0) {
        setError('No suggestions returned. Try adding more project context or retry.');
      }

      setSuggestions(normalized);
    } catch (err) {
      setError(err?.message || 'Unable to generate suggestions right now.');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  function handleApplyAll() {
    if (!selectedPhase || suggestions.length === 0) return;

    suggestions.forEach((task) => {
      onApplyTask({
        phaseId: selectedPhase.id,
        projectId: project.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: 'todo',
      });
    });

    onClose();
  }

  return (
    <Modal
      title="AI Task Suggestions"
      size="lg"
      onClose={onClose}
      footer={(
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button
            variant="secondary"
            onClick={handleGenerate}
            loading={loading}
            disabled={!selectedPhase}
          >
            Generate
          </Button>
          <Button variant="primary" onClick={handleApplyAll} disabled={suggestions.length === 0}>
            Add all
          </Button>
        </>
      )}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}>
          Generate actionable task ideas for a phase using your existing project context.
        </p>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Target phase
          </span>
          <select
            value={selectedPhaseId}
            onChange={(event) => setSelectedPhaseId(event.target.value)}
            style={{
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border-mid)',
              borderRadius: 'var(--r-md)',
              height: 36,
              padding: '0 10px',
              fontSize: 13,
            }}
          >
            {phases.map((phase) => (
              <option key={phase.id} value={phase.id}>{phase.name}</option>
            ))}
          </select>
        </label>

        {error && (
          <div style={{
            border: '1px solid var(--danger)40',
            background: 'var(--danger-dim)',
            borderRadius: 'var(--r-md)',
            padding: '10px 12px',
            fontSize: 12,
            color: 'var(--danger)',
          }}>
            {error}
          </div>
        )}

        {suggestions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {suggestions.map((suggestion, idx) => (
              <div
                key={`${suggestion.title}-${idx}`}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)',
                  background: 'var(--surface)',
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <strong style={{ fontSize: 13, color: 'var(--text)' }}>{suggestion.title}</strong>
                  <span style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase' }}>
                    {suggestion.priority}
                  </span>
                </div>
                {suggestion.description && (
                  <p style={{ marginTop: 6, fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6 }}>
                    {suggestion.description}
                  </p>
                )}
                <div style={{ marginTop: 10 }}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onApplyTask({
                      phaseId: selectedPhase.id,
                      projectId: project.id,
                      title: suggestion.title,
                      description: suggestion.description,
                      priority: suggestion.priority,
                      status: 'todo',
                    })}
                  >
                    Add task
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
