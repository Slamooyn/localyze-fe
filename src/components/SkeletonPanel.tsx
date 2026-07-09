export function SkeletonPanel() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-24 rounded-full bg-slate-200" />
        <div className="h-5 w-20 rounded-full bg-slate-100" />
      </div>
      <div className="mx-auto h-32 w-32 rounded-full bg-slate-200" />
      <div className="space-y-2">
        <div className="h-2 w-full rounded-full bg-slate-100" />
        <div className="h-2 w-full rounded-full bg-slate-100" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 rounded bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
