import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatRupiah } from "@/lib/utils";
import type { FinanceRow } from "@/lib/finance";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { decideFinance } from "./actions";

export default async function ApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole(["president"]);
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data } = await supabase
    .from("finances")
    .select("id,type,amount,description,approval,created_at,creator:profiles!finances_created_by_fkey(name)")
    .eq("approval", "pending")
    .order("created_at", { ascending: true });
  const rows = (data ?? []) as unknown as FinanceRow[];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Persetujuan</h1>
        <p className="text-sm text-muted-foreground">Transaksi keuangan yang menunggu keputusan President.</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {rows.length === 0 ? (
        <p className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
          Tidak ada yang perlu disetujui.
        </p>
      ) : (
        rows.map((r) => (
          <Card key={r.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-medium">{r.description}</p>
                <p className="text-sm text-muted-foreground">
                  {r.type === "income" ? "Pemasukan" : "Pengeluaran"} · {formatRupiah(Number(r.amount))} · oleh{" "}
                  {r.creator?.name ?? "-"} · {formatDate(r.created_at)}
                </p>
              </div>
              <form action={decideFinance} className="flex gap-2">
                <input type="hidden" name="id" value={r.id} />
                <Button name="decision" value="approved" size="sm">Setujui</Button>
                <Button name="decision" value="rejected" size="sm" variant="destructive">Tolak</Button>
              </form>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
