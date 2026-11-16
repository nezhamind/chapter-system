import type { SupabaseClient } from "@supabase/supabase-js";

export async function logActivity(
  supabase: SupabaseClient,
  userId: string,
  action: string,
  detail?: Record<string, unknown>
) {
  await supabase.from("activity_logs").insert({ user_id: userId, action, detail: detail ?? null });
}
