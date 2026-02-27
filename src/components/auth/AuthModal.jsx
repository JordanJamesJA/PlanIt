import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/Button";

export function AuthModal({ open, onClose, onAuthed }) {
  const [mode, setMode] = useState("signin"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setStatus("");
      setLoading(false);
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setStatus("Account created. You can sign in now.");
        setMode("signin");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuthed?.(data.session);
        onClose?.();
      }
    } catch (err) {
      setStatus(err?.message ?? "Auth error");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
      }}
    >
      <div
        style={{
          width: "min(420px, 100%)",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 16,
          boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18 }}>
              {mode === "signin" ? "Sign in" : "Create account"}
            </div>
            <div style={{ color: "var(--text-3)", fontSize: 12, marginTop: 2 }}>
              Sync your projects across devices.
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-3)",
              fontSize: 18,
              lineHeight: 1,
              padding: 6,
              borderRadius: 8,
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button
            onClick={() => setMode("signin")}
            style={tabStyle(mode === "signin")}
            type="button"
          >
            Sign in
          </button>
          <button
            onClick={() => setMode("signup")}
            style={tabStyle(mode === "signup")}
            type="button"
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, marginTop: 14 }}>
          <label style={labelStyle}>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@email.com"
              style={inputStyle}
              required
            />
          </label>

          <label style={labelStyle}>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder="••••••••"
              style={inputStyle}
              required
              minLength={6}
            />
            <div style={{ color: "var(--text-3)", fontSize: 11, marginTop: 4 }}>
              Minimum 6 characters.
            </div>
          </label>

          {status ? (
            <div style={{ color: status.toLowerCase().includes("error") ? "tomato" : "var(--text-2)", fontSize: 12 }}>
              {status}
            </div>
          ) : null}

          <Button type="submit" disabled={loading}>
            {loading ? "Working..." : mode === "signin" ? "Sign in" : "Create account"}
          </Button>

          <div style={{ color: "var(--text-3)", fontSize: 11, lineHeight: 1.4 }}>
            By continuing, you’ll store your plans in the cloud. Your data is protected by Supabase Row Level Security.
          </div>
        </form>
      </div>
    </div>
  );
}

function tabStyle(active) {
  return {
    flex: 1,
    padding: "8px 10px",
    borderRadius: 10,
    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
    background: active ? "var(--accent-10)" : "transparent",
    color: active ? "var(--text)" : "var(--text-2)",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 12,
  };
}

const labelStyle = {
  display: "grid",
  gap: 6,
  fontSize: 12,
  color: "var(--text-2)",
  fontWeight: 600,
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--surface-2)",
  color: "var(--text)",
  outline: "none",
};