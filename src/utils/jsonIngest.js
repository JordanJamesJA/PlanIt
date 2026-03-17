import { generateId } from '@/utils/id';

// ─── Key detection sets ────────────────────────────────────────────────────────
const TASK_KEYS = new Set([
  'task', 'tasks', 'title', 'name', 'step', 'steps', 'checklist',
  'item', 'items', 'action', 'actions', 'milestone', 'milestones',
  'todo', 'todos', 'deliverable', 'deliverables',
]);

const SUBTASK_KEYS = new Set([
  'subtasks', 'subtask', 'children', 'sub_tasks', 'sub_items',
  'checklist', 'steps', 'items',
]);

const GROUP_KEYS = new Set([
  'project', 'phase', 'phases', 'module', 'modules', 'section',
  'sections', 'category', 'categories', 'group', 'groups', 'stage', 'stages',
]);

const META_KEYS = new Set([
  'priority', 'status', 'owner', 'assignee', 'assigned_to',
  'deadline', 'date', 'due_date', 'dueDate', 'due',
  'tags', 'labels', 'depends_on', 'dependencies', 'blocked_by',
  'notes', 'description', 'details', 'summary', 'desc',
]);

const NAME_KEYS = new Set([
  'project', 'project_name', 'projectName', 'name', 'title', 'label',
]);

// ─── Status normalization ──────────────────────────────────────────────────────
const STATUS_MAP = {
  'todo':         'todo',
  'to do':        'todo',
  'to-do':        'todo',
  'not started':  'todo',
  'pending':      'todo',
  'open':         'todo',
  'new':          'todo',
  'backlog':      'todo',

  'in progress':  'in-progress',
  'in_progress':  'in-progress',
  'in-progress':  'in-progress',
  'inprogress':   'in-progress',
  'active':       'in-progress',
  'started':      'in-progress',
  'doing':        'in-progress',
  'wip':          'in-progress',

  'blocked':      'blocked',
  'on hold':      'blocked',
  'on_hold':      'blocked',
  'waiting':      'blocked',
  'paused':       'blocked',

  'review':       'review',
  'in review':    'review',
  'in_review':    'review',
  'reviewing':    'review',

  'done':         'done',
  'complete':     'done',
  'completed':    'done',
  'finished':     'done',
  'closed':       'done',
  'resolved':     'done',
};

// ─── Priority normalization ────────────────────────────────────────────────────
const PRIORITY_MAP = {
  'low':       'low',
  'minor':     'low',
  'trivial':   'low',
  '1':         'low',
  'p3':        'low',
  'p4':        'low',

  'medium':    'medium',
  'med':       'medium',
  'normal':    'medium',
  'moderate':  'medium',
  '2':         'medium',
  'p2':        'medium',

  'high':      'high',
  'important': 'high',
  'major':     'high',
  '3':         'high',
  'p1':        'high',

  'critical':  'critical',
  'urgent':    'critical',
  'blocker':   'critical',
  'highest':   'critical',
  '4':         'critical',
  'p0':        'critical',
};

// ─── Date normalization ────────────────────────────────────────────────────────
function normalizeDate(val) {
  if (!val) return null;
  const str = String(val).trim();
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  // Try common formats like DD/MM/YYYY
  const parts = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (parts) {
    const attempt = new Date(`${parts[3]}-${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}`);
    if (!isNaN(attempt.getTime())) return attempt.toISOString().split('T')[0];
  }
  return null;
}

function normalizeStatus(val) {
  if (!val) return 'todo';
  return STATUS_MAP[String(val).toLowerCase().trim()] ?? 'todo';
}

function normalizePriority(val) {
  if (!val) return 'medium';
  return PRIORITY_MAP[String(val).toLowerCase().trim()] ?? 'medium';
}

function normalizeTags(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(t => String(t).trim()).filter(Boolean);
  if (typeof val === 'string') return val.split(',').map(t => t.trim()).filter(Boolean);
  return [];
}

