import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface LogRow {
  id: number;
  action: string;
  detail: Record<string, unknown> | null;
  created_at: string;
  user: { name: string } | null;
}

export default async function LogsPage() {
  await requireRole(["super_admin"]);
  const supabase = await createClient();

  const { data } = await supabase
    .from("activity_logs")
    .select("id,action,detail,created_at,user:profiles(name)")
    .order("created_at", { ascending: false })
    .limit(100);
  const logs = (data ?? []) as unknown as LogRow[];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">Log Sistem</h1>
      <Card>
        <CardContent className="divide-y p-0">
          {logs.length === 0 && <p className="p-4 text-sm text-muted-foreground">Belum ada aktivitas.</p>}
          {logs.map((l) => (
            <div key={l.id} className="space-y-1 p-4 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="font-medium">{l.action}</span>
                <span className="text-muted-foreground">{formatDate(l.created_at)}</span>
              </div>
              <p className="text-muted-foreground">oleh {l.user?.name ?? "sistem"}</p>
              {l.detail && <pre className="overflow-x-auto rounded bg-muted p-2 text-xs">{JSON.stringify(l.detail)}</pre>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
