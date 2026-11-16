import { getCurrentProfile } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen md:flex">
      <Sidebar profile={profile} />
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
