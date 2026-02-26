import { createContext, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { reducer, initialState, Actions } from './reducer';
import { storage } from '@/utils/storage';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch]   = useReducer(reducer, initialState);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveTimer           = useRef(null);

  // ── Hydrate from storage on mount ─────────────────────────────────────────
  useEffect(() => {
    storage.load().then(saved => {
      if (saved) dispatch({ type: Actions.LOAD_STATE, payload: saved });
      setLoaded(true);
    });
  }, []);

  // ── Persist on every state change (debounced) ─────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    clearTimeout(saveTimer.current);
    setSaving(true);
    saveTimer.current = setTimeout(() => {
      storage.save(state).finally(() => setSaving(false));
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [state, loaded]);

  // ── Action creators ───────────────────────────────────────────────────────

  const setActiveProject = useCallback(id => {
    dispatch({ type: Actions.SET_ACTIVE_PROJECT, payload: id });
  }, []);

  const createProject = useCallback(data => {
    dispatch({ type: Actions.CREATE_PROJECT, payload: data });
  }, []);

  const updateProject = useCallback(data => {
    dispatch({ type: Actions.UPDATE_PROJECT, payload: data });
  }, []);

  const deleteProject = useCallback(id => {
    dispatch({ type: Actions.DELETE_PROJECT, payload: id });
  }, []);

  const createPhase = useCallback(data => {
    dispatch({ type: Actions.CREATE_PHASE, payload: data });
  }, []);

  const updatePhase = useCallback(data => {
    dispatch({ type: Actions.UPDATE_PHASE, payload: data });
  }, []);

  const deletePhase = useCallback(id => {
    dispatch({ type: Actions.DELETE_PHASE, payload: id });
  }, []);

  const createTask = useCallback(data => {
    dispatch({ type: Actions.CREATE_TASK, payload: data });
  }, []);

  const updateTask = useCallback(data => {
    dispatch({ type: Actions.UPDATE_TASK, payload: data });
  }, []);

  const deleteTask = useCallback(id => {
    dispatch({ type: Actions.DELETE_TASK, payload: id });
  }, []);

  const updateTaskStatus = useCallback((id, status) => {
    dispatch({ type: Actions.UPDATE_TASK_STATUS, payload: { id, status } });
  }, []);

  const bulkUpdateStatus = useCallback((ids, status) => {
    dispatch({ type: Actions.BULK_UPDATE_STATUS, payload: { ids, status } });
  }, []);

  // ── Derived selectors ─────────────────────────────────────────────────────

  const activeProject = state.projects.find(p => p.id === state.activeProjectId) ?? null;

  const activePhases = state.phases
    .filter(p => p.projectId === state.activeProjectId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const activeTasks = state.tasks.filter(t =>
    activePhases.some(p => p.id === t.phaseId)
  );

  const getTasksByPhase = useCallback((phaseId) =>
    state.tasks.filter(t => t.phaseId === phaseId),
  [state.tasks]);

  // ── Context value ─────────────────────────────────────────────────────────

  const value = {
    // Raw state
    state,
    loaded,
    saving,

    // Derived
    activeProject,
    activePhases,
    activeTasks,
    getTasksByPhase,

    // Actions
    setActiveProject,
    createProject,
    updateProject,
    deleteProject,
    createPhase,
    updatePhase,
    deletePhase,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    bulkUpdateStatus,
  };

  if (!loaded) return null; // Avoid flash before hydration

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
