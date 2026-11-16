export interface FinanceRow {
  id: string;
  type: "income" | "expense";
  amount: number | string;
  description: string | null;
  proof_url: string | null;
  approval: "pending" | "approved" | "rejected";
  created_at: string;
  creator?: { name: string } | null;
}

/** Ringkasan kas: entri yang ditolak tidak dihitung. */
export function summarize(rows: FinanceRow[]) {
  let income = 0;
  let expense = 0;
  for (const r of rows) {
    if (r.approval === "rejected") continue;
    const n = Number(r.amount);
    if (r.type === "income") income += n;
    else expense += n;
  }
  return { income, expense, balance: income - expense };
}
