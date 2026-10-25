import { BUSINESS_TYPES, nameOf, type Intake } from "@/lib/data";
import type { RankedMaterial } from "@/lib/rank";
import type { Scenario } from "@/lib/savings";
import type { VerifyResponse } from "@/lib/verify";
import { useLang } from "./LangProvider";
import { VerdictBadge } from "./VerdictBadge";

type Props = {
  intake: Intake;
  scenarios: Scenario[];
  top: RankedMaterial;
  verification: VerifyResponse | null;
};

export function Summary({ intake, scenarios, top, verification }: Props) {
  const { lang, t, f } = useLang();
  const [alt, mid, ust] = scenarios;
  const businessType = BUSINESS_TYPES.find((b) => b.id === intake.businessType);
  const business = businessType ? nameOf(businessType, lang) : "";
  const fits = top.budgetNeutralIn.includes("orta");
  const materialNote = fits
    ? t.sumFits(f.tl(top.newDailyCostTl, 2), f.tl(intake.dailyUsage * intake.unitPrice, 2))
    : t.sumOver(f.tl(-top.dailyDeltaTl, 2));

  return (
    <div className="grid overflow-hidden rounded-2xl border border-ink bg-ink text-paper md:grid-cols-3">
      <div className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-straw">{t.sumLess}</p>
        <p className="font-display num mt-2 text-4xl leading-none font-semibold">{f.tl(mid.yearly.savedTl)}</p>
        <p className="mt-1 text-sm text-paper/70">{t.sumYearly(f.pct(mid.rate))}</p>
        <p className="num mt-3 text-sm leading-relaxed text-paper/85">
          {t.sumStraws(business, f.int(mid.yearly.strawsSaved), f.tl(alt.yearly.savedTl), f.tl(ust.yearly.savedTl))}
        </p>
      </div>

      <div className="border-t border-paper/15 p-5 sm:p-6 md:border-t-0 md:border-l">
        <p className="text-xs font-semibold uppercase tracking-widest text-straw">{t.sumBetter}</p>
        <p className="font-display mt-2 text-2xl leading-tight font-semibold">{nameOf(top.material, lang)}</p>
        <p className="num mt-2 text-sm leading-relaxed text-paper/85">{materialNote}</p>
        <p className="mt-2 text-xs text-paper/60">{top.material.sertifikalar.join(" · ")}</p>
      </div>

      <div className="border-t border-paper/15 p-5 sm:p-6 md:border-t-0 md:border-l">
        <p className="text-xs font-semibold uppercase tracking-widest text-straw">{t.sumVerified}</p>
        {verification ? (
          <>
            <div className="mt-3">
              <VerdictBadge verdict={verification.result.uyum} />
            </div>
            <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-paper/85">{verification.result.gerekce}</p>
          </>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-paper/70">
            {t.sumVerifyPending}{" "}
            <a href="#dogrulama" className="font-semibold text-straw underline underline-offset-2">
              {t.sumGoVerify}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
