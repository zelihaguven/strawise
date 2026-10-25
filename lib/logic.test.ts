import { describe, expect, it } from "vitest";
import { computeScenarios } from "@/lib/savings";
import { rankMaterials, weightsFor } from "@/lib/rank";

describe("computeScenarios", () => {
  it("applies 40/50/60% reductions to daily, monthly and yearly figures", () => {
    const [alt, orta, ust] = computeScenarios(150, 0.4);
    expect(alt.daily.strawsSaved).toBeCloseTo(60);
    expect(orta.daily.strawsSaved).toBeCloseTo(75);
    expect(ust.daily.straws).toBeCloseTo(60);
    expect(orta.daily.savedTl).toBeCloseTo(30);
    expect(orta.monthly.strawsSaved).toBeCloseTo(75 * 30);
    expect(orta.yearly.savedTl).toBeCloseTo(30 * 365);
  });

  it("budget-neutral unit price matches the PDR rule of thumb (~1.8x at 55% volume)", () => {
    const [alt] = computeScenarios(100, 1);
    expect(alt.budgetNeutralUnitPrice).toBeCloseTo(1 / 0.6);
  });
});

describe("rankMaterials", () => {
  it("never ranks high-PFAS paper first", () => {
    for (const businessType of ["kafe", "restoran", "bar", "fastfood"] as const) {
      const ranked = rankMaterials({ businessType, dailyUsage: 150, currentType: "kagit", unitPrice: 0.4 });
      expect(ranked[0].material.id).not.toBe("kagit");
    }
  });

  it("returns every material sorted by descending score", () => {
    const ranked = rankMaterials({ businessType: "kafe", dailyUsage: 150, currentType: "plastik", unitPrice: 0.4 });
    expect(ranked.length).toBeGreaterThan(4);
    for (let i = 1; i < ranked.length; i++) expect(ranked[i - 1].score).toBeGreaterThanOrEqual(ranked[i].score);
  });

  it("marks a material budget-neutral only when its price fits the scenario cap", () => {
    const ranked = rankMaterials({ businessType: "kafe", dailyUsage: 150, currentType: "kagit", unitPrice: 0.4 });
    for (const r of ranked) expect(r.budgetNeutralIn.includes("orta")).toBe(r.midPrice <= 0.8 + 1e-9);
  });

  it("shifts weight toward cost for high-volume businesses", () => {
    const low = weightsFor({ businessType: "kafe", dailyUsage: 100 });
    const high = weightsFor({ businessType: "kafe", dailyUsage: 800 });
    expect(high.cost).toBeGreaterThan(low.cost);
    expect(high.cost + high.durability + high.compost + high.pfas).toBeCloseTo(1);
  });
});
