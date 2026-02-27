import { Sidebar } from './Sidebar';
import { Board }    from '@/components/board/Board';
import { useAppStore } from '@/hooks/useAppStore';


export function AppLayout() {
  const { activeProject, saving, state } = useAppStore();

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      <Sidebar />

      <main style={{
        flex:     1,
        display:  'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          height:       'var(--topbar-h)',
          borderBottom: '1px solid var(--border)',
          display:      'flex',
          alignItems:   'center',
          padding:      '0 24px',
          gap:          12,
          background:   'var(--surface)',
          flexShrink:   0,
        }}>
          {activeProject && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-3)' }}>
              <span>Projects</span>
              <span>›</span>
              <span style={{ color: 'var(--text-2)', fontWeight: 500 }}>{activeProject.name}</span>
            </div>
          )}

          <div style={{ flex: 1 }} />

          {saving && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span className="animate-spin" style={{ color: 'var(--accent)', fontSize: 12 }}>◌</span>
              <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                saving…
              </span>
            </div>
          )}

          <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
            {state.projects.length} project{state.projects.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeProject ? (
            <Board />
          ) : (
            <WelcomeScreen />
          )}
        </div>
      </main>
    </div>
  );
}


function WelcomeScreen() {
  return (
    <div style={{
      flex: 1,
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        40,
      textAlign:      'center',
      gap:            20,
    }}>
      <div style={{
        fontSize: 64,
        opacity:  0.15,
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        letterSpacing: '-2px',
        color: 'var(--accent)',
      }}>
        ⬡
      </div>

      <div style={{ maxWidth: 420 }}>
        <h1 style={{
          fontFamily:    'var(--font-display)',
          fontSize:      32,
          fontWeight:    800,
          color:         'var(--text)',
          marginBottom:  10,
          letterSpacing: '-0.5px',
        }}>
          Plan with precision.
        </h1>
        <p style={{
          fontSize:   14,
          color:      'var(--text-3)',
          lineHeight: 1.7,
          maxWidth:   340,
          margin:     '0 auto',
        }}>
          Create a project in the sidebar and start tracking phases and tasks. Works for hackathons, sprints, research — anything you're building.
        </p>
      </div>

      <div style={{
        display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8,
      }}>
        {[
          { emoji: '⚡', label: 'Hackathon', desc: '24-hr sprint' },
          { emoji: '🌐', label: 'Web App',   desc: 'Full lifecycle' },
          { emoji: '🏃', label: 'Sprint',    desc: 'Agile 2-week' },
          { emoji: '🔬', label: 'Research',  desc: 'Long-form study' },
        ].map(t => (
          <div key={t.label} style={{
            padding:      '12px 16px',
            background:   'var(--surface)',
            border:       '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            minWidth:     110,
            textAlign:    'center',
          }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{t.emoji}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>{t.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.desc}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
        ← Select a project or click <strong style={{ color: 'var(--accent)' }}>+ New Project</strong> to begin
      </p>
    </div>
  );
}
