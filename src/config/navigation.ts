import {
  LayoutDashboard,
  ClipboardList,
  PlusSquare,
  Wallet,
  CheckSquare,
  BarChart3,
  Users,
  Building2,
  ScrollText,
  ListTodo,
  type LucideIcon,
} from "lucide-react";
import type { RoleName } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const dashboard: NavItem = { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard };
const myTasks: NavItem = { label: "Tugas Saya", href: "/my-tasks", icon: ListTodo };

export const navigationByRole: Record<RoleName, NavItem[]> = {
  super_admin: [
    dashboard,
    { label: "Pengguna & Role", href: "/users", icon: Users },
    { label: "Divisi", href: "/divisions", icon: Building2 },
    { label: "Semua Tugas", href: "/tasks", icon: ClipboardList },
    { label: "Log Sistem", href: "/logs", icon: ScrollText },
  ],
  president: [
    dashboard,
    { label: "Analitik", href: "/analytics", icon: BarChart3 },
    { label: "Semua Jobdesk", href: "/tasks", icon: ClipboardList },
    { label: "Persetujuan", href: "/approvals", icon: CheckSquare },
    { label: "Keuangan", href: "/finance", icon: Wallet },
  ],
  sekjen: [
    dashboard,
    { label: "Ringkasan Tugas", href: "/tasks", icon: ClipboardList },
    { label: "Buat Tugas", href: "/tasks/new", icon: PlusSquare },
  ],
  bendahara: [dashboard, { label: "Keuangan", href: "/finance", icon: Wallet }, myTasks],
  kepala_divisi: [dashboard, myTasks],
  anggota: [dashboard, myTasks],
};

export const roleLabels: Record<RoleName, string> = {
  super_admin: "Super Admin",
  president: "President",
  sekjen: "Sekretaris Jenderal",
  bendahara: "Bendahara",
  kepala_divisi: "Kepala Divisi",
  anggota: "Anggota",
};
