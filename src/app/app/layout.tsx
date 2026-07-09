import { CompareTray } from "@/components/CompareTray";
import { Providers } from "@/components/Providers";
import { AppGuard } from "@/components/shell/AppGuard";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AppGuard>
        <div className="flex h-screen overflow-hidden bg-slate-50">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar />
            <main className="scroll-slim min-h-0 flex-1 overflow-y-auto">{children}</main>
          </div>
          <CompareTray />
        </div>
      </AppGuard>
    </Providers>
  );
}
