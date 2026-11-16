import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chapter System",
  description: "Sistem Informasi Komunitas: manajemen tugas, keuangan, dan role",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
