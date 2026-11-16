import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, RoleName } from "@/types";

export const getCurrentProfile = cache(async (): Promise<Profile> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, division_id, roles(role_name), divisions(division_name)")
    .eq("id", user.id)
    .single();

  if (error || !data) redirect("/login");

  const role = data.roles as unknown as { role_name: RoleName };
  const division = data.divisions as unknown as { division_name: string } | null;

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: role.role_name,
    divisionId: data.division_id,
    divisionName: division?.division_name ?? null,
  };
});

/** Pakai di awal halaman/aksi yang dibatasi role tertentu. */
export async function requireRole(allowed: RoleName[]) {
  const profile = await getCurrentProfile();
  if (!allowed.includes(profile.role)) redirect("/dashboard");
  return profile;
}
