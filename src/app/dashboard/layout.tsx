import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getCollections, getCurrentUser, getSidebarTypes } from "@/lib/data";

// The dashboard reflects live database state, so render per-request rather than
// prerendering at build time (which would also require DB access during build).
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [types, collections, user] = await Promise.all([
    getSidebarTypes(),
    getCollections(),
    getCurrentUser(),
  ]);

  return (
    <DashboardShell types={types} collections={collections} user={user}>
      {children}
    </DashboardShell>
  );
}