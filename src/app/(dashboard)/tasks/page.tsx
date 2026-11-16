import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { TASK_SELECT } from "@/lib/queries";
import { canCreateTasks } from "@/lib/permissions";
import { TaskList } from "@/components/task/task-list";
import { RealtimeRefresh } from "@/components/task/realtime-refresh";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STATUSES, statusLabels, type TaskRow } from "@/types";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const profile = await requireRole(["sekjen", "president", "super_admin"]);
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("tasks").select(TASK_SELECT).order("created_at", { ascending: false });
  const filter = STATUSES.find((s) => s === status);
  if (filter) query = query.eq("status", filter);

  const { data } = await query;
  const tasks = (data ?? []) as unknown as TaskRow[];

  const tabs = [{ key: undefined, label: "Semua" }, ...STATUSES.map((s) => ({ key: s, label: statusLabels[s] }))];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <RealtimeRefresh table="tasks" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Ringkasan Tugas</h1>
          <p className="text-sm text-muted-foreground">
            Status diperbarui otomatis saat anggota mengubahnya.
            {profile.role === "president" && " (Hanya lihat)"}
          </p>
        </div>
        {canCreateTasks(profile.role) && (
          <Link href="/tasks/new">
            <Button>Buat Tugas</Button>
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.label}
            href={t.key ? `/tasks?status=${t.key}` : "/tasks"}
            className={cn(
              "rounded-full border px-3 py-1 text-sm",
              filter === t.key ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <TaskList tasks={tasks} />
    </div>
  );
}
