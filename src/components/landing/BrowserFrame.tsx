export function BrowserFrame({
  url = "localyze.id/app",
  children,
}: {
  url?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="ml-2 flex-1 truncate rounded-md bg-white px-3 py-1 text-center text-[11px] text-slate-400">
          {url}
        </div>
      </div>
      <div className="bg-slate-50">{children}</div>
    </div>
  );
}
