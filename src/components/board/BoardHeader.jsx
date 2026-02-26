import { ProgressBar }  from '@/components/ui/ProgressBar';
import { Button }        from '@/components/ui/Button';
import { calcStats }     from '@/utils/stats';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/constants/config';

/**
 * BoardHeader
 *
 * @prop {object}   project
 * @prop {object}   stats       - from calcStats
 * @prop {object}   filters     - { search, status, priority }
 * @prop {(f) => void} setFilters
 * @prop {() => void} onAddPhase
 * @prop {() => void} onEditProject
 */
export function BoardHeader({ project, stats, filters, setFilters, onAddPhase, onEditProject }) {
  const hasFilter = filters.search || filters.status !== 'all' || filters.priority !== 'all';

  return (
    <div style={{
      borderBottom: '1px solid var(--border)',
      padding:      '16px 24px',
      background:   'var(--surface)',
      flexShrink:   0,
    }}>
      {/* Project title row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: project.color + '20',
          border:     `1px solid ${project.color}40`,
          borderRadius: 8,
          fontSize: 18, flexShrink: 0,
        }}>
          {project.emoji ?? '⬡'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize:   20, color: 'var(--text)',
            }}>
              {project.name}
            </h2>
            <button
              onClick={onEditProject}
              title="Edit project"
              style={{
                background: 'none', border: 'none',
                color: 'var(--text-3)', cursor: 'pointer',
                fontSize: 13, padding: '2px 5px',
                borderRadius: 4, transition: 'color var(--ease)',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
            >
              ✎
            </button>
          </div>

          {project.description && (
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>
              {project.description}
            </p>
          )}
        </div>

        {/* Global stats */}
        <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
          <StatPill label="Total"    value={stats.total}      color="var(--text-2)"   />
          <StatPill label="Done"     value={stats.done}       color="var(--success)"  />
          <StatPill label="Active"   value={stats.inProgress} color="var(--accent)"   />
          {stats.blocked > 0 && (
            <StatPill label="Blocked" value={stats.blocked}   color="var(--danger)"   />
          )}
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar
        value={stats.pct}
        color={project.color}
        height={5}
        showLabel
        style={{ marginBottom: 14 }}
      />

      {/* Filter + actions row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>

        {/* Search */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <span style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-3)', fontSize: 13, pointerEvents: 'none',
          }}>
            ⌕
          </span>
          <input
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            placeholder="Search tasks…"
            style={{
              background:   'var(--elevated)',
              border:       `1px solid ${filters.search ? 'var(--accent)' : 'var(--border-mid)'}`,
              borderRadius: 'var(--r-md)',
              color:        'var(--text)',
              fontFamily:   'var(--font-body)',
              fontSize:     13,
              padding:      '6px 10px 6px 30px',
              outline:      'none',
              width:        180,
              transition:   'border-color var(--ease)',
            }}
          />
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {['all', ...Object.keys(STATUS_CONFIG)].map(s => (
            <FilterChip
              key={s}
              active={filters.status === s}
              color={s === 'all' ? undefined : STATUS_CONFIG[s]?.color}
              onClick={() => setFilters(f => ({ ...f, status: s }))}
            >
              {s === 'all' ? 'All Status' : STATUS_CONFIG[s].label}
            </FilterChip>
          ))}
        </div>

        {/* Priority filter */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {['all', ...Object.keys(PRIORITY_CONFIG)].map(p => (
            <FilterChip
              key={p}
              active={filters.priority === p}
              color={p === 'all' ? undefined : PRIORITY_CONFIG[p]?.color}
              onClick={() => setFilters(f => ({ ...f, priority: p }))}
            >
              {p === 'all' ? 'All Priority' : PRIORITY_CONFIG[p].label}
            </FilterChip>
          ))}
        </div>

        {/* Clear filters */}
        {hasFilter && (
          <button
            onClick={() => setFilters({ search: '', status: 'all', priority: 'all' })}
            style={{
              background: 'var(--danger-dim)', border: '1px solid var(--danger)30',
              borderRadius: 'var(--r-md)', color: 'var(--danger)',
              cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)',
              padding: '5px 10px', transition: 'all var(--ease)',
            }}
          >
            ✕ Clear
          </button>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Add Phase */}
        <Button variant="primary" size="sm" icon="+" onClick={onAddPhase}>
          Add Phase
        </Button>
      </div>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 36 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 500, color, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function FilterChip({ active, color, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding:      '4px 10px',
        borderRadius: 'var(--r-md)',
        border:       `1px solid ${active ? (color ?? 'var(--accent)') : 'var(--border)'}`,
        background:   active ? (color ? color + '20' : 'var(--accent-dim)') : 'transparent',
        color:        active ? (color ?? 'var(--accent)') : 'var(--text-3)',
        cursor:       'pointer',
        fontFamily:   'var(--font-body)',
        fontSize:     12,
        fontWeight:   active ? 500 : 400,
        transition:   'all var(--ease)',
        whiteSpace:   'nowrap',
      }}
    >
      {children}
    </button>
  );
}
