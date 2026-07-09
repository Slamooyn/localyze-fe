import { Suspense } from "react";

import { CompareView } from "@/components/CompareView";

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="h-full w-full animate-pulse bg-slate-100" />}>
      <CompareView />
    </Suspense>
  );
}
