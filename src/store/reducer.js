import { generateId } from '@/utils/id';

// ─── ACTION TYPES ──────────────────────────────────────────────────────────────
export const Actions = {
  // Hydration
  LOAD_STATE:          'LOAD_STATE',
  SET_ACTIVE_PROJECT:  'SET_ACTIVE_PROJECT',

  // Projects
  CREATE_PROJECT:      'CREATE_PROJECT',
  UPDATE_PROJECT:      'UPDATE_PROJECT',
  DELETE_PROJECT:      'DELETE_PROJECT',

  // Phases
  CREATE_PHASE:        'CREATE_PHASE',
  UPDATE_PHASE:        'UPDATE_PHASE',
  DELETE_PHASE:        'DELETE_PHASE',
  REORDER_PHASES:      'REORDER_PHASES',

  // Tasks
  CREATE_TASK:         'CREATE_TASK',
  UPDATE_TASK:         'UPDATE_TASK',
  DELETE_TASK:         'DELETE_TASK',
  UPDATE_TASK_STATUS:  'UPDATE_TASK_STATUS',
  BULK_UPDATE_STATUS:  'BULK_UPDATE_STATUS',
};

// ─── INITIAL STATE ─────────────────────────────────────────────────────────────
export const initialState = {
  projects:        [],   // Project[]
  phases:          [],   // Phase[]
  tasks:           [],   // Task[]
  activeProjectId: null, // string | null
};

// ─── REDUCER ───────────────────────────────────────────────────────────────────
export function reducer(state, action) {
  switch (action.type) {

    // ── Hydration ──────────────────────────────────────────────────────────── //

    case Actions.LOAD_STATE:
      return { ...initialState, ...action.payload };

    case Actions.SET_ACTIVE_PROJECT:
      return { ...state, activeProjectId: action.payload };

    // ── Projects ───────────────────────────────────────────────────────────── //

    case Actions.CREATE_PROJECT: {
      const { phases: templatePhases = [], ...projectFields } = action.payload;
      const projectId = generateId('proj');
      const now = new Date().toISOString();

      const newProject = {
        ...projectFields,
        id: projectId,
        createdAt: now,
        updatedAt: now,
      };

      // Create template phases automatically
      const newPhases = templatePhases.map((ph, i) => ({
        id: generateId('phase'),
        projectId,
        name: ph.name,
        description: ph.description ?? '',
        order: i,
        createdAt: now,
      }));

      return {
        ...state,
        projects: [...state.projects, newProject],
        phases:   [...state.phases, ...newPhases],
        activeProjectId: projectId,
      };
    }

    case Actions.UPDATE_PROJECT: {
      const { id, ...changes } = action.payload;
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === id ? { ...p, ...changes, updatedAt: new Date().toISOString() } : p
        ),
      };
    }

    case Actions.DELETE_PROJECT: {
      const id = action.payload;
      const phaseIds = state.phases.filter(p => p.projectId === id).map(p => p.id);
      return {
        ...state,
        projects:        state.projects.filter(p => p.id !== id),
        phases:          state.phases.filter(p => p.projectId !== id),
        tasks:           state.tasks.filter(t => !phaseIds.includes(t.phaseId)),
        activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
      };
    }

    // ── Phases ─────────────────────────────────────────────────────────────── //

    case Actions.CREATE_PHASE: {
      const maxOrder = state.phases
        .filter(p => p.projectId === action.payload.projectId)
        .reduce((m, p) => Math.max(m, p.order ?? 0), -1);

      const newPhase = {
        id:          generateId('phase'),
        description: '',
        order:       maxOrder + 1,
        createdAt:   new Date().toISOString(),
        ...action.payload,
      };
      return { ...state, phases: [...state.phases, newPhase] };
    }

    case Actions.UPDATE_PHASE: {
      const { id, ...changes } = action.payload;
      return {
        ...state,
        phases: state.phases.map(p => p.id === id ? { ...p, ...changes } : p),
      };
    }

    case Actions.DELETE_PHASE: {
      const phaseId = action.payload;
      return {
        ...state,
        phases: state.phases.filter(p => p.id !== phaseId),
        tasks:  state.tasks.filter(t => t.phaseId !== phaseId),
      };
    }

    case Actions.REORDER_PHASES: {
      // payload: { projectId, orderedIds: string[] }
      const { orderedIds } = action.payload;
      return {
        ...state,
        phases: state.phases.map(p => {
          const idx = orderedIds.indexOf(p.id);
          return idx !== -1 ? { ...p, order: idx } : p;
        }),
      };
    }

    // ── Tasks ──────────────────────────────────────────────────────────────── //

    case Actions.CREATE_TASK: {
      const now = new Date().toISOString();
      const newTask = {
        status:      'todo',
        priority:    'medium',
        tags:        [],
        assignee:    '',
        dueDate:     null,
        description: '',
        references:  [],
        createdAt:   now,
        updatedAt:   now,
        ...action.payload,
        id: generateId('task'),
      };
      return { ...state, tasks: [...state.tasks, newTask] };
    }

    case Actions.UPDATE_TASK: {
      const { id, ...changes } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === id
            ? { ...t, ...changes, updatedAt: new Date().toISOString() }
            : t
        ),
      };
    }

    case Actions.DELETE_TASK: {
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    }

    case Actions.UPDATE_TASK_STATUS: {
      // payload: { id, status }
      const { id, status } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
        ),
      };
    }

    case Actions.BULK_UPDATE_STATUS: {
      // payload: { ids: string[], status }
      const { ids, status } = action.payload;
      const now = new Date().toISOString();
      const idSet = new Set(ids);
      return {
        ...state,
        tasks: state.tasks.map(t =>
          idSet.has(t.id) ? { ...t, status, updatedAt: now } : t
        ),
      };
    }

    default:
      return state;
  }
}
