"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { logActivity } from "@/lib/log";
import { fail } from "@/lib/redirect";

export async function addDivision(formData: FormData) {
  const profile = await getCurrentProfile();
  if (profile.role !== "super_admin") fail("/divisions", "Hanya Super Admin yang dapat menambah divisi.");

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) fail("/divisions", "Nama divisi minimal 2 karakter.");

  const supabase = await createClient();
  const { error } = await supabase.from("divisions").insert({ division_name: name });
  if (error) fail("/divisions", error.code === "23505" ? "Nama divisi sudah ada." : error.message);

  await logActivity(supabase, profile.id, "division.created", { name });
  revalidatePath("/divisions");
}
