import { Suspense } from "react";

import { DashboardView } from "@/components/dashboard/DashboardView";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="h-full w-full animate-pulse bg-slate-50" />}>
      <DashboardView />
    </Suspense>
  );
}
