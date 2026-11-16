"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { canCreateTasks } from "@/lib/permissions";
import { logActivity } from "@/lib/log";
import { safeFileName, TZ_OFFSET } from "@/lib/utils";

export type TaskFormState = { error?: string };

const schema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  deadline: z.string().min(1, "Deadline wajib diisi"),
  assignType: z.enum(["division", "user"]),
  divisionId: z.string().optional(),
  userId: z.string().optional(),
});

export async function createTask(_prev: TaskFormState, formData: FormData): Promise<TaskFormState> {
  const profile = await getCurrentProfile();
  if (!canCreateTasks(profile.role)) return { error: "Kamu tidak punya izin membuat tugas." };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { title, description, deadline, assignType, divisionId, userId } = parsed.data;

  if (assignType === "division" && !divisionId) return { error: "Pilih divisi tujuan." };
  if (assignType === "user" && !userId) return { error: "Pilih anggota tujuan." };

  const deadlineDate = new Date(`${deadline.slice(0, 16)}${TZ_OFFSET}`);
  if (Number.isNaN(deadlineDate.getTime())) return { error: "Format deadline tidak valid." };

  const supabase = await createClient();

  let attachmentPath: string | null = null;
  const file = formData.get("attachment") as File | null;
  if (file && file.size > 0) {
    const path = `${profile.id}/${Date.now()}-${safeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage.from("task-attachments").upload(path, file);
    if (uploadError) return { error: `Upload gagal: ${uploadError.message}` };
    attachmentPath = path;
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title,
      description,
      deadline: deadlineDate.toISOString(),
      created_by: profile.id,
      attachment_url: attachmentPath,
      assigned_to_division_id: assignType === "division" ? Number(divisionId) : null,
      assigned_to_user_id: assignType === "user" ? userId : null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await logActivity(supabase, profile.id, "task.created", { taskId: data.id, title });
  revalidatePath("/tasks");
  redirect("/tasks");
}
