import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

// Own button (project is not shadcn) — solid & outline variants, rounded-full,
// used across the landing. Renders a Next <Link> when href is given.

type Variant = "solid" | "outline";
type Size = "md" | "lg";

const VARIANT: Record<Variant, string> = {
  solid: "bg-brand text-white shadow-sm hover:bg-brand-bright",
  outline:
    "border border-slate-300 bg-white/70 text-slate-700 backdrop-blur hover:border-slate-400 hover:bg-white",
};

const SIZE: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

const BASE =
  "inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold transition disabled:pointer-events-none disabled:opacity-50";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "solid", size = "md", className, children, ...rest } = props;
  const classes = cn(BASE, VARIANT[variant], SIZE[size], className);

  if (rest.href !== undefined) {
    const { href, ...anchor } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...anchor}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
