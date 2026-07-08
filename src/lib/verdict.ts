import type { Verdict } from "./api/types";

export const VERDICT_LABEL: Record<Verdict, string> = {
  prime: "Prime",
  strong: "Strong",
  conditional: "Conditional",
  avoid: "Avoid",
};

export const VERDICT_SUBTITLE: Record<Verdict, string> = {
  prime: "Lokasi unggulan",
  strong: "Kandidat kuat",
  conditional: "Perlu pertimbangan",
  avoid: "Hindari",
};

// Tailwind class fragments
export const VERDICT_CLASS: Record<Verdict, { text: string; bg: string; ring: string; dot: string }> = {
  prime: { text: "text-prime", bg: "bg-prime-bg", ring: "ring-prime/30", dot: "bg-prime" },
  strong: { text: "text-strong", bg: "bg-strong-bg", ring: "ring-strong/30", dot: "bg-strong" },
  conditional: {
    text: "text-conditional",
    bg: "bg-conditional-bg",
    ring: "ring-conditional/30",
    dot: "bg-conditional",
  },
  avoid: { text: "text-avoid", bg: "bg-avoid-bg", ring: "ring-avoid/30", dot: "bg-avoid" },
};

export const VERDICT_HEX: Record<Verdict, string> = {
  prime: "#16A34A",
  strong: "#0D9488",
  conditional: "#D97706",
  avoid: "#DC2626",
};

export function verdictFromScore(score: number): Verdict {
  if (score >= 80) return "prime";
  if (score >= 65) return "strong";
  if (score >= 50) return "conditional";
  return "avoid";
}

// Heatmap ramp: high score = green, low = red (spec §2)
export function scoreToHeatColor(score: number): string {
  return VERDICT_HEX[verdictFromScore(score)];
}
