import { calcStats } from '@/utils/stats';
import { ProgressBar } from '@/components/ui/ProgressBar';

/**
 * ProjectCard
 *
 * @prop {object}   project
 * @prop {object[]} phases
 * @prop {object[]} tasks
 * @prop {boolean}  active
 * @prop {() => void} onClick
 * @prop {() => void} onEdit
 * @prop {() => void} onDelete
 */
export function ProjectCard({ project, phases, tasks, active, onClick, onEdit, onDelete }) {
  const projectTasks  = tasks.filter(t => phases.some(p => p.id === t.phaseId && p.projectId === project.id));
  const stats         = calcStats(projectTasks);

  return (
    <div
      onClick={onClick}
      style={{
        background:   active ? 'var(--overlay)' : 'var(--surface)',
        border:       `1px solid ${active ? project.color + '60' : 'var(--border)'}`,
        borderLeft:   `3px solid ${active ? project.color : 'transparent'}`,
        borderRadius: 'var(--r-lg)',
        padding:      '14px 16px',
        cursor:       'pointer',
        transition:   'all var(--ease)',
        position:     'relative',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.borderColor = project.color + '40';
          e.currentTarget.style.background  = 'var(--elevated)';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.background  = 'var(--surface)';
        }
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        {/* Emoji avatar */}
        <div style={{
          width: 34, height: 34, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: project.color + '20',
          border: `1px solid ${project.color}40`,
          borderRadius: 'var(--r-md)',
          fontSize: 17,
        }}>
          {project.emoji ?? '⬡'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 2 }}
               className="truncate">
            {project.name}
          </div>
          {project.description && (
            <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.4 }}
                 className="truncate">
              {project.description}
            </div>
          )}
        </div>

        {/* Actions — shown on hover */}
        <div
          className="card-actions"
          style={{ display: 'flex', gap: 4, opacity: 0, transition: 'opacity var(--ease)' }}
          onClick={e => e.stopPropagation()}
        >
          <ActionBtn onClick={onEdit}   title="Edit">✎</ActionBtn>
          <ActionBtn onClick={onDelete} title="Delete" danger>⊗</ActionBtn>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
        <Stat color="var(--text-2)"        value={stats.total}      label="tasks" />
        <Stat color="var(--success)"       value={stats.done}       label="done" />
        {stats.inProgress > 0 && <Stat color="var(--accent)" value={stats.inProgress} label="active" />}
        {stats.blocked    > 0 && <Stat color="var(--danger)" value={stats.blocked}    label="blocked" />}
      </div>

      {/* Progress */}
      <ProgressBar value={stats.pct} color={project.color} height={3} />

      <style>{`.card-actions { opacity: 0; } [class]:hover > .card-actions,
        div:hover > .card-actions { opacity: 1; }`}</style>
    </div>
  );
}

function Stat({ value, label, color }) {
  return (
    <span style={{ color, display: 'flex', alignItems: 'center', gap: 3 }}>
      <strong>{value}</strong>
      <span style={{ color: 'var(--text-3)' }}>{label}</span>
    </span>
  );
}

function ActionBtn({ onClick, title, danger, children }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 22, height: 22,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent',
        border: 'none', borderRadius: 4,
        color: danger ? 'var(--danger)' : 'var(--text-3)',
        cursor: 'pointer', fontSize: 13,
        transition: 'background var(--ease)',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--overlay)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </button>
  );
}
