import { useState } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/hooks/useAppStore";
import { AuthButton } from "@/components/auth/AuthButton";

export function Sidebar() {
  const {
    state,
    activeProject,
    setActiveProject,
    createProject,
    updateProject,
    deleteProject,
  } = useAppStore();

  const { projects, phases, tasks } = state;

  const [createModal, setCreateModal] = useState(false);
  const [editingProj, setEditingProj] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  function handleSaveProject(data) {
    if (editingProj) updateProject({ id: editingProj.id, ...data });
    else createProject(data);
    setEditingProj(null);
  }

  function handleDeleteProject(project) {
    if (window.confirm(`Delete "${project.name}" and all its data?`)) {
      deleteProject(project.id);
    }
  }

  return (
    <>
      <aside
        style={{
          width: collapsed ? 48 : "var(--sidebar-w)",
          minWidth: collapsed ? 48 : "var(--sidebar-w)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          transition: "width var(--ease), min-width var(--ease)",
          overflow: "hidden",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            padding: collapsed ? "14px 12px" : "14px 16px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
            height: "var(--topbar-h)",
          }}
        >
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>⬡</span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--accent)",
                  letterSpacing: "0.02em",
                }}
              >
                Planit
              </span>
            </div>
          )}
          {collapsed && <span style={{ fontSize: 16 }}>⬡</span>}
          <button
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-3)",
              cursor: "pointer",
              fontSize: 14,
              padding: "3px 5px",
              borderRadius: 4,
              transition: "color var(--ease)",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-3)")
            }
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {!collapsed && (
          <>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "12px 10px",
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <div
                style={{
                  padding: "4px 8px 8px",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--text-3)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Projects
              </div>

              {projects.length === 0 ? (
                <div
                  style={{
                    padding: "20px 8px",
                    textAlign: "center",
                    color: "var(--text-3)",
                    fontSize: 12,
                    lineHeight: 1.6,
                  }}
                >
                  No projects yet.
                  <br />
                  Create one to get started.
                </div>
              ) : (
                projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    phases={phases.filter((p) => p.projectId === project.id)}
                    tasks={tasks}
                    active={activeProject?.id === project.id}
                    onClick={() => setActiveProject(project.id)}
                    onEdit={() => setEditingProj(project)}
                    onDelete={() => handleDeleteProject(project)}
                  />
                ))
              )}
            </div>

            <div
              style={{
                padding: "10px",
                borderTop: "1px solid var(--border)",
                flexShrink: 0,
              }}
            >
              <div style={{ marginBottom: 8}}>
                <AuthButton />
              </div>

              <Button
                variant="outline"
                size="sm"
                fullWidth
                icon="+"
                onClick={() => setCreateModal(true)}
                style={{ cursor: "pointer" }}
              >
                New Project
              </Button>
            </div>
          </>
        )}

        {collapsed && (
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "8px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            {projects.map((p) => (
              <button
                key={p.id}
                title={p.name}
                onClick={() => {
                  setActiveProject(p.id);
                  setCollapsed(false);
                }}
                style={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    activeProject?.id === p.id ? p.color + "30" : "transparent",
                  border: `1px solid ${activeProject?.id === p.id ? p.color + "60" : "transparent"}`,
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 16,
                  transition: "all var(--ease)",
                }}
              >
                {p.emoji ?? "⬡"}
              </button>
            ))}
            <AuthButton compact />

            <button
              title="New project"
              onClick={() => {
                setCreateModal(true);
                setCollapsed(false);
              }}
              style={{
                width: 32,
                height: 32,
                marginTop: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "1px dashed var(--border-mid)",
                borderRadius: 8,
                cursor: "pointer",
                color: "var(--text-3)",
                fontSize: 16,
                transition: "all var(--ease)",
              }}
            >
              +
            </button>
          </div>
        )}
      </aside>

      {createModal && (
        <ProjectModal
          onSave={handleSaveProject}
          onClose={() => setCreateModal(false)}
        />
      )}
      {editingProj && (
        <ProjectModal
          project={editingProj}
          onSave={handleSaveProject}
          onClose={() => setEditingProj(null)}
        />
      )}
    </>
  );
}
