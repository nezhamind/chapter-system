import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { canViewAllTasks } from "@/lib/permissions";
import { TASK_SELECT } from "@/lib/queries";
import { summarize, type FinanceRow } from "@/lib/finance";
import { formatRupiah } from "@/lib/utils";
import { roleLabels } from "@/config/navigation";
import { TaskList } from "@/components/task/task-list";
import { RealtimeRefresh } from "@/components/task/realtime-refresh";
import { Card, CardContent } from "@/components/ui/card";
import type { TaskRow } from "@/types";

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  const supabase = await createClient();
  const overview = canViewAllTasks(profile.role);

  const { data } = await supabase
    .from("tasks")
    .select(TASK_SELECT)
    .order("deadline", { ascending: true, nullsFirst: false });
  const tasks = (data ?? []) as unknown as TaskRow[];

  const count = (s: string) => tasks.filter((t) => t.status === s).length;
  const done = count("done");
  const rate = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const upcoming = tasks.filter((t) => t.status !== "done").slice(0, 5);

  let finance: ReturnType<typeof summarize> | null = null;
  let pendingApprovals = 0;
  if (profile.role === "bendahara" || profile.role === "president") {
    const { data: fin } = await supabase.from("finances").select("id,type,amount,approval");
    const rows = (fin ?? []) as unknown as FinanceRow[];
    finance = summarize(rows);
    pendingApprovals = rows.filter((r) => r.approval === "pending").length;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {overview && <RealtimeRefresh table="tasks" />}

      <div>
        <h1 className="text-2xl font-semibold">Halo, {profile.name}</h1>
        <p className="text-sm text-muted-foreground">
          {roleLabels[profile.role]}
          {profile.divisionName ? ` · Divisi ${profile.divisionName}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label={overview ? "Total tugas" : "Tugas saya"} value={tasks.length} />
        <Stat label="To-Do" value={count("todo")} />
        <Stat label="In Progress" value={count("in_progress")} />
        <Stat label="Done" value={done} hint={`${rate}% selesai`} />
      </div>

      {finance && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Pemasukan" value={formatRupiah(finance.income)} />
          <Stat label="Pengeluaran" value={formatRupiah(finance.expense)} />
          <Stat label="Saldo kas" value={formatRupiah(finance.balance)} />
          <Stat label="Menunggu persetujuan" value={pendingApprovals} />
        </div>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{overview ? "Tugas terdekat" : "Tugas yang perlu dikerjakan"}</h2>
          <Link href={overview ? "/tasks" : "/my-tasks"} className="text-sm text-primary hover:underline">
            Lihat semua
          </Link>
        </div>
        <TaskList tasks={upcoming} empty="Tidak ada tugas yang menunggu. 🎉" />
      </section>
    </div>
  );
}
