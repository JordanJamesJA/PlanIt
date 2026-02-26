/**
 * Computes completion statistics for an array of tasks.
 */
export function calcStats(tasks = []) {
  const total = tasks.length;
  if (total === 0) {
    return { total: 0, done: 0, inProgress: 0, blocked: 0, todo: 0, review: 0, pct: 0 };
  }

  const done       = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const blocked    = tasks.filter(t => t.status === 'blocked').length;
  const review     = tasks.filter(t => t.status === 'review').length;
  const todo       = tasks.filter(t => t.status === 'todo').length;

  return {
    total,
    done,
    inProgress,
    blocked,
    todo,
    review,
    pct: Math.round((done / total) * 100),
  };
}

/**
 * Filters tasks by search query, status, and priority.
 */
export function filterTasks(tasks = [], { search = '', status = 'all', priority = 'all' } = {}) {
  return tasks.filter(task => {
    if (status   !== 'all' && task.status   !== status)   return false;
    if (priority !== 'all' && task.priority !== priority) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        (task.description ?? '').toLowerCase().includes(q) ||
        (task.assignee ?? '').toLowerCase().includes(q) ||
        (task.tags ?? []).some(tag => tag.toLowerCase().includes(q))
      );
    }
    return true;
  });
}

/**
 * Returns tasks for a specific phase, sorted by priority rank desc.
 */
export function getPhaseTasksSorted(tasks = [], phaseId) {
  const PRIORITY_RANK = { critical: 4, high: 3, medium: 2, low: 1 };
  return tasks
    .filter(t => t.phaseId === phaseId)
    .sort((a, b) => (PRIORITY_RANK[b.priority] ?? 0) - (PRIORITY_RANK[a.priority] ?? 0));
}
