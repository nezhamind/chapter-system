import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { TaskForm } from "./task-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewTaskPage() {
  await requireRole(["sekjen", "super_admin"]);
  const supabase = await createClient();

  const { data: divisions } = await supabase
    .from("divisions")
    .select("id, division_name")
    .order("division_name");

  const { data: people } = await supabase
    .from("profiles")
    .select("id, name, divisions(division_name), roles!inner(role_name)")
    .in("roles.role_name", ["anggota", "kepala_divisi"])
    .order("name");

  const members = (people ?? []).map((p) => ({
    id: p.id as string,
    name: p.name as string,
    division_name: (p.divisions as unknown as { division_name: string } | null)?.division_name ?? null,
  }));

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Buat Tugas</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm divisions={divisions ?? []} members={members} />
        </CardContent>
      </Card>
    </div>
  );
}
