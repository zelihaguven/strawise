import raw from "@/data/materials.json";

export type Lang = "tr" | "en";
export type BusinessType = "kafe" | "restoran" | "bar" | "fastfood";
export type PfasRisk = "yok" | "bilinmiyor" | "yuksek";
export type ScenarioKey = "alt" | "orta" | "ust";

export interface Material {
  id: string;
  ad: string;
  ad_en: string;
  birim_fiyat_tl: { min: number; max: number };
  sertifikalar: string[];
  ev_kompost: boolean;
  dayanim: number;
  pfas_riski: PfasRisk;
  not: string;
  not_en: string;
  kaynaklar: string[];
  ornek_veri: string[];
}

export interface Intake {
  businessType: BusinessType;
  dailyUsage: number;
  currentType: string;
  unitPrice: number;
}

interface Named {
  id: string;
  ad: string;
  ad_en: string;
}

export const SOURCES = raw.kaynaklar as Record<string, { tr: string; en: string }>;
export const ASSUMPTIONS = raw.varsayimlar;
export const MATERIALS = raw.malzemeler as Material[];
export const BUSINESS_TYPES = raw.isletme_tipleri as (Named & { id: BusinessType })[];
export const CURRENT_TYPES = raw.mevcut_pipet_tipleri as Named[];

export function isSample(material: Material, field: string): boolean {
  return material.ornek_veri.includes(field);
}

/** Picks the Turkish or English variant of a data-file entry. */
export function nameOf(item: { ad: string; ad_en: string }, lang: Lang): string {
  return lang === "en" ? item.ad_en : item.ad;
}

export function noteOf(item: { not: string; not_en: string }, lang: Lang): string {
  return lang === "en" ? item.not_en : item.not;
}

export function sourceOf(id: string, lang: Lang): string {
  return SOURCES[id]?.[lang] ?? id;
}
