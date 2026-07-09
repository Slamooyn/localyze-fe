import Image from "next/image";

/** The official Localyze pin mark (public/logo-localyze.png). */
export function LogoMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo-localyze.png"
      alt="Localyze"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}

/** Logo in a white rounded container — for use on the navy sidebar / auth panel. */
export function LogoBadge({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center rounded-xl bg-white p-1 shadow-sm">
      <LogoMark size={size} />
    </span>
  );
}

export function Wordmark({
  className = "",
  onNavy = false,
}: {
  className?: string;
  onNavy?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      {onNavy ? <LogoBadge size={24} /> : <LogoMark size={28} />}
      <span className={onNavy ? "text-white" : "text-navy"}>Localyze</span>
    </span>
  );
}
