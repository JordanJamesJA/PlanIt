import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/Button";
import { AuthModal } from "./AuthModal";

export function AuthButton({ compact = false }) {
  const [session, setSession] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession ?? null);
      },
    );

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (compact) {
    const initial = session?.user?.email?.[0]?.toUpperCase() ?? "↪";
    return (
      <>
        <button
          title={session?.user?.email ?? "Account"}
          onClick={() => setOpen(true)}
          style={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "1px solid var(--border-mid)",
            borderRadius: 8,
            cursor: "pointer",
            color: "var(--text-3)",
            fontSize: 16,
            transition: "all var(--ease)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
        >
          {initial}
        </button>

        <AuthModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <>
      {session?.user ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "var(--text-3)" }}>
            {session.user.email}
          </span>
          <Button size="sm" variant="outline" onClick={handleSignOut} style={{ cursor: "pointer" }}>
            Sign out
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setOpen(true)}
          fullWidth
          style={{ cursor: "pointer" }}
        >
          Sign in
        </Button>
      )}

      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
