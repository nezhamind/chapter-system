import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { RealtimeRefresh } from "@/components/task/realtime-refresh";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isOverdue } from "@/lib/utils";

interface T {
  status: string;
  deadline: string | null;
  assigned_to_division_id: number | null;
  assignee: { division_id: number | null } | null;
}

export default async function AnalyticsPage() {
  await requireRole(["president", "super_admin"]);
  const supabase = await createClient();

  const [{ data: taskData }, { data: divisions }] = await Promise.all([
    supabase
      .from("tasks")
      .select("status,deadline,assigned_to_division_id,assignee:profiles!tasks_assigned_to_user_id_fkey(division_id)"),
    supabase.from("divisions").select("id,division_name").order("division_name"),
  ]);
  const tasks = (taskData ?? []) as unknown as T[];

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const overdue = tasks.filter((t) => isOverdue(t.deadline, t.status)).length;
  const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

  const perDivision = (divisions ?? []).map((d) => {
    const mine = tasks.filter((t) => (t.assigned_to_division_id ?? t.assignee?.division_id) === d.id);
    const d_done = mine.filter((t) => t.status === "done").length;
    return { name: d.division_name as string, total: mine.length, done: d_done, rate: pct(d_done, mine.length) };
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <RealtimeRefresh table="tasks" />
      <h1 className="text-2xl font-semibold">Analitik</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Tingkat penyelesaian", `${pct(done, total)}%`],
          ["Tugas selesai", `${done} / ${total}`],
          ["Lewat deadline", String(overdue)],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-1 text-2xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Penyelesaian per divisi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {perDivision.map((d) => (
            <div key={d.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{d.name}</span>
                <span className="text-muted-foreground">
                  {d.done}/{d.total} tugas · {d.rate}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary" style={{ width: `${d.rate}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
