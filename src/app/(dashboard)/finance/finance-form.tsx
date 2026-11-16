"use client";

import { useActionState } from "react";
import { addFinance, type FinanceState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function FinanceForm() {
  const [state, action, pending] = useActionState<FinanceState, FormData>(addFinance, {});

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="type">Jenis</Label>
        <Select id="type" name="type" defaultValue="income">
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Nominal (Rp)</Label>
        <Input id="amount" name="amount" type="number" min="1" step="any" required />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="description">Keterangan</Label>
        <Input id="description" name="description" required />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="proof">Bukti / nota (opsional)</Label>
        <Input id="proof" name="proof" type="file" />
      </div>
      <div className="space-y-2 sm:col-span-2">
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        {state.success && <p className="text-sm text-emerald-700">{state.success}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan transaksi"}
        </Button>
      </div>
    </form>
  );
}
