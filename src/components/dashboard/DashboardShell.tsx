import { Sidebar } from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/dashboard/sidebar-context";
import { TopBar } from "@/components/dashboard/TopBar";
import type {
  CollectionCardData,
  DashboardUser,
  SidebarType,
} from "@/types/dashboard";

// The dashboard shell: full-height sidebar on the left, top bar + main content
// on the right. Wrapped in the SidebarProvider so the top bar's toggle can
// control the sidebar. Server-rendered `children` are passed straight through.
export function DashboardShell({
  types,
  collections,
  user,
  children,
}: {
  types: SidebarType[];
  collections: CollectionCardData[];
  user: DashboardUser | null;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar types={types} collections={collections} user={user} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}