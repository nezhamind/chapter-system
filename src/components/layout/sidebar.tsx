"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationByRole, roleLabels } from "@/config/navigation";
import { useUiStore } from "@/stores/ui-store";
import { logout } from "@/app/(auth)/actions";
import type { Profile } from "@/types";

export function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const items = navigationByRole[profile.role];

  // Menu aktif = yang href-nya paling spesifik cocok dengan URL
  const activeHref = items
    .filter((i) => pathname === i.href || pathname.startsWith(i.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <>
      <header className="flex h-14 items-center gap-3 border-b bg-card px-4 md:hidden">
        <button onClick={() => setSidebarOpen(true)} aria-label="Buka menu">
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-semibold">Chapter System</span>
      </header>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r bg-card transition-transform md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <span className="text-lg font-semibold">Chapter System</span>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)} aria-label="Tutup menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                item.href === activeHref
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-3 border-t p-4">
          <div>
            <p className="truncate text-sm font-medium">{profile.name}</p>
            <p className="text-xs text-muted-foreground">
              {roleLabels[profile.role]}
              {profile.divisionName ? ` · ${profile.divisionName}` : ""}
            </p>
          </div>
          <form action={logout}>
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
