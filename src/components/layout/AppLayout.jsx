import { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Board } from '@/components/board/Board';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/hooks/useAppStore';
import { useIsMobile } from '@/hooks/useIsMobile';
import { PROJECT_COLORS, PROJECT_TEMPLATES } from '@/constants/config';

export function AppLayout() {
  const { activeProject, saving, state, setActiveProject } = useAppStore();
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile(960);

  useEffect(() => {
    if (!isMobile) setMobileSidebarOpen(false);
  }, [isMobile]);

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        createModalOpen={createProjectModalOpen}
        onOpenCreateModal={() => setCreateProjectModalOpen(true)}
        onCloseCreateModal={() => setCreateProjectModalOpen(false)}
      />

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          minHeight: 'var(--topbar-h)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          padding: isMobile ? '10px 12px' : '0 24px',
          gap: 10,
          background: 'var(--surface)',
          flexShrink: 0,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        }}>
          {isMobile && (
            <button
              title="Open menu"
              onClick={() => setMobileSidebarOpen(true)}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-mid)',
                color: 'var(--text-2)',
                borderRadius: 'var(--r-md)',
                width: 32,
                height: 30,
                cursor: 'pointer',
              }}
            >
              ☰
            </button>
          )}

          {activeProject ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-3)' }}>
              <button
                onClick={() => setActiveProject(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-3)',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 12,
                }}
                title="Back to home"
              >
                Home
              </button>
              <span>›</span>
              <span style={{ color: 'var(--text-2)', fontWeight: 500, maxWidth: isMobile ? 180 : 'none' }} className="truncate">
                {activeProject.name}
              </span>
            </div>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Home</span>
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
            <WelcomeScreen onCreateProject={() => setCreateProjectModalOpen(true)} isMobile={isMobile} />
          )}
        </div>
      </main>
    </div>
  );
}

function WelcomeScreen({ onCreateProject, isMobile }) {
  const { createProject } = useAppStore();

  function quickStartFromTemplate(template, idx) {
    createProject({
      name: `${template.label} Project`,
      description: template.description,
      emoji: template.emoji,
      color: PROJECT_COLORS[idx % PROJECT_COLORS.length],
      phases: template.phases,
    });
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? 16 : 40,
      textAlign: 'center',
      gap: 20,
      overflowY: 'auto',
    }}>
      <div style={{
        fontSize: isMobile ? 52 : 64,
        opacity: 0.15,
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        letterSpacing: '-2px',
        color: 'var(--accent)',
      }}>
        ⬡
      </div>

      <div style={{ maxWidth: 480 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: isMobile ? 26 : 32,
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: 10,
          letterSpacing: '-0.5px',
        }}>
          Plan with precision.
        </h1>
        <p style={{
          fontSize: 14,
          color: 'var(--text-3)',
          lineHeight: 1.7,
          maxWidth: 420,
          margin: '0 auto',
        }}>
          Start quickly with a project template or create a custom project.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, minmax(120px, 1fr))',
        gap: 10,
        width: '100%',
        maxWidth: 640,
      }}>
        {PROJECT_TEMPLATES.filter((template) => template.id !== 'blank').map((template, idx) => (
          <button
            key={template.id}
            onClick={() => quickStartFromTemplate(template, idx)}
            style={{
              padding: '12px 10px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 4 }}>{template.emoji}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>{template.label}</div>
          </button>
        ))}
      </div>

      <Button variant="outline" size="md" icon="+" onClick={onCreateProject}>
        New Project
      </Button>
    </div>
  );
}
