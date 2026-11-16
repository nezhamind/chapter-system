import { notFound } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { TASK_SELECT } from "@/lib/queries";
import { signedUrl } from "@/lib/storage";
import { formatDate, isOverdue, cn } from "@/lib/utils";
import { assigneeLabel } from "@/components/task/task-list";
import { StatusBadge } from "@/components/task/status-badge";
import { RealtimeRefresh } from "@/components/task/realtime-refresh";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusButtons } from "./status-buttons";
import { ProofForm } from "./proof-form";
import type { TaskRow } from "@/types";

interface ProofRow {
  id: string;
  file_url: string;
  note: string | null;
  created_at: string;
  uploader: { name: string } | null;
}

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getCurrentProfile();
  const supabase = await createClient();

  const { data } = await supabase.from("tasks").select(TASK_SELECT).eq("id", id).maybeSingle();
  if (!data) notFound();
  const task = data as unknown as TaskRow;

  const { data: proofData } = await supabase
    .from("task_proofs")
    .select("id,file_url,note,created_at,uploader:profiles(name)")
    .eq("task_id", id)
    .order("created_at", { ascending: false });
  const proofs = (proofData ?? []) as unknown as ProofRow[];

  const [attachmentLink, proofLinks] = await Promise.all([
    signedUrl(supabase, "task-attachments", task.attachment_url),
    Promise.all(proofs.map((p) => signedUrl(supabase, "task-proofs", p.file_url))),
  ]);

  const isManager = profile.role === "sekjen" || profile.role === "super_admin";
  const isAssignee =
    task.assigned_to_user_id === profile.id ||
    (profile.divisionId !== null && task.assigned_to_division_id === profile.divisionId);
  const canUpdate = isManager || (isAssignee && profile.role !== "president");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <RealtimeRefresh table="task_proofs" />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <CardTitle className="text-xl">{task.title}</CardTitle>
          <StatusBadge status={task.status} />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="whitespace-pre-wrap text-sm">{task.description || "Tidak ada deskripsi."}</p>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Ditugaskan ke</dt>
              <dd className="font-medium">{assigneeLabel(task)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Dibuat oleh</dt>
              <dd className="font-medium">{task.creator?.name ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Deadline</dt>
              <dd className={cn("font-medium", isOverdue(task.deadline, task.status) && "text-destructive")}>
                {formatDate(task.deadline)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Lampiran</dt>
              <dd className="font-medium">
                {attachmentLink ? (
                  <a href={attachmentLink} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    Buka lampiran
                  </a>
                ) : (
                  "-"
                )}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {canUpdate && (
        <Card>
          <CardHeader>
            <CardTitle>Ubah status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusButtons taskId={task.id} current={task.status} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Bukti kerja</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {proofs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada bukti yang diunggah.</p>
          ) : (
            <ul className="divide-y rounded-md border">
              {proofs.map((p, i) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
                  <div>
                    <p className="font-medium">{p.uploader?.name ?? "-"}</p>
                    {p.note && <p className="text-muted-foreground">{p.note}</p>}
                    <p className="text-xs text-muted-foreground">{formatDate(p.created_at)}</p>
                  </div>
                  {proofLinks[i] && (
                    <a href={proofLinks[i]!} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      Buka file
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
          {canUpdate && <ProofForm taskId={task.id} />}
        </CardContent>
      </Card>
    </div>
  );
}
