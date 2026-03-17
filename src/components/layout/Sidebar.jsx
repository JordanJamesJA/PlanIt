import { useState } from 'react';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { ImportModal } from '@/components/projects/ImportModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/hooks/useAppStore';
import { AuthButton } from '@/components/auth/AuthButton';

export function Sidebar({
  isMobile = false,
  mobileOpen = false,
  onCloseMobile,
  createModalOpen,
  onOpenCreateModal,
  onCloseCreateModal,
}) {
  const {
    state,
    activeProject,
    setActiveProject,
    createProject,
    updateProject,
    deleteProject,
  } = useAppStore();

  const { projects, phases, tasks } = state;

  const [importModal, setImportModal] = useState(false);
  const [editingProj, setEditingProj] = useState(null);
  const [deletingProj, setDeletingProj] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  if (isMobile && !mobileOpen && !createModalOpen && !editingProj && !importModal && !deletingProj) {
    return null;
  }

  function handleSaveProject(data) {
    if (editingProj) updateProject({ id: editingProj.id, ...data });
    else createProject(data);
    setEditingProj(null);
  }

  function confirmDeleteProject() {
    if (deletingProj) {
      deleteProject(deletingProj.id);
      setDeletingProj(null);
    }
  }

  const sidebarWidth = collapsed && !isMobile ? 48 : isMobile ? 'min(84vw, 320px)' : 'var(--sidebar-w)';

  return (
    <>
      {isMobile && mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 39 }}
        />
      )}

      <aside
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          transition: 'width var(--ease), min-width var(--ease), transform var(--ease)',
          overflow: 'hidden',
          position: isMobile ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          zIndex: isMobile ? 40 : 10,
          transform: isMobile ? 'translateX(0)' : 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed && !isMobile ? 'center' : 'space-between',
            padding: collapsed && !isMobile ? '14px 12px' : '14px 16px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
            height: 'var(--topbar-h)',
          }}
        >
          {(!collapsed || isMobile) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>⬡</span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--accent)',
                }}
              >
                Planit
              </span>
            </div>
          )}
          {collapsed && !isMobile && <span style={{ fontSize: 16 }}>⬡</span>}

          {isMobile ? (
            <button
              onClick={onCloseMobile}
              title="Close menu"
              style={{ background: 'transparent', border: 'none', color: 'var(--text-2)', cursor: 'pointer', fontSize: 16 }}
            >
              ✕
            </button>
          ) : (
            <button
              onClick={() => setCollapsed((c) => !c)}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-3)',
                cursor: 'pointer',
                fontSize: 14,
                padding: '3px 5px',
                borderRadius: 4,
              }}
            >
              {collapsed ? '→' : '←'}
            </button>
          )}
        </div>

        {(!collapsed || isMobile) ? (
          <>
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '12px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <div
                style={{
                  padding: '4px 8px 8px',
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--text-3)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Projects
              </div>

              {projects.length === 0 ? (
                <div style={{ padding: '20px 8px', textAlign: 'center', color: 'var(--text-3)', fontSize: 12, lineHeight: 1.6 }}>
                  No projects yet.
                  <br />
                  Create one to get started.
                </div>
              ) : (
                projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    phases={phases.filter((phase) => phase.projectId === project.id)}
                    tasks={tasks}
                    active={activeProject?.id === project.id}
                    onClick={() => {
                      setActiveProject(project.id);
                      if (isMobile) onCloseMobile?.();
                    }}
                    onEdit={() => setEditingProj(project)}
                    onDelete={() => setDeletingProj(project)}
                  />
                ))
              )}
            </div>

            <div style={{ padding: '10px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
              <div style={{ marginBottom: 8 }}>
                <AuthButton />
              </div>

              <Button
                variant="outline"
                size="sm"
                fullWidth
                icon="+"
                onClick={onOpenCreateModal}
                style={{ cursor: 'pointer' }}
              >
                New Project
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                icon="↓"
                onClick={() => setImportModal(true)}
                style={{ cursor: 'pointer', marginTop: 4 }}
              >
                Import JSON
              </Button>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {projects.map((project) => (
              <button
                key={project.id}
                title={project.name}
                onClick={() => {
                  setActiveProject(project.id);
                  setCollapsed(false);
                }}
                style={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: activeProject?.id === project.id ? project.color + '30' : 'transparent',
                  border: `1px solid ${activeProject?.id === project.id ? project.color + '60' : 'transparent'}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 16,
                }}
              >
                {project.emoji ?? '⬡'}
              </button>
            ))}
            <AuthButton compact />

            <button
              title="New project"
              onClick={() => {
                onOpenCreateModal();
                setCollapsed(false);
              }}
              style={{
                width: 32,
                height: 32,
                marginTop: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: '1px dashed var(--border-mid)',
                borderRadius: 8,
                cursor: 'pointer',
                color: 'var(--text-3)',
                fontSize: 16,
              }}
            >
              +
            </button>
          </div>
        )}
      </aside>

      {createModalOpen && (
        <ProjectModal
          onSave={handleSaveProject}
          onClose={onCloseCreateModal}
        />
      )}
      {editingProj && (
        <ProjectModal
          project={editingProj}
          onSave={handleSaveProject}
          onClose={() => setEditingProj(null)}
        />
      )}
      {importModal && (
        <ImportModal onClose={() => setImportModal(false)} />
      )}
      {deletingProj && (
        <ConfirmModal
          title="Delete project"
          message={`"${deletingProj.name}" and all its phases and tasks will be permanently deleted.`}
          confirmLabel="Delete project"
          onConfirm={confirmDeleteProject}
          onCancel={() => setDeletingProj(null)}
        />
      )}
    </>
  );
}
