import { useState } from 'react';
import { Badge }         from '@/components/ui/Badge';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/constants/config';

/**
 * TaskCard
 *
 * @prop {object}         task
 * @prop {(task) => void} onClick        - opens edit modal
 * @prop {(id, status) => void} onStatusChange
 */
export function TaskCard({ task, onClick, onStatusChange }) {
  const [hovered, setHovered] = useState(false);

  const sCfg = STATUS_CONFIG[task.status]   ?? STATUS_CONFIG.todo;
  const pCfg = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;

  const isDone    = task.status === 'done';
  const isBlocked = task.status === 'blocked';

  const overdue = task.dueDate && !isDone && new Date(task.dueDate) < new Date();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:      'flex',
        alignItems:   'flex-start',
        gap:          10,
        padding:      '10px 12px',
        background:   hovered ? 'var(--elevated)' : 'var(--surface)',
        border:       `1px solid ${isBlocked ? 'var(--danger)30' : hovered ? 'var(--border-mid)' : 'var(--border)'}`,
        borderLeft:   `3px solid ${pCfg.color}`,
        borderRadius: 'var(--r-md)',
        cursor:       'pointer',
        transition:   'all var(--ease)',
        opacity:      isDone ? 0.6 : 1,
      }}
    >
      {/* Status toggle button */}
      <button
        title={`Status: ${sCfg.label} — click to cycle`}
        onClick={e => {
          e.stopPropagation();
          const keys = Object.keys(STATUS_CONFIG);
          const next = keys[(keys.indexOf(task.status) + 1) % keys.length];
          onStatusChange(task.id, next);
        }}
        style={{
          width: 18, height: 18,
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: sCfg.bg,
          border:     `1px solid ${sCfg.color}60`,
          borderRadius: '50%',
          cursor:     'pointer',
          fontSize:   10,
          color:      sCfg.color,
          marginTop:  2,
          transition: 'transform var(--ease-spring)',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {sCfg.icon}
      </button>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }} onClick={onClick}>
        <div style={{
          fontSize:       13,
          fontWeight:     500,
          color:          isDone ? 'var(--text-3)' : 'var(--text)',
          textDecoration: isDone ? 'line-through' : 'none',
          lineHeight:     1.4,
          marginBottom:   task.description ? 3 : 0,
        }}>
          {task.title}
        </div>

        {task.description && (
          <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.4, marginBottom: 5 }}
               className="truncate">
            {task.description}
          </div>
        )}

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Badge color={pCfg.color} bg={pCfg.bg} size="sm" dot>
            {pCfg.label}
          </Badge>

          {task.assignee && (
            <Badge color="var(--text-3)" bg="var(--overlay)" size="sm">
              {task.assignee}
            </Badge>
          )}

          {task.dueDate && (
            <Badge
              color={overdue ? 'var(--danger)' : 'var(--text-3)'}
              bg={overdue ? 'var(--danger-dim)' : 'var(--overlay)'}
              size="sm"
            >
              {overdue ? '⚠ ' : ''}
              {formatDate(task.dueDate)}
            </Badge>
          )}

          {(task.tags ?? []).slice(0, 3).map(tag => (
            <Badge key={tag} color="var(--info)" bg="var(--info-dim)" size="sm">
              #{tag}
            </Badge>
          ))}

          {(task.references ?? []).length > 0 && (
            <Badge color="var(--text-3)" bg="var(--overlay)" size="sm">
              🔗 {task.references.length}
            </Badge>
          )}
        </div>
      </div>

      {/* Edit hint */}
      {hovered && (
        <button
          onClick={onClick}
          title="Edit task"
          style={{
            background: 'var(--overlay)', border: 'none',
            borderRadius: 'var(--r-sm)', cursor: 'pointer',
            color: 'var(--text-3)', fontSize: 12,
            padding: '2px 6px', flexShrink: 0, marginTop: 2,
            transition: 'color var(--ease)',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
        >
          ✎
        </button>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
