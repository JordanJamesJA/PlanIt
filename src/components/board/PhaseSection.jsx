import { useState } from 'react';
import { TaskCard }    from './TaskCard';
import { Button }      from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge }       from '@/components/ui/Badge';
import { calcStats, filterTasks, getPhaseTasksSorted } from '@/utils/stats';
import { STATUS_CONFIG } from '@/constants/config';

/**
 * PhaseSection
 *
 * @prop {object}   phase
 * @prop {object[]} tasks        - ALL tasks for this phase (unfiltered)
 * @prop {object}   filters      - { search, status, priority }
 * @prop {(task) => void} onEditTask
 * @prop {(id, status) => void} onTaskStatusChange
 * @prop {() => void} onAddTask
 * @prop {() => void} onEditPhase
 * @prop {() => void} onDeletePhase
 */
export function PhaseSection({
  phase,
  tasks,
  filters,
  onEditTask,
  onTaskStatusChange,
  onAddTask,
  onEditPhase,
  onDeletePhase,
}) {
  const [collapsed,     setCollapsed]     = useState(false);
  const [headerHovered, setHeaderHovered] = useState(false);

  const allStats     = calcStats(tasks);
  const filteredTasks = filterTasks(
    getPhaseTasksSorted(tasks, phase.id),
    filters
  );

  const hasActiveFilter = filters.search || filters.status !== 'all' || filters.priority !== 'all';

  return (
    <div style={{
      background:   'var(--surface)',
      border:       '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      overflow:     'hidden',
      transition:   'border-color var(--ease)',
    }}>
      {/* ── Phase Header ─────────────────────────────────────────────── */}
      <div
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        10,
          padding:    '12px 16px',
          cursor:     'pointer',
          background: headerHovered ? 'var(--elevated)' : 'transparent',
          transition: 'background var(--ease)',
        }}
        onClick={() => setCollapsed(c => !c)}
      >
        {/* Collapse chevron */}
        <span style={{
          color:      'var(--text-3)',
          fontSize:   12,
          transition: 'transform var(--ease)',
          transform:  collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
          flexShrink: 0,
        }}>
          ▾
        </span>

        {/* Name + stats */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize:   15,
            color:      'var(--text)',
          }}>
            {phase.name}
          </span>

          {/* Status breakdown badges */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {[
              { key: 'done',       val: allStats.done },
              { key: 'in-progress', val: allStats.inProgress },
              { key: 'blocked',    val: allStats.blocked },
            ].filter(x => x.val > 0).map(({ key, val }) => (
              <Badge
                key={key}
                color={STATUS_CONFIG[key].color}
                bg={STATUS_CONFIG[key].bg}
                size="sm"
                dot
              >
                {val}
              </Badge>
            ))}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>
              {allStats.done}/{allStats.total}
            </span>
          </div>

          {/* Progress bar */}
          {allStats.total > 0 && (
            <div style={{ flex: 1, minWidth: 80, maxWidth: 160 }}>
              <ProgressBar value={allStats.pct} height={3} />
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          style={{ display: 'flex', gap: 4, opacity: headerHovered ? 1 : 0, transition: 'opacity var(--ease)' }}
          onClick={e => e.stopPropagation()}
        >
          <PhaseAction onClick={onAddTask}   title="Add task" >+</PhaseAction>
          <PhaseAction onClick={onEditPhase} title="Edit phase">✎</PhaseAction>
          <PhaseAction onClick={onDeletePhase} title="Delete phase" danger>⊗</PhaseAction>
        </div>
      </div>

      {/* ── Phase Description ─────────────────────────────────────────── */}
      {phase.description && !collapsed && (
        <div style={{
          padding:   '0 16px 8px 38px',
          fontSize:  12,
          color:     'var(--text-3)',
          lineHeight: 1.5,
        }}>
          {phase.description}
        </div>
      )}

      {/* ── Task List ─────────────────────────────────────────────────── */}
      {!collapsed && (
        <div style={{ padding: '0 12px 12px 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>

          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onEditTask(task)}
                onStatusChange={onTaskStatusChange}
              />
            ))
          ) : (
            <div style={{
              padding:   '20px 0',
              textAlign: 'center',
              color:     'var(--text-3)',
              fontSize:  12,
            }}>
              {hasActiveFilter
                ? 'No tasks match current filters'
                : 'No tasks yet — add one above'}
            </div>
          )}

          {/* Inline quick-add */}
          <button
            onClick={onAddTask}
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          8,
              padding:      '8px 10px',
              background:   'transparent',
              border:       '1px dashed var(--border)',
              borderRadius: 'var(--r-md)',
              cursor:       'pointer',
              color:        'var(--text-3)',
              fontSize:     12,
              transition:   'all var(--ease)',
              marginTop:    4,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color       = 'var(--accent)';
              e.currentTarget.style.background  = 'var(--accent-dim)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color       = 'var(--text-3)';
              e.currentTarget.style.background  = 'transparent';
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600 }}>+</span>
            Add task
          </button>
        </div>
      )}
    </div>
  );
}

function PhaseAction({ onClick, title, danger, children }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 24, height: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', border: 'none', borderRadius: 4,
        color:   danger ? 'var(--danger)' : 'var(--text-3)',
        cursor:  'pointer', fontSize: 14,
        transition: 'background var(--ease)',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--overlay)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </button>
  );
}
