import { BUSINESS_TYPES, type Intake } from "@/lib/data";
import { fmtInt, fmtPct, fmtTl } from "@/lib/format";
import type { RankedMaterial } from "@/lib/rank";
import type { Scenario } from "@/lib/savings";
import type { VerifyResponse } from "@/lib/verify";
import { VerdictBadge } from "./VerdictBadge";

type Props = {
  intake: Intake;
  scenarios: Scenario[];
  top: RankedMaterial;
  verification: VerifyResponse | null;
};

export function Summary({ intake, scenarios, top, verification }: Props) {
  const mid = scenarios.find((s) => s.key === "orta")!;
  const [alt, , ust] = scenarios;
  const business = BUSINESS_TYPES.find((b) => b.id === intake.businessType)?.ad ?? "";
  const fits = top.budgetNeutralIn.includes("orta");

  return (
    <div className="grid overflow-hidden rounded-2xl border border-ink bg-ink text-paper md:grid-cols-3">
      <div className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-straw">1 · Daha az pipet</p>
        <p className="font-display mt-2 text-4xl leading-none font-semibold num">
          {fmtTl(mid.yearly.savedTl)}
        </p>
        <p className="mt-1 text-sm text-paper/70">yıllık tasarruf (orta senaryo, {fmtPct(mid.rate)})</p>
        <p className="mt-3 text-sm leading-relaxed text-paper/85">
          {business}: yılda <strong className="num">{fmtInt(mid.yearly.strawsSaved)}</strong> pipet daha az. Aralık{" "}
          <span className="num">{fmtTl(alt.yearly.savedTl)}</span> – <span className="num">{fmtTl(ust.yearly.savedTl)}</span>.
        </p>
      </div>

      <div className="border-t border-paper/15 p-5 sm:p-6 md:border-t-0 md:border-l">
        <p className="text-xs font-semibold uppercase tracking-widest text-straw">2 · Daha iyi pipet</p>
        <p className="font-display mt-2 text-2xl leading-tight font-semibold">{top.material.ad}</p>
        <p className="mt-2 text-sm leading-relaxed text-paper/85">
          {fits
            ? `Tasarrufla bütçe nötr: kalan pipetler için günlük maliyet ${fmtTl(top.newDailyCostTl, 2)}, bugün ${fmtTl(intake.dailyUsage * intake.unitPrice, 2)}.`
            : `Orta senaryoda günde ${fmtTl(-top.dailyDeltaTl, 2)} ek maliyet; yine de en dengeli seçenek.`}
        </p>
        <p className="mt-2 text-xs text-paper/60">{top.material.sertifikalar.join(" · ")}</p>
      </div>

      <div className="border-t border-paper/15 p-5 sm:p-6 md:border-t-0 md:border-l">
        <p className="text-xs font-semibold uppercase tracking-widest text-straw">3 · Doğrulanmış iddia</p>
        {verification ? (
          <>
            <div className="mt-3">
              <VerdictBadge verdict={verification.result.uyum} />
            </div>
            <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-paper/85">{verification.result.gerekce}</p>
          </>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-paper/70">
            Tedarikçinin iddiasını aşağıda doğrulayın. Sonuç buraya eklenecek.{" "}
            <a href="#dogrulama" className="font-semibold text-straw underline underline-offset-2">
              Doğrulamaya git
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
