"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAppStore } from "@/lib/store";

/** Redirects unauthenticated users to /login. Renders a neutral splash until the
 * persisted token is confirmed (avoids SSR/hydration flash of protected content). */
export function AppGuard({ children }: { children: React.ReactNode }) {
  const token = useAppStore((s) => s.token);
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!token) {
      const next = encodeURIComponent(pathname);
      router.replace(`/login?next=${next}`);
    } else {
      setChecked(true);
    }
  }, [token, pathname, router]);

  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
      </div>
    );
  }
  return <>{children}</>;
}
