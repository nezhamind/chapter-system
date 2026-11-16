import { redirect } from "next/navigation";

/** Kembali ke halaman dengan pesan error (tampil lewat ?error=...). */
export function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}
