import type { Verdict } from "@/lib/verify";

const STYLE: Record<Verdict, { cls: string; label: string }> = {
  doğrulandı: { cls: "bg-leaf text-paper", label: "Doğrulandı" },
  kısmen: { cls: "bg-straw text-ink", label: "Kısmen doğrulandı" },
  doğrulanamadı: { cls: "bg-bad text-paper", label: "Doğrulanamadı" },
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const s = STYLE[verdict];
  return <span className={`rounded-full px-3 py-1 text-sm font-semibold ${s.cls}`}>{s.label}</span>;
}
