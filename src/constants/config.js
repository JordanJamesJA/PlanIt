// ─── STATUS ───────────────────────────────────────────────────────────────────
export const STATUS_CONFIG = {
  todo: {
    label: 'To Do',
    color: 'var(--s-todo)',
    bg: '#4a4a6018',
    icon: '○',
    order: 0,
  },
  'in-progress': {
    label: 'In Progress',
    color: 'var(--s-progress)',
    bg: 'var(--accent-dim)',
    icon: '◉',
    order: 1,
  },
  review: {
    label: 'Review',
    color: 'var(--s-review)',
    bg: '#a78bfa18',
    icon: '◑',
    order: 2,
  },
  done: {
    label: 'Done',
    color: 'var(--s-done)',
    bg: 'var(--success-dim)',
    icon: '●',
    order: 3,
  },
  blocked: {
    label: 'Blocked',
    color: 'var(--s-blocked)',
    bg: 'var(--danger-dim)',
    icon: '✕',
    order: 4,
  },
};

// ─── PRIORITY ─────────────────────────────────────────────────────────────────
export const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: 'var(--p-critical)', bg: 'var(--danger-dim)',  rank: 4 },
  high:     { label: 'High',     color: 'var(--p-high)',     bg: 'var(--warn-dim)',    rank: 3 },
  medium:   { label: 'Medium',   color: 'var(--p-medium)',   bg: 'var(--accent-dim)', rank: 2 },
  low:      { label: 'Low',      color: 'var(--p-low)',      bg: 'var(--info-dim)',   rank: 1 },
};

// ─── PROJECT COLOURS ──────────────────────────────────────────────────────────
export const PROJECT_COLORS = [
  '#f5a623', // amber
  '#3ecf8e', // green
  '#7eb8f7', // blue
  '#a78bfa', // violet
  '#f46b6b', // red
  '#fb923c', // orange
  '#34d4c8', // teal
  '#f472b6', // pink
];

// ─── TEMPLATES ────────────────────────────────────────────────────────────────
export const PROJECT_TEMPLATES = [
  {
    id: 'hackathon',
    label: 'Hackathon',
    emoji: '⚡',
    description: '24–48 hr sprint with ideation through submission',
    phases: [
      { name: 'Ideation', description: 'Brainstorm, validate, and lock the idea' },
      { name: 'Design',   description: 'Wireframes, flows, and visual design' },
      { name: 'Build',    description: 'Frontend, backend, and integration' },
      { name: 'Polish',   description: 'Bug fixes, QA, and final touches' },
      { name: 'Launch',   description: 'Demo prep, presentation, and submission' },
    ],
  },
  {
    id: 'web-app',
    label: 'Web App',
    emoji: '🌐',
    description: 'Full-stack product from design to deployment',
    phases: [
      { name: 'Discovery',   description: 'Requirements, research, planning' },
      { name: 'Design',      description: 'UI/UX, design system, prototyping' },
      { name: 'Frontend',    description: 'Components, pages, interactions' },
      { name: 'Backend',     description: 'API, database, auth, services' },
      { name: 'Testing',     description: 'Unit, integration, e2e tests' },
      { name: 'Deployment',  description: 'CI/CD, infra, monitoring, launch' },
    ],
  },
  {
    id: 'sprint',
    label: 'Sprint',
    emoji: '🏃',
    description: 'Agile 2-week sprint cycle',
    phases: [
      { name: 'Backlog',    description: 'Items to be picked up' },
      { name: 'This Sprint', description: 'Committed sprint work' },
      { name: 'In Review',  description: 'Awaiting review or QA' },
      { name: 'Done',       description: 'Completed this sprint' },
    ],
  },
  {
    id: 'research',
    label: 'Research',
    emoji: '🔬',
    description: 'Academic or product research project',
    phases: [
      { name: 'Literature',   description: 'Reading and synthesis' },
      { name: 'Planning',     description: 'Methodology and design' },
      { name: 'Experiments',  description: 'Data collection and testing' },
      { name: 'Analysis',     description: 'Data processing and insights' },
      { name: 'Writing',      description: 'Drafting and publication' },
    ],
  },
  {
    id: 'blank',
    label: 'Blank',
    emoji: '✦',
    description: 'Start from scratch',
    phases: [],
  },
];

// ─── STORAGE KEY ──────────────────────────────────────────────────────────────
export const STORAGE_KEY = 'planit-app-v1';
