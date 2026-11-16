import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addDivision } from "./actions";

export default async function DivisionsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(["super_admin"]);
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: divisions } = await supabase.from("divisions").select("id,division_name").order("division_name");

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Divisi</h1>
      {error && <p className="text-sm text-destructive">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Tambah divisi</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addDivision} className="flex gap-2">
            <Input name="name" placeholder="Nama divisi" required />
            <Button type="submit">Tambah</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="divide-y p-0">
          {(divisions ?? []).map((d) => (
            <p key={d.id} className="p-4 text-sm font-medium">{d.division_name}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
