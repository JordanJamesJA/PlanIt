/**
 * Generates a short, collision-resistant unique ID.
 * No external dependency — prefix makes IDs human-readable in debuggers.
 */
export function generateId(prefix = '') {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 7);
  return prefix ? `${prefix}_${ts}${rand}` : `${ts}${rand}`;
}
