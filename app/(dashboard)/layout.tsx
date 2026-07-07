import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Shared left navigation sidebar */}
      <Sidebar />

      {/* Main dashboard content view */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
