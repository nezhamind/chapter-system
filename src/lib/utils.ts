import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// Zona waktu komunitas (WIB). Ubah jika perlu (WITA: Asia/Makassar, +08:00).
export const TZ = "Asia/Jakarta";
export const TZ_OFFSET = "+07:00";

export function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: TZ,
  }).format(new Date(value));
}

export function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export const safeFileName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "_");

export function isOverdue(deadline: string | null, status: string) {
  return !!deadline && status !== "done" && new Date(deadline).getTime() < Date.now();
}
