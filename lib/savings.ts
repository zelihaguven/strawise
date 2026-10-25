import { ASSUMPTIONS, type ScenarioKey } from "@/lib/data";

export interface Period {
  straws: number;
  strawsSaved: number;
  costTl: number;
  savedTl: number;
}

export interface Scenario {
  key: ScenarioKey;
  rate: number;
  daily: Period;
  monthly: Period;
  yearly: Period;
  /** Highest unit price that keeps total straw spend unchanged after the reduction. */
  budgetNeutralUnitPrice: number;
}

export const SCENARIO_KEYS: ScenarioKey[] = ["alt", "orta", "ust"];

function scale(daily: Period, days: number): Period {
  return {
    straws: daily.straws * days,
    strawsSaved: daily.strawsSaved * days,
    costTl: daily.costTl * days,
    savedTl: daily.savedTl * days,
  };
}

export function computeScenario(
  key: ScenarioKey,
  dailyUsage: number,
  unitPrice: number,
): Scenario {
  const rate = ASSUMPTIONS.azalma[key];
  const remaining = dailyUsage * (1 - rate);
  const daily: Period = {
    straws: remaining,
    strawsSaved: dailyUsage - remaining,
    costTl: remaining * unitPrice,
    savedTl: (dailyUsage - remaining) * unitPrice,
  };
  return {
    key,
    rate,
    daily,
    monthly: scale(daily, ASSUMPTIONS.ayda_gun.deger),
    yearly: scale(daily, ASSUMPTIONS.yilda_gun.deger),
    budgetNeutralUnitPrice: unitPrice / (1 - rate),
  };
}

export function computeScenarios(dailyUsage: number, unitPrice: number): Scenario[] {
  return SCENARIO_KEYS.map((key) => computeScenario(key, dailyUsage, unitPrice));
}