function arrayLooksLikeTasks(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return false;

  return arr.some(item => {
    if (typeof item === 'string') return true;
    if (typeof item !== 'object' || item === null) return false;
    return Boolean(extractTitle(item).title);
  });
}

// ─── Extract metadata from an object ──────────────────────────────────────────
function extractMeta(obj) {
  const meta = {};
  const consumed = new Set();

  for (const [key, val] of Object.entries(obj)) {
    const k = key.toLowerCase();
    if (['status'].includes(k))                                    { meta.status = normalizeStatus(val);   consumed.add(key); }
    else if (['priority'].includes(k))                             { meta.priority = normalizePriority(val); consumed.add(key); }
    else if (['owner', 'assignee', 'assigned_to'].includes(k))    { meta.assignee = String(val);           consumed.add(key); }
    else if (['deadline', 'date', 'due_date', 'duedate', 'due'].includes(k)) { meta.dueDate = normalizeDate(val); consumed.add(key); }
    else if (['tags', 'labels'].includes(k))                       { meta.tags = normalizeTags(val);       consumed.add(key); }
    else if (['depends_on', 'dependencies', 'blocked_by'].includes(k)) { meta.dependencies = normalizeTags(val); consumed.add(key); }
    else if (['notes', 'description', 'details', 'summary', 'desc'].includes(k)) { meta.description = String(val); consumed.add(key); }
  }
  return { meta, consumed };
}

// ─── Find the task title from an object ───────────────────────────────────────
function extractTitle(obj) {
  for (const key of ['title', 'name', 'task', 'action', 'item', 'todo', 'step', 'deliverable', 'milestone', 'label']) {
    if (obj[key] && typeof obj[key] === 'string') return { title: obj[key], titleKey: key };
  }
  return { title: null, titleKey: null };
}

// ─── Find project name ────────────────────────────────────────────────────────
function findProjectName(data) {
  if (typeof data !== 'object' || data === null) return 'Imported Project';
  for (const key of NAME_KEYS) {
    if (data[key] && typeof data[key] === 'string') return data[key];
  }
  // CamelCase variants
  if (data.projectName && typeof data.projectName === 'string') return data.projectName;
  return 'Imported Project';
}

