import { useState } from 'react';
import { BoardHeader } from './BoardHeader';
import { PhaseSection } from './PhaseSection';
import { TaskModal }    from '@/components/task/TaskModal';
import { PhaseModal }   from '@/components/phase/PhaseModal';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { calcStats }    from '@/utils/stats';
import { useAppStore }  from '@/hooks/useAppStore';

/**
 * Board
 * Renders the full project board for the active project.
 */
export function Board() {
  const {
    activeProject, activePhases, activeTasks, getTasksByPhase,
    createTask, updateTask, deleteTask, updateTaskStatus,
    createPhase, updatePhase, deletePhase,
    updateProject,
  } = useAppStore();

  const [filters, setFilters] = useState({
    search:   '',
    status:   'all',
    priority: 'all',
  });

  // Modal state
  const [taskModal,    setTaskModal]    = useState(null);  // null | { task, phaseId }
  const [phaseModal,   setPhaseModal]   = useState(null);  // null | { phase }
  const [projectModal, setProjectModal] = useState(false);

  if (!activeProject) return null;

  const stats = calcStats(activeTasks);

  // ── Handlers ────────────────────────────────────────────────────────────

  function handleSaveTask(data) {
    if (data.id) updateTask(data);
    else         createTask(data);
  }

  function handleDeleteTask(id) { deleteTask(id); }

  function handleSavePhase(data) {
    if (data.id) updatePhase(data);
    else         createPhase(data);
  }

  function handleSaveProject(data) {
    updateProject({ id: activeProject.id, ...data });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <BoardHeader
        project={activeProject}
        stats={stats}
        filters={filters}
        setFilters={setFilters}
        onAddPhase={() => setPhaseModal({ phase: null })}
        onEditProject={() => setProjectModal(true)}
      />

      {/* ── Phase list ──────────────────────────────────────────────── */}
      <div style={{
        flex:      1,
        overflowY: 'auto',
        padding:   '20px 24px',
        display:   'flex',
        flexDirection: 'column',
        gap:       12,
      }}>
        {activePhases.length === 0 ? (
          <EmptyState onAddPhase={() => setPhaseModal({ phase: null })} />
        ) : (
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activePhases.map(phase => (
              <PhaseSection
                key={phase.id}
                phase={phase}
                tasks={getTasksByPhase(phase.id)}
                filters={filters}
                onAddTask={() => setTaskModal({ task: null, phaseId: phase.id })}
                onEditTask={task => setTaskModal({ task, phaseId: task.phaseId })}
                onTaskStatusChange={updateTaskStatus}
                onEditPhase={() => setPhaseModal({ phase })}
                onDeletePhase={() => {
                  if (window.confirm(`Delete phase "${phase.name}" and all its tasks?`)) {
                    deletePhase(phase.id);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────── */}

      {taskModal !== null && (
        <TaskModal
          task={taskModal.task}
          phaseId={taskModal.phaseId}
          projectId={activeProject.id}
          phases={activePhases}
          onSave={handleSaveTask}
          onClose={() => setTaskModal(null)}
          onDelete={handleDeleteTask}
        />
      )}

      {phaseModal !== null && (
        <PhaseModal
          phase={phaseModal.phase}
          projectId={activeProject.id}
          onSave={handleSavePhase}
          onClose={() => setPhaseModal(null)}
        />
      )}

      {projectModal && (
        <ProjectModal
          project={activeProject}
          onSave={handleSaveProject}
          onClose={() => setProjectModal(false)}
        />
      )}
    </div>
  );
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────

function EmptyState({ onAddPhase }) {
  return (
    <div style={{
      flex: 1,
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        60,
      textAlign:      'center',
      gap:            16,
    }}>
      <div style={{ fontSize: 48, opacity: 0.3 }}>⬡</div>
      <div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-2)', marginBottom: 6 }}>
          No phases yet
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-3)', maxWidth: 300, lineHeight: 1.6 }}>
          Break your project into phases — like Design, Build, and Launch — then add tasks to each.
        </p>
      </div>
      <button
        onClick={onAddPhase}
        style={{
          background:   'var(--accent)',
          color:        'var(--text-inv)',
          border:       'none',
          borderRadius: 'var(--r-md)',
          padding:      '8px 18px',
          fontFamily:   'var(--font-body)',
          fontSize:     13, fontWeight: 500,
          cursor:       'pointer',
          marginTop:    4,
        }}
      >
        Add First Phase
      </button>
    </div>
  );
}
