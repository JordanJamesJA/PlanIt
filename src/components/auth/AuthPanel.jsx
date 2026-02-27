import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AuthPanel({ onSession }) {
  const [mode, setMode] = useState("signin"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      onSession?.(data.session ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      onSession?.(newSession ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, [onSession]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setStatus("Signed up. You can sign in now.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setStatus("Signed in.");
      }
    } catch (err) {
      setStatus(err?.message ?? "Auth error");
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (session?.user) {
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span>Signed in as {session.user.email}</span>
        <button onClick={signOut}>Sign out</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 360 }}>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => setMode("signin")} disabled={mode === "signin"}>
            Sign in
          </button>
          <button type="button" onClick={() => setMode("signup")} disabled={mode === "signup"}>
            Sign up
          </button>
        </div>

        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
        <button type="submit">{mode === "signup" ? "Create account" : "Sign in"}</button>
        {status ? <small>{status}</small> : null}
      </form>
    </div>
  );
}