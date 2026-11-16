"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md space-y-3 py-20 text-center">
      <h2 className="text-lg font-semibold">Terjadi kesalahan</h2>
      <p className="text-sm text-muted-foreground">
        Halaman tidak bisa dimuat. Pastikan SQL sudah dijalankan di Supabase dan file .env.local sudah benar.
      </p>
      <Button onClick={reset}>Coba lagi</Button>
    </div>
  );
}
