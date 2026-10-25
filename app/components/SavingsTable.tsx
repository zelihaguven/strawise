import { ASSUMPTIONS, sourceOf } from "@/lib/data";
import type { Period, Scenario } from "@/lib/savings";
import { useLang } from "./LangProvider";
import { SampleTag } from "./ui";

type Props = {
  scenarios: Scenario[];
  dailyUsage: number;
  unitPrice: number;
};

function PeriodRow({ label, p }: { label: string; p: Period }) {
  const { t, f } = useLang();
  return (
    <div className="grid grid-cols-[4.5rem_1fr_1fr] items-baseline gap-2 border-t border-line py-2 first:border-t-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="num text-right text-[15px]">
        <span className="font-semibold">−{f.int(p.strawsSaved)}</span>
        <span className="text-muted"> {t.strawsUnit}</span>
      </span>
      <span className="num text-right text-[15px] font-semibold text-leaf">{f.tl(p.savedTl)}</span>
    </div>
  );
}

export function SavingsTable({ scenarios, dailyUsage, unitPrice }: Props) {
  const { lang, t, f } = useLang();
  const periods = [
    { key: "daily", label: t.periodDaily },
    { key: "monthly", label: t.periodMonthly },
    { key: "yearly", label: t.periodYearly },
  ] as const;
  const a = ASSUMPTIONS;

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-3">
        {scenarios.map((s) => {
          const isMid = s.key === "orta";
          return (
            <article
              key={s.key}
              className={`rounded-xl border p-4 ${isMid ? "border-ink bg-surface shadow-[4px_4px_0_var(--straw)]" : "border-line bg-surface/60"}`}
            >
              <header className="mb-2 flex items-baseline justify-between">
                <h3 className="font-semibold">{t.scenario[s.key]}</h3>
                <span className="font-display text-2xl font-semibold">{f.pct(s.rate)}</span>
              </header>
              <p className="num mb-2 text-sm text-muted">{t.perDay(f.int(dailyUsage), f.int(s.daily.straws))}</p>
              <div className="grid grid-cols-[4.5rem_1fr_1fr] gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                <span />
                <span className="text-right">{t.colReduced}</span>
                <span className="text-right">{t.colSaved}</span>
              </div>
              {periods.map((p) => (
                <PeriodRow key={p.key} label={p.label} p={s[p.key]} />
              ))}
              <p className="mt-3 rounded-lg bg-straw-soft px-3 py-2 text-[13px] leading-snug">
                {t.budgetNeutral} <strong className="num">{f.tl(s.budgetNeutralUnitPrice, 2)}</strong>
              </p>
            </article>
          );
        })}
      </div>

      <details className="rounded-xl border border-line bg-surface/60 p-4 text-sm leading-relaxed open:bg-surface">
        <summary className="cursor-pointer font-semibold">{t.assumptionsTitle}</summary>
        <ul className="mt-3 grid list-disc gap-1.5 pl-5 text-muted">
          <li>
            {t.assumeReduction(f.pct(a.azalma.alt), f.pct(a.azalma.orta), f.pct(a.azalma.ust))}{" "}
            {lang === "en" ? a.azalma.not_en : a.azalma.not}
          </li>
          <li>{t.assumePrice(f.tl(unitPrice, 2))}</li>
          <li>
            {t.assumeDays(a.ayda_gun.deger, a.yilda_gun.deger)} {lang === "en" ? a.ayda_gun.not_en : a.ayda_gun.not}
            <SampleTag />
          </li>
          <li>{t.assumeFormula}</li>
        </ul>
        <ol className="mt-3 grid gap-1 border-t border-line pt-3 text-[13px] text-muted">
          {a.azalma.kaynaklar.map((k) => (
            <li key={k}>• {sourceOf(k, lang)}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
