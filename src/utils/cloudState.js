import { supabase } from "../lib/supabaseClient";

export async function loadCloudState(userId) {
  const { data, error } = await supabase
    .from("user_states")
    .select("state")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data?.state ?? null;
}

export async function saveCloudState(userId, state) {
  const { error } = await supabase
    .from("user_states")
    .upsert({ user_id: userId, state, updated_at: new Date().toISOString() });

  if (error) throw error;
}