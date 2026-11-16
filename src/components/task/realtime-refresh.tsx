"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/** Memuat ulang data halaman saat tabel berubah (Supabase Realtime). */
export function RealtimeRefresh({ table = "tasks" }: { table?: string }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`realtime-${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => router.refresh())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, table]);

  return null;
}
