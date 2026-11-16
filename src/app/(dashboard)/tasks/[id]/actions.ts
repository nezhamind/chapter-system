"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { logActivity } from "@/lib/log";
import { safeFileName } from "@/lib/utils";
import { STATUSES, type TaskStatus } from "@/types";

export type ActionState = { error?: string; success?: string };

function refresh(taskId: string) {
  revalidatePath(`/tasks/${taskId}`);
  revalidatePath("/tasks");
  revalidatePath("/my-tasks");
  revalidatePath("/dashboard");
}

export async function updateTaskStatus(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await getCurrentProfile();
  const taskId = String(formData.get("taskId") ?? "");
  const status = STATUSES.find((s) => s === formData.get("status")) as TaskStatus | undefined;
  if (!taskId || !status) return { error: "Status tidak valid." };

  const supabase = await createClient();
  const { data, error } = await supabase.from("tasks").update({ status }).eq("id", taskId).select("id");
  if (error) return { error: error.message };
  if (!data?.length) return { error: "Kamu tidak punya izin mengubah tugas ini." };

  await logActivity(supabase, profile.id, "task.status_changed", { taskId, status });
  refresh(taskId);
  return { success: "Status diperbarui." };
}

export async function uploadProof(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await getCurrentProfile();
  const taskId = String(formData.get("taskId") ?? "");
  const note = String(formData.get("note") ?? "").trim() || null;
  const file = formData.get("file") as File | null;

  if (!taskId) return { error: "Tugas tidak ditemukan." };
  if (!file || file.size === 0) return { error: "Pilih file bukti kerja terlebih dahulu." };

  const supabase = await createClient();
  const path = `${taskId}/${profile.id}/${Date.now()}-${safeFileName(file.name)}`;
  const { error: uploadError } = await supabase.storage.from("task-proofs").upload(path, file);
  if (uploadError) return { error: `Upload gagal: ${uploadError.message}` };

  const { error } = await supabase
    .from("task_proofs")
    .insert({ task_id: taskId, uploaded_by: profile.id, file_url: path, note });
  if (error) return { error: error.message };

  await logActivity(supabase, profile.id, "task.proof_uploaded", { taskId });
  refresh(taskId);
  return { success: "Bukti kerja berhasil diunggah." };
}
