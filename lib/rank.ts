import { MATERIALS, type Intake, type Material, type ScenarioKey } from "@/lib/data";
import { computeScenario, SCENARIO_KEYS } from "@/lib/savings";

/** Language-neutral reason codes; the UI turns them into text via lib/i18n. */
export type Reason =
  | { code: "fits" | "over"; midPrice: number; cap: number }
  | { code: "pfasHigh" | "pfasUnknown" | "industrialOnly" | "noSoften" | "softens" };

export interface RankedMaterial {
  material: Material;
  score: number;
  midPrice: number;
  /** Daily spend on the remaining straws with this material (orta senaryo). */
  newDailyCostTl: number;
  /** Positive = still cheaper than today's spend; negative = extra cost per day. */
  dailyDeltaTl: number;
  budgetNeutralIn: ScenarioKey[];
  reasons: Reason[];
}

const HIGH_VOLUME = 500;
const PFAS_SCORE = { yok: 1, bilinmiyor: 0.4, yuksek: 0 } as const;

interface Weights {
  cost: number;
  durability: number;
  compost: number;
  pfas: number;
}

// Bars serve long cocktails, so a straw that doesn't soften matters more;
// fast food runs on volume, so unit cost dominates.
export function weightsFor(intake: Pick<Intake, "businessType" | "dailyUsage">): Weights {
  const base: Record<Intake["businessType"], Weights> = {
    kafe: { cost: 0.4, durability: 0.25, compost: 0.15, pfas: 0.2 },
    restoran: { cost: 0.45, durability: 0.2, compost: 0.15, pfas: 0.2 },
    bar: { cost: 0.35, durability: 0.35, compost: 0.1, pfas: 0.2 },
    fastfood: { cost: 0.55, durability: 0.15, compost: 0.1, pfas: 0.2 },
  };
  const w = base[intake.businessType];
  if (intake.dailyUsage < HIGH_VOLUME) return w;
  // High volume: shift 0.1 from durability/compost to cost.
  return { ...w, cost: w.cost + 0.1, durability: w.durability - 0.05, compost: w.compost - 0.05 };
}

export function rankMaterials(intake: Intake, scenarioKey: ScenarioKey = "orta"): RankedMaterial[] {
  const w = weightsFor(intake);
  const scenario = computeScenario(scenarioKey, intake.dailyUsage, intake.unitPrice);
  const cap = scenario.budgetNeutralUnitPrice;
  const currentDailyCost = intake.dailyUsage * intake.unitPrice;

  return MATERIALS.map((material) => {
    const midPrice = (material.birim_fiyat_tl.min + material.birim_fiyat_tl.max) / 2;
    const costScore = Math.min(1, cap / midPrice);
    const score =
      w.cost * costScore +
      w.durability * (material.dayanim / 5) +
      w.compost * (material.ev_kompost ? 1 : 0) +
      w.pfas * PFAS_SCORE[material.pfas_riski];

    const newDailyCostTl = scenario.daily.straws * midPrice;
    const budgetNeutralIn = SCENARIO_KEYS.filter(
      (k) => midPrice <= computeScenario(k, intake.dailyUsage, intake.unitPrice).budgetNeutralUnitPrice,
    );

    const reasons: Reason[] = [{ code: midPrice <= cap ? "fits" : "over", midPrice, cap }];
    if (material.pfas_riski === "yuksek") reasons.push({ code: "pfasHigh" });
    if (material.pfas_riski === "bilinmiyor") reasons.push({ code: "pfasUnknown" });
    if (!material.ev_kompost) reasons.push({ code: "industrialOnly" });
    if (material.dayanim >= 4) reasons.push({ code: "noSoften" });
    if (material.dayanim <= 2) reasons.push({ code: "softens" });

    return {
      material,
      score,
      midPrice,
      newDailyCostTl,
      dailyDeltaTl: currentDailyCost - newDailyCostTl,
      budgetNeutralIn,
      reasons,
    };
  }).sort((a, b) => b.score - a.score);
}
