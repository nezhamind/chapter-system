"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { logActivity } from "@/lib/log";
import { fail } from "@/lib/redirect";

export async function decideFinance(formData: FormData) {
  const profile = await getCurrentProfile();
  if (profile.role !== "president") fail("/approvals", "Hanya President yang dapat menyetujui.");

  const id = String(formData.get("id") ?? "");
  const decision = formData.get("decision");
  if (!id || (decision !== "approved" && decision !== "rejected")) fail("/approvals", "Data tidak valid.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("finances")
    .update({ approval: decision, approved_by: profile.id })
    .eq("id", id)
    .select("id");

  if (error) fail("/approvals", error.message);
  if (!data?.length) fail("/approvals", "Transaksi tidak ditemukan atau tidak ada izin.");

  await logActivity(supabase, profile.id, `finance.${decision}`, { id });
  revalidatePath("/approvals");
  revalidatePath("/finance");
  revalidatePath("/dashboard");
}
