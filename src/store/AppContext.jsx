import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { reducer, initialState, Actions } from "./reducer";
import { loadCloudState, saveCloudState } from "../utils/cloudState";
import { storage } from "@/utils/storage";
import { supabase } from "../lib/supabaseClient";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const [session, setSession] = useState(null);

  const saveTimer = useRef(null);
  const hydratingRef = useRef(false); // prevents save loop while we LOAD_STATE

  // ── Subscribe to auth session ─────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession ?? null);
      },
    );

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // ── Hydrate: cloud-first when logged in; else local ───────────────────────
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      hydratingRef.current = true;

      try {
        const userId = session?.user?.id;

        // Always read local in case we need to import it.
        const local = await storage.load();

        if (userId) {
          // 1) Try cloud
          const cloud = await loadCloudState(userId);

          if (cancelled) return;

          if (cloud) {
            dispatch({ type: Actions.LOAD_STATE, payload: cloud });
          } else if (local) {
            // 2) Cloud empty: one-time import local -> cloud
            dispatch({ type: Actions.LOAD_STATE, payload: local });
            await saveCloudState(userId, local);
          } else {
            // 3) Nothing anywhere: keep initial state
          }
        } else {
          // Not logged in: use local only
          if (local) dispatch({ type: Actions.LOAD_STATE, payload: local });
        }
      } catch (e) {
        // If cloud fails, fall back to local
        try {
          const local = await storage.load();
          if (!cancelled && local)
            dispatch({ type: Actions.LOAD_STATE, payload: local });
        } catch {
          // ignore
        }
      } finally {
        if (!cancelled) setLoaded(true);
        // allow state-save effect again on next tick
        setTimeout(() => {
          hydratingRef.current = false;
        }, 0);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  // ── Persist on every state change (debounced) ─────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    if (hydratingRef.current) return;

    clearTimeout(saveTimer.current);
    setSaving(true);

    const userId = session?.user?.id;

    saveTimer.current = setTimeout(() => {
      // Always save local; cloud only if logged in
      const ops = [storage.save(state)];
      if (userId) ops.push(saveCloudState(userId, state));

      Promise.allSettled(ops).finally(() => setSaving(false));
    }, 500);

    return () => clearTimeout(saveTimer.current);
  }, [state, loaded, session?.user?.id]);

  // ── Action creators ───────────────────────────────────────────────────────
  const setActiveProject = useCallback((id) => {
    dispatch({ type: Actions.SET_ACTIVE_PROJECT, payload: id });
  }, []);

  const createProject = useCallback((data) => {
    dispatch({ type: Actions.CREATE_PROJECT, payload: data });
  }, []);

  const updateProject = useCallback((data) => {
    dispatch({ type: Actions.UPDATE_PROJECT, payload: data });
  }, []);

  const deleteProject = useCallback((id) => {
    dispatch({ type: Actions.DELETE_PROJECT, payload: id });
  }, []);

  const createPhase = useCallback((data) => {
    dispatch({ type: Actions.CREATE_PHASE, payload: data });
  }, []);

  const updatePhase = useCallback((data) => {
    dispatch({ type: Actions.UPDATE_PHASE, payload: data });
  }, []);

  const deletePhase = useCallback((id) => {
    dispatch({ type: Actions.DELETE_PHASE, payload: id });
  }, []);

  const createTask = useCallback((data) => {
    dispatch({ type: Actions.CREATE_TASK, payload: data });
  }, []);

  const updateTask = useCallback((data) => {
    dispatch({ type: Actions.UPDATE_TASK, payload: data });
  }, []);

  const deleteTask = useCallback((id) => {
    dispatch({ type: Actions.DELETE_TASK, payload: id });
  }, []);

  const updateTaskStatus = useCallback((id, status) => {
    dispatch({ type: Actions.UPDATE_TASK_STATUS, payload: { id, status } });
  }, []);

  const bulkUpdateStatus = useCallback((ids, status) => {
    dispatch({ type: Actions.BULK_UPDATE_STATUS, payload: { ids, status } });
  }, []);

  // ── Derived selectors ─────────────────────────────────────────────────────
  const activeProject =
    state.projects.find((p) => p.id === state.activeProjectId) ?? null;

  const activePhases = state.phases
    .filter((p) => p.projectId === state.activeProjectId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const activeTasks = state.tasks.filter((t) =>
    activePhases.some((p) => p.id === t.phaseId),
  );

  const getTasksByPhase = useCallback(
    (phaseId) => state.tasks.filter((t) => t.phaseId === phaseId),
    [state.tasks],
  );

  const value = {
    state,
    loaded,
    saving,

    // handy for UI (optional)
    session,

    activeProject,
    activePhases,
    activeTasks,
    getTasksByPhase,

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

  if (!loaded) return null;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
