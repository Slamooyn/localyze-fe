import {
  Building2,
  Cross,
  GraduationCap,
  School,
  ShoppingBag,
  TrainFront,
  type LucideIcon,
} from "lucide-react";

const ANCHOR_ICON: Record<string, LucideIcon> = {
  office: Building2,
  mall: ShoppingBag,
  campus: GraduationCap,
  station: TrainFront,
  school: School,
  hospital: Cross,
};

export function AnchorPin({ type, name }: { type: string; name?: string }) {
  const Icon = ANCHOR_ICON[type] ?? Building2;
  return (
    <div
      title={name ? `${name} (${type})` : type}
      className="flex h-5 w-5 items-center justify-center rounded-full border border-white bg-brand text-white shadow"
    >
      <Icon className="h-3 w-3" />
    </div>
  );
}