// ─── Main parse logic ──────────────────────────────────────────────────────────
export function parseJsonToTasks(jsonInput) {
  // Validate input
  let data;
  if (typeof jsonInput === 'string') {
    try {
      data = JSON.parse(jsonInput);
    } catch (e) {
      return { error: true, message: 'Invalid JSON input', details: e.message };
    }
  } else {
    data = jsonInput;
  }

  if (data === null || typeof data !== 'object') {
    return { error: true, message: 'Invalid JSON input', details: 'Input must be a JSON object or array' };
  }

  const projectName = findProjectName(data);
  const allTasks = [];
  const allPhases = [];
  const ignoredFields = new Set();
  let taskOrder = 0;
  let phaseOrder = 0;

  function buildTask(obj, sourcePath, parentTaskId = null) {
    if (typeof obj === 'string') {
      // Plain string = simple task title
      taskOrder++;
      return {
        id: generateId('task'),
        title: obj,
        description: '',
        status: 'todo',
        priority: 'medium',
        assignee: null,
        dueDate: null,
        tags: [],
        dependencies: [],
        parentTaskId,
        order: taskOrder,
        sourcePath,
        subtasks: [],
      };
    }

    if (typeof obj !== 'object' || obj === null) return null;

    const { title, titleKey } = extractTitle(obj);
    if (!title) return null;

    const { meta, consumed } = extractMeta(obj);
    if (titleKey) consumed.add(titleKey);

    taskOrder++;
    const taskId = generateId('task');

    // Find subtasks
    const subtasks = [];
    for (const key of Object.keys(obj)) {
      if (consumed.has(key)) continue;
      const k = key.toLowerCase();
      if (SUBTASK_KEYS.has(k) && Array.isArray(obj[key])) {
        consumed.add(key);
        obj[key].forEach((sub, i) => {
          const st = buildTask(sub, `${sourcePath}.${key}[${i}]`, taskId);
          if (st) subtasks.push(st);
        });
      }
    }

    // Track ignored fields
    for (const key of Object.keys(obj)) {
      if (!consumed.has(key) && !META_KEYS.has(key.toLowerCase()) && !SUBTASK_KEYS.has(key.toLowerCase())) {
        ignoredFields.add(key);
      }
    }

    return {
      id: taskId,
      title,
      description: meta.description ?? '',
      status: meta.status ?? 'todo',
      priority: meta.priority ?? 'medium',
      assignee: meta.assignee ?? null,
      dueDate: meta.dueDate ?? null,
      tags: meta.tags ?? [],
      dependencies: meta.dependencies ?? [],
      parentTaskId,
      order: taskOrder,
      sourcePath,
      subtasks,
    };
  }

  function processArray(arr, sourcePath, phaseName = null) {
    const tasks = [];
    arr.forEach((item, i) => {
      const task = buildTask(item, `${sourcePath}[${i}]`);
      if (task) tasks.push(task);
    });
    if (tasks.length > 0 && phaseName) {
      allPhases.push({ name: phaseName, description: '', order: phaseOrder++, tasks });
    } else if (tasks.length > 0) {
      // Add to default phase
      const defaultPhase = allPhases.find(p => p.name === 'Imported Tasks');
      if (defaultPhase) {
        defaultPhase.tasks.push(...tasks);
      } else {
        allPhases.push({ name: 'Imported Tasks', description: '', order: phaseOrder++, tasks });
      }
    }
    return tasks;
  }

  function processObject(obj, sourcePath) {
    // Check if this object itself is a single task
    const { title } = extractTitle(obj);

    // Look for grouped structure: keys that map to arrays of tasks (phases/sections)
    let foundGroups = false;
    for (const [key, val] of Object.entries(obj)) {
      const k = key.toLowerCase();

      // Skip metadata-level keys
      if (NAME_KEYS.has(k) || k === 'projectname' || k === 'project_name') continue;

      // Array of tasks under a group key
      if (GROUP_KEYS.has(k) && Array.isArray(val)) {
        // Array of phase objects: [{name: "Phase1", tasks: [...]}, ...]
        val.forEach((groupItem, gi) => {
          if (typeof groupItem === 'object' && groupItem !== null) {
            const groupName = groupItem.name || groupItem.title || groupItem.phase || groupItem.section || `Phase ${gi + 1}`;
            // Find tasks within this group
            for (const [gk, gv] of Object.entries(groupItem)) {
              if (Array.isArray(gv) && (TASK_KEYS.has(gk.toLowerCase()) || SUBTASK_KEYS.has(gk.toLowerCase()))) {
                processArray(gv, `${sourcePath}.${key}[${gi}].${gk}`, String(groupName));
                foundGroups = true;
              }
            }
          }
        });
        continue;
      }

      // Object with phase-like keys mapping to task arrays
      if (typeof val === 'object' && val !== null && !Array.isArray(val) && GROUP_KEYS.has(k)) {
        for (const [phaseKey, phaseVal] of Object.entries(val)) {
          if (Array.isArray(phaseVal)) {
            processArray(phaseVal, `${sourcePath}.${key}.${phaseKey}`, phaseKey);
            foundGroups = true;
          }
        }
        continue;
      }

      // Direct task array at top-level key
      if (Array.isArray(val) && (TASK_KEYS.has(k) || k === 'data')) {
        processArray(val, `${sourcePath}.${key}`);
        foundGroups = true;
        continue;
      }

      // Top-level arrays under custom keys are typically categories/phases.
      // Example: { "Design": [...], "Build": [...] }
      if (Array.isArray(val) && arrayLooksLikeTasks(val)) {
        processArray(val, `${sourcePath}.${key}`, key);
        foundGroups = true;
        continue;
      }

      // Object values that look like phases (keys map to arrays)
      if (typeof val === 'object' && val !== null && !Array.isArray(val) && !META_KEYS.has(k)) {
        // Check if it's a phase-like object with task arrays inside
        let hasTaskArrays = false;
        for (const [innerKey, innerVal] of Object.entries(val)) {
          if (Array.isArray(innerVal) && TASK_KEYS.has(innerKey.toLowerCase())) {
            processArray(innerVal, `${sourcePath}.${key}.${innerKey}`, key);
            hasTaskArrays = true;
            foundGroups = true;
          }
        }
        if (!hasTaskArrays && !foundGroups) {
          // Maybe it's a nested phase structure
          const innerTask = buildTask(val, `${sourcePath}.${key}`);
          if (innerTask) {
            const defaultPhase = allPhases.find(p => p.name === 'Imported Tasks');
            if (defaultPhase) defaultPhase.tasks.push(innerTask);
            else allPhases.push({ name: 'Imported Tasks', description: '', order: phaseOrder++, tasks: [innerTask] });
            foundGroups = true;
          }
        }
      }
    }

    // If nothing was found as groups, try the whole object as a single task
    if (!foundGroups && title) {
      const task = buildTask(obj, sourcePath);
      if (task) {
        allPhases.push({ name: 'Imported Tasks', description: '', order: phaseOrder++, tasks: [task] });
      }
    }
  }

  // ─── Entry point ───────────────────────────────────────────────────────────
  if (Array.isArray(data)) {
    processArray(data, 'root');
  } else {
    processObject(data, 'root');
  }

  // Count tasks + subtasks
  function countTasks(tasks) {
    let count = 0;
    let subCount = 0;
    for (const t of tasks) {
      count++;
      if (t.subtasks.length > 0) {
        subCount += t.subtasks.length;
        const nested = countTasks(t.subtasks);
        subCount += nested.subCount;
      }
    }
    return { count, subCount };
  }

  const allTasksFlat = allPhases.flatMap(p => p.tasks);
  const { count: tasksDetected, subCount: subtasksDetected } = countTasks(allTasksFlat);

  if (tasksDetected === 0) {
    return {
      error: true,
      message: 'No tasks detected',
      details: 'Could not find any task-like structures in the provided JSON. Ensure your JSON contains keys like "task", "title", "name", "step", "item", etc.',
    };
  }

  return {
    project_name: projectName,
    import_summary: {
      tasks_detected: tasksDetected,
      subtasks_detected: subtasksDetected,
      phases_detected: allPhases.length,
      ignored_fields: [...ignoredFields],
    },
    phases: allPhases,
  };
}

