import { Sidebar } from "@/components/layout/sidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Shared left navigation sidebar */}
      <Sidebar />

      {/* Main workspace interactive canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
