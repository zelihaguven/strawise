import raw from "@/data/materials.json";

export type BusinessType = "kafe" | "restoran" | "bar" | "fastfood";
export type PfasRisk = "yok" | "bilinmiyor" | "yuksek";
export type ScenarioKey = "alt" | "orta" | "ust";

export interface Material {
  id: string;
  ad: string;
  birim_fiyat_tl: { min: number; max: number };
  sertifikalar: string[];
  ev_kompost: boolean;
  dayanim: number;
  pfas_riski: PfasRisk;
  not: string;
  kaynaklar: string[];
  ornek_veri: string[];
}

export interface Intake {
  businessType: BusinessType;
  dailyUsage: number;
  currentType: string;
  unitPrice: number;
}

export const SOURCES = raw.kaynaklar as Record<string, string>;
export const ASSUMPTIONS = raw.varsayimlar;
export const MATERIALS = raw.malzemeler as Material[];
export const BUSINESS_TYPES = raw.isletme_tipleri as { id: BusinessType; ad: string }[];
export const CURRENT_TYPES = raw.mevcut_pipet_tipleri;

export const SCENARIO_LABELS: Record<ScenarioKey, string> = {
  alt: "Alt senaryo",
  orta: "Orta senaryo",
  ust: "Üst senaryo",
};

export function isSample(material: Material, field: string): boolean {
  return material.ornek_veri.includes(field);
}
