import type { Lang } from "@/lib/data";

const LOCALE: Record<Lang, string> = { tr: "tr-TR", en: "en-GB" };

export interface Formatters {
  int: (n: number) => string;
  tl: (n: number, digits?: number) => string;
  pct: (rate: number) => string;
}

export function formatters(lang: Lang): Formatters {
  const locale = LOCALE[lang];
  return {
    int: (n) => Math.round(n).toLocaleString(locale),
    tl: (n, digits = 0) =>
      `${n.toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })} TL`,
    pct: (rate) => (lang === "tr" ? `%${Math.round(rate * 100)}` : `${Math.round(rate * 100)}%`),
  };
}
