import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { signedUrl } from "@/lib/storage";
import { summarize, type FinanceRow } from "@/lib/finance";
import { formatDate, formatRupiah, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinanceForm } from "./finance-form";

const approvalStyle = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};
const approvalLabel = { pending: "Menunggu", approved: "Disetujui", rejected: "Ditolak" };

export default async function FinancePage() {
  const profile = await requireRole(["bendahara", "president", "super_admin"]);
  const supabase = await createClient();

  const { data } = await supabase
    .from("finances")
    .select("id,type,amount,description,proof_url,approval,created_at,creator:profiles!finances_created_by_fkey(name)")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as unknown as FinanceRow[];
  const sum = summarize(rows);
  const links = await Promise.all(rows.map((r) => signedUrl(supabase, "finance-proofs", r.proof_url)));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-semibold">Keuangan</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Pemasukan", sum.income],
          ["Pengeluaran", sum.expense],
          ["Saldo kas", sum.balance],
        ].map(([label, value]) => (
          <Card key={label as string}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-1 text-2xl font-semibold">{formatRupiah(value as number)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {profile.role === "bendahara" && (
        <Card>
          <CardHeader>
            <CardTitle>Tambah transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <FinanceForm />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Riwayat transaksi</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada transaksi.</p>
          ) : (
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="py-2">Tanggal</th>
                  <th>Keterangan</th>
                  <th>Jumlah</th>
                  <th>Status</th>
                  <th>Bukti</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((r, i) => (
                  <tr key={r.id}>
                    <td className="py-2">{formatDate(r.created_at)}</td>
                    <td>{r.description}</td>
                    <td className={cn("font-medium", r.type === "income" ? "text-emerald-700" : "text-red-700")}>
                      {r.type === "income" ? "+" : "-"} {formatRupiah(Number(r.amount))}
                    </td>
                    <td>
                      <Badge className={approvalStyle[r.approval]}>{approvalLabel[r.approval]}</Badge>
                    </td>
                    <td>
                      {links[i] ? (
                        <a href={links[i]!} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                          Buka
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
