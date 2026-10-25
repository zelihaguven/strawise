import type { Verdict } from "@/lib/verify";
import { useLang } from "./LangProvider";

const STYLE: Record<Verdict, string> = {
  doğrulandı: "bg-leaf text-paper",
  kısmen: "bg-straw text-ink",
  doğrulanamadı: "bg-bad text-paper",
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const { t } = useLang();
  return <span className={`rounded-full px-3 py-1 text-sm font-semibold ${STYLE[verdict]}`}>{t.verdict[verdict]}</span>;
}
