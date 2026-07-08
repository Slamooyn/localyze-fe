import { CompareTray } from "@/components/CompareTray";
import { Providers } from "@/components/Providers";
import { TopBar } from "@/components/TopBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex h-screen flex-col overflow-hidden">
        <TopBar />
        <main className="relative min-h-0 flex-1">{children}</main>
        <CompareTray />
      </div>
    </Providers>
  );
}
