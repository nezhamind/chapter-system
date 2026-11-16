import type { SupabaseClient } from "@supabase/supabase-js";

export async function signedUrl(supabase: SupabaseClient, bucket: string, path: string | null) {
  if (!path) return null;
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
}
