"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { logActivity } from "@/lib/log";
import { safeFileName } from "@/lib/utils";

export type FinanceState = { error?: string; success?: string };

const schema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("Nominal harus lebih dari 0"),
  description: z.string().trim().min(3, "Keterangan minimal 3 karakter"),
});

export async function addFinance(_prev: FinanceState, formData: FormData): Promise<FinanceState> {
  const profile = await getCurrentProfile();
  if (profile.role !== "bendahara") return { error: "Hanya Bendahara yang dapat menginput keuangan." };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();

  let proofPath: string | null = null;
  const file = formData.get("proof") as File | null;
  if (file && file.size > 0) {
    const path = `${profile.id}/${Date.now()}-${safeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage.from("finance-proofs").upload(path, file);
    if (uploadError) return { error: `Upload gagal: ${uploadError.message}` };
    proofPath = path;
  }

  const { error } = await supabase.from("finances").insert({
    ...parsed.data,
    proof_url: proofPath,
    created_by: profile.id,
  });
  if (error) return { error: error.message };

  await logActivity(supabase, profile.id, "finance.created", { type: parsed.data.type, amount: parsed.data.amount });
  revalidatePath("/finance");
  revalidatePath("/dashboard");
  revalidatePath("/approvals");
  return { success: "Transaksi tersimpan dan menunggu persetujuan President." };
}
