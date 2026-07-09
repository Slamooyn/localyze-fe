import { Suspense } from "react";

import { AnalyzeView } from "@/components/AnalyzeView";

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="h-full w-full animate-pulse bg-slate-100" />}>
      <AnalyzeView />
    </Suspense>
  );
}
