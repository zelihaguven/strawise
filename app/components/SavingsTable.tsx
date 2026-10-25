import { ASSUMPTIONS, SCENARIO_LABELS, SOURCES } from "@/lib/data";
import { fmtInt, fmtPct, fmtTl } from "@/lib/format";
import type { Period, Scenario } from "@/lib/savings";
import { SampleTag } from "./ui";

type Props = {
  scenarios: Scenario[];
  dailyUsage: number;
  unitPrice: number;
};

const PERIODS: { key: "daily" | "monthly" | "yearly"; label: string }[] = [
  { key: "daily", label: "Günlük" },
  { key: "monthly", label: "Aylık" },
  { key: "yearly", label: "Yıllık" },
];

function PeriodRow({ label, p }: { label: string; p: Period }) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr_1fr] items-baseline gap-2 border-t border-line py-2 first:border-t-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="num text-right text-[15px]">
        <span className="font-semibold">−{fmtInt(p.strawsSaved)}</span>
        <span className="text-muted"> pipet</span>
      </span>
      <span className="num text-right text-[15px] font-semibold text-leaf">{fmtTl(p.savedTl)}</span>
    </div>
  );
}

export function SavingsTable({ scenarios, dailyUsage, unitPrice }: Props) {
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
                <h3 className="font-semibold">{SCENARIO_LABELS[s.key]}</h3>
                <span className="font-display text-2xl font-semibold">{fmtPct(s.rate)}</span>
              </header>
              <p className="mb-2 text-sm text-muted">
                Günde <span className="num font-medium text-ink">{fmtInt(dailyUsage)}</span> →{" "}
                <span className="num font-medium text-ink">{fmtInt(s.daily.straws)}</span> pipet
              </p>
              <div className="grid grid-cols-[4.5rem_1fr_1fr] gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                <span />
                <span className="text-right">Azalan</span>
                <span className="text-right">Tasarruf</span>
              </div>
              {PERIODS.map((p) => (
                <PeriodRow key={p.key} label={p.label} p={s[p.key]} />
              ))}
              <p className="mt-3 rounded-lg bg-straw-soft px-3 py-2 text-[13px] leading-snug">
                Toplam maliyet değişmeden ödenebilecek birim fiyat:{" "}
                <strong className="num">{fmtTl(s.budgetNeutralUnitPrice, 2)}</strong>
              </p>
            </article>
          );
        })}
      </div>

      <details className="rounded-xl border border-line bg-surface/60 p-4 text-sm leading-relaxed open:bg-surface">
        <summary className="cursor-pointer font-semibold">Varsayımlar ve kaynaklar</summary>
        <ul className="mt-3 grid list-disc gap-1.5 pl-5 text-muted">
          <li>
            &quot;Sorulmadan verilmez&quot; varsayılanıyla kullanım {fmtPct(ASSUMPTIONS.azalma.alt)} (alt),{" "}
            {fmtPct(ASSUMPTIONS.azalma.orta)} (orta) ve {fmtPct(ASSUMPTIONS.azalma.ust)} (üst) azalır.{" "}
            {ASSUMPTIONS.azalma.not}
          </li>
          <li>
            Tasarruf, mevcut birim fiyatınız (<span className="num">{fmtTl(unitPrice, 2)}</span>) üzerinden
            hesaplanır; malzeme değiştirilmediği varsayılır.
          </li>
          <li>
            Ay = {ASSUMPTIONS.ayda_gun.deger} gün, yıl = {ASSUMPTIONS.yilda_gun.deger} gün.{" "}
            {ASSUMPTIONS.ayda_gun.not}
            <SampleTag />
          </li>
          <li>Bütçe nötr birim fiyat = mevcut birim fiyat ÷ (1 − azalma oranı).</li>
        </ul>
        <ol className="mt-3 grid gap-1 border-t border-line pt-3 text-[13px] text-muted">
          {ASSUMPTIONS.azalma.kaynaklar.map((k) => (
            <li key={k}>• {SOURCES[k]}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
