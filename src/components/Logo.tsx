// Inline SVG logo (pin → navy gradient) so the app has brand identity without an
// external asset. Replace with the provided logo file in public/ when available.
export function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="localyze-pin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2563EB" />
          <stop offset="1" stopColor="#172554" />
        </linearGradient>
      </defs>
      <path
        d="M12 2c-3.87 0-7 3.02-7 6.75C5 13.7 12 22 12 22s7-8.3 7-13.25C19 5.02 15.87 2 12 2Z"
        fill="url(#localyze-pin)"
      />
      <circle cx="12" cy="8.6" r="2.5" fill="#fff" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold tracking-tight ${className}`}>
      <Logo />
      <span className="text-brand-dark">Localyze</span>
    </span>
  );
}
