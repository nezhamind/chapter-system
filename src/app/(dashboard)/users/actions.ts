"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { logActivity } from "@/lib/log";
import { fail } from "@/lib/redirect";

export async function updateUser(formData: FormData) {
  const profile = await getCurrentProfile();
  if (profile.role !== "super_admin") fail("/users", "Hanya Super Admin yang dapat mengubah pengguna.");

  const id = String(formData.get("id") ?? "");
  const roleId = Number(formData.get("roleId"));
  const divisionRaw = String(formData.get("divisionId") ?? "");
  const divisionId = divisionRaw ? Number(divisionRaw) : null;
  if (!id || !roleId) fail("/users", "Data tidak valid.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ role_id: roleId, division_id: divisionId })
    .eq("id", id)
    .select("id");

  if (error) fail("/users", error.message);
  if (!data?.length) fail("/users", "Pengguna tidak ditemukan.");

  await logActivity(supabase, profile.id, "user.updated", { id, roleId, divisionId });
  revalidatePath("/users");
}