// ─── Convert parsed result to app state payloads ───────────────────────────────
export function buildImportPayload(parseResult) {
  if (parseResult.error) return parseResult;

  const projectId = generateId('proj');
  const now = new Date().toISOString();

  const project = {
    id: projectId,
    name: parseResult.project_name,
    description: `Imported ${parseResult.import_summary.tasks_detected} tasks`,
    emoji: '📥',
    color: '#7eb8f7',
    createdAt: now,
    updatedAt: now,
  };

  const phases = [];
  const tasks = [];

  function flattenTasks(taskList, phaseId) {
    for (const t of taskList) {
      tasks.push({
        id: t.id,
        phaseId,
        projectId,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        assignee: t.assignee ?? '',
        dueDate: t.dueDate,
        tags: t.tags,
        references: [],
        createdAt: now,
        updatedAt: now,
      });

      // Subtasks become regular tasks in the same phase (app has no nesting)
      if (t.subtasks.length > 0) {
        flattenTasks(t.subtasks, phaseId);
      }
    }
  }

  for (const phase of parseResult.phases) {
    const phaseId = generateId('phase');
    phases.push({
      id: phaseId,
      projectId,
      name: phase.name,
      description: phase.description,
      order: phase.order,
      createdAt: now,
    });
    flattenTasks(phase.tasks, phaseId);
  }

  return { project, phases, tasks, summary: parseResult.import_summary };
}
