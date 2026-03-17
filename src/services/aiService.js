import { supabase } from '@/lib/supabaseClient';

const AI_FUNCTION = 'ai-assistant';
const ALLOWED_PRIORITIES = new Set(['low', 'medium', 'high', 'critical']);

export async function invokeAiAssistant(payload) {
  const { data, error } = await supabase.functions.invoke(AI_FUNCTION, { body: payload });

  if (error) {
    throw new Error(error.message || 'Failed to call AI assistant');
  }

  return data;
}

export function buildSuggestTasksPayload({ project, phases, tasks, selectedPhaseId, maxSuggestions = 6 }) {
  const selectedPhase = phases.find((phase) => phase.id === selectedPhaseId) ?? null;

  if (!project || !selectedPhase) {
    throw new Error('Missing project or phase context for AI suggestions.');
  }

  return {
    intent: 'suggest_tasks',
    project: {
      id: project.id,
      name: project.name,
      description: project.description ?? '',
    },
    phase: {
      id: selectedPhase.id,
      name: selectedPhase.name,
      description: selectedPhase.description ?? '',
    },
    tasks: tasks.slice(0, 200).map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      phaseId: task.phaseId,
    })),
    options: {
      maxSuggestions,
      temperature: 0.4,
    },
  };
}

export function extractTaskSuggestions(response) {
  const raw = response?.output?.tasks;
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => ({
      title: typeof item?.title === 'string' ? item.title.trim() : '',
      description: typeof item?.description === 'string' ? item.description.trim() : '',
      priority: normalizePriority(item?.priority),
    }))
    .filter((item) => item.title.length > 0)
    .slice(0, 10);
}

function normalizePriority(priority) {
  if (typeof priority !== 'string') return 'medium';
  const value = priority.toLowerCase().trim();
  return ALLOWED_PRIORITIES.has(value) ? value : 'medium';
}
