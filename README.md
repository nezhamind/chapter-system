# Chapter System

Sistem Informasi Komunitas dengan RBAC (6 role), manajemen tugas (jobdesk), keuangan, dan analitik.
Stack: Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase, Zustand.

## Isi paket

| Berkas | Fungsi |
|---|---|
| `chapter-system.zip` (ini) | Seluruh kode aplikasi |
| `schema.sql` (terpisah) | Database lengkap: tabel, RLS, trigger, storage, realtime |

## Cara pasang (4 langkah)

### 1. Siapkan database di Supabase
1. Buat project baru di https://supabase.com.
2. Buka **SQL Editor, New query**, tempel seluruh isi `schema.sql`, lalu klik **Run**. Cukup sekali.
3. Buka **Settings, API**, salin **Project URL** dan **anon public key**.
4. (Disarankan saat uji coba) **Authentication, Providers, Email**: matikan *Confirm email* agar akun langsung aktif.

### 2. Isi konfigurasi
Salin `.env.example` menjadi `.env.local`, lalu isi dua nilainya:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=isi-anon-key
```

### 3. Jalankan di komputer
```bash
npm install
npm run dev
```
Buka http://localhost:3000.

### 4. Buat akun
- Di Supabase: **Authentication, Users, Add user**, centang *Auto Confirm User*.
- **Akun pertama otomatis menjadi Super Admin.**
- Login sebagai Super Admin, buka menu **Pengguna & Role**, lalu atur role dan divisi akun lainnya
  (Sekjen, President, Bendahara, Kepala Divisi, Anggota).

## Upload ke internet (Vercel)
1. Unggah folder proyek ini ke GitHub (jangan sertakan `.env.local`, sudah ada di `.gitignore`).
2. Di https://vercel.com: **Add New, Project**, pilih repository tersebut.
3. Di **Environment Variables**, isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Klik **Deploy**.

## Fitur per role

| Role | Akses |
|---|---|
| Super Admin | Pengguna & role, divisi, semua tugas, log sistem |
| President | Analitik, semua jobdesk (hanya lihat), persetujuan keuangan |
| Sekjen | Buat tugas, ringkasan tugas (status realtime) |
| Bendahara | Input pemasukan/pengeluaran, unggah nota |
| Kepala Divisi & Anggota | Tugas saya, ubah status, unggah bukti kerja |

## Struktur folder
```
src/
├── app/
│   ├── (auth)/login            Halaman login + aksi login/logout
│   └── (dashboard)/            Semua halaman setelah login (sidebar sesuai role)
│       ├── dashboard, tasks, tasks/new, tasks/[id], my-tasks
│       ├── finance, approvals, analytics
│       └── users, divisions, logs
├── components/ (ui, layout, task)
├── config/navigation.ts        Menu per role
├── lib/                        Supabase client, auth, izin, util
├── stores/ui-store.ts          Zustand (sidebar mobile)
└── middleware.ts               Proteksi rute (wajib login)
```

## Catatan
- Zona waktu deadline default WIB. Ubah `TZ` dan `TZ_OFFSET` di `src/lib/utils.ts` untuk WITA/WIT.
- Keamanan utama ada di database (RLS + trigger), bukan hanya di tampilan.
- Persetujuan *proposal program* (disebut di spesifikasi awal) belum ada tabelnya; bisa ditambahkan sebagai langkah lanjutan.
