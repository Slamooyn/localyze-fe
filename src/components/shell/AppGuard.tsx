"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAppStore } from "@/lib/store";

/** Redirects unauthenticated users to /login. Waits for the persisted store to
 * rehydrate from localStorage before deciding, so a valid token is never missed
 * on a hard navigation (which would otherwise bounce the user to /login). */
export function AppGuard({ children }: { children: React.ReactNode }) {
  const token = useAppStore((s) => s.token);
  const router = useRouter();
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setHydrated(useAppStore.persist.hasHydrated());
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else {
      setChecked(true);
    }
  }, [hydrated, token, pathname, router]);

  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
      </div>
    );
  }
  return <>{children}</>;
}
