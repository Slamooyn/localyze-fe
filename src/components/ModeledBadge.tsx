import { Info } from "lucide-react";

export function ModeledBadge() {
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700"
      title="Data estimasi (modeled), bukan data BPS langsung"
    >
      <Info className="h-3 w-3" />
      modeled
    </span>
  );
}
