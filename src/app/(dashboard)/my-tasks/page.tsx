import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { TASK_SELECT } from "@/lib/queries";
import { TaskList } from "@/components/task/task-list";
import { STATUSES, statusLabels, type TaskRow } from "@/types";

export default async function MyTasksPage() {
  await getCurrentProfile();
  const supabase = await createClient();

  // RLS memastikan hanya tugas untuk saya / divisi saya yang muncul
  const { data } = await supabase
    .from("tasks")
    .select(TASK_SELECT)
    .order("deadline", { ascending: true, nullsFirst: false });
  const tasks = (data ?? []) as unknown as TaskRow[];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tugas Saya</h1>
        <p className="text-sm text-muted-foreground">Klik tugas untuk mengubah status dan mengunggah bukti kerja.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {STATUSES.map((s) => {
          const list = tasks.filter((t) => t.status === s);
          return (
            <section key={s} className="space-y-3">
              <h2 className="font-semibold">
                {statusLabels[s]} <span className="text-sm font-normal text-muted-foreground">({list.length})</span>
              </h2>
              <TaskList tasks={list} empty="Kosong" />
            </section>
          );
        })}
      </div>
    </div>
  );
}
