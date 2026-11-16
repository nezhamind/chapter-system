import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { roleLabels } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { RoleName } from "@/types";
import { updateUser } from "./actions";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(["super_admin"]);
  const { error } = await searchParams;
  const supabase = await createClient();

  const [{ data: users }, { data: roles }, { data: divisions }] = await Promise.all([
    supabase.from("profiles").select("id,name,email,role_id,division_id").order("name"),
    supabase.from("roles").select("id,role_name").order("id"),
    supabase.from("divisions").select("id,division_name").order("division_name"),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pengguna & Role</h1>
        <p className="text-sm text-muted-foreground">
          Akun baru dibuat di Supabase (Authentication → Users), lalu atur role dan divisinya di sini.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Card>
        <CardContent className="divide-y p-0">
          {(users ?? []).map((u) => (
            <form key={u.id} action={updateUser} className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
              <input type="hidden" name="id" value={u.id} />
              <div className="min-w-0 lg:w-1/3">
                <p className="truncate font-medium">{u.name}</p>
                <p className="truncate text-sm text-muted-foreground">{u.email}</p>
              </div>
              <Select name="roleId" defaultValue={u.role_id} className="lg:w-48">
                {(roles ?? []).map((r) => (
                  <option key={r.id} value={r.id}>
                    {roleLabels[r.role_name as RoleName] ?? r.role_name}
                  </option>
                ))}
              </Select>
              <Select name="divisionId" defaultValue={u.division_id ?? ""} className="lg:w-40">
                <option value="">Tanpa divisi</option>
                {(divisions ?? []).map((d) => (
                  <option key={d.id} value={d.id}>{d.division_name}</option>
                ))}
              </Select>
              <Button size="sm" type="submit">Simpan</Button>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
