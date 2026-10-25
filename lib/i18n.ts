import type { Lang, PfasRisk, ScenarioKey } from "@/lib/data";
import type { Formatters } from "@/lib/format";
import type { Reason } from "@/lib/rank";
import type { Verdict } from "@/lib/verify";

export const LANGS: Lang[] = ["tr", "en"];

const tr = {
  metaTitle: "STRAWISE — Doğru pipet, doğru işletmeye",
  langLabel: "Dil",
  heroA: "Daha az pipet",
  heroB: "daha iyi pipet",
  heroC: "= aynı maliyet",
  heroLead:
    'Kafe veya restoranınız için 3 soruyu cevaplayın. "Sorulmadan verilmez" ile ne kadar tasarruf edeceğinizi, bu tasarrufla hangi doğrulanmış malzemeye geçebileceğinizi görün ve tedarikçinin "biyobozunur" iddiasını yapay zekâyla sertifikasına göre denetleyin.',

  introTitle: "İşletmenizi tanıyalım",
  summaryTitle: "Sonuç özeti",
  savingsTitle: "Sorulmadan verilmez: tasarruf",
  savingsLead:
    "Pipet yalnızca müşteri isterse verildiğinde kullanım düşer. Üç senaryo, saha çalışmalarının aralığını gösterir.",
  materialsTitle: "Tasarrufla geçebileceğiniz malzemeler",
  materialsLead:
    "Bütçe (orta senaryodaki bütçe nötr fiyat), yumuşamama, ev kompostu ve PFAS riskine göre işletme tipinize ağırlıklandırılmış sıralama.",
  verifyTitle: "Tedarikçi iddiasını doğrula",
  verifyLead:
    "Tedarikçinin iddiasını ve sertifika ya da ürün belgesi metnini yapıştırın. Yapay zekâ, belgede geçen standardı, sertifika numarasını ve iddianın kapsamla uyumunu çıkarır.",
  footer:
    '"Örnek veri" etiketli değerler kaynaksızdır ve güncellenecektir. Doğrulama sonuçları karar desteği içindir.',

  // Intake form
  q1: "1. İşletme tipi",
  q2: "2. Günlük ortalama pipet kullanımı (adet)",
  q2Placeholder: "ör. 150",
  q3: "3. Şu anki pipet tipi ve birim fiyatı",
  currentTypeAria: "Şu anki pipet tipi",
  unitPriceAria: "Birim fiyat (TL)",
  errUsage: (max: string) => `Günlük pipet kullanımı 1 ile ${max} arasında olmalı.`,
  errPrice: "Birim fiyatı 0'dan büyük bir TL değeri olarak girin (ör. 0,40).",
  calculate: "Hesapla",
  trySample: "Örnek işletmeyle dene",

  // Savings
  scenario: { alt: "Alt senaryo", orta: "Orta senaryo", ust: "Üst senaryo" } satisfies Record<ScenarioKey, string>,
  perDay: (from: string, to: string) => `Günde ${from} → ${to} pipet`,
  colReduced: "Azalan",
  colSaved: "Tasarruf",
  periodDaily: "Günlük",
  periodMonthly: "Aylık",
  periodYearly: "Yıllık",
  strawsUnit: "pipet",
  budgetNeutral: "Toplam maliyet değişmeden ödenebilecek birim fiyat:",
  assumptionsTitle: "Varsayımlar ve kaynaklar",
  assumeReduction: (a: string, b: string, c: string) =>
    `"Sorulmadan verilmez" varsayılanıyla kullanım ${a} (alt), ${b} (orta) ve ${c} (üst) azalır.`,
  assumePrice: (p: string) => `Tasarruf, mevcut birim fiyatınız (${p}) üzerinden hesaplanır; malzeme değiştirilmediği varsayılır.`,
  assumeDays: (m: number, y: number) => `Ay = ${m} gün, yıl = ${y} gün.`,
  assumeFormula: "Bütçe nötr birim fiyat = mevcut birim fiyat ÷ (1 − azalma oranı).",

  // Materials
  recommended: "Önerilen",
  perUnit: "/ adet",
  sameCost: "Bugünkü maliyetle aynı",
  cheaper: (v: string) => `Günde ${v} daha ucuz`,
  extra: (v: string) => `Günde ${v} ek maliyet`,
  vsToday: "orta senaryo, bugünkü harcamaya göre",
  pfas: { yok: "PFAS yok", bilinmiyor: "PFAS bilinmiyor", yuksek: "PFAS riski yüksek" } satisfies Record<PfasRisk, string>,
  homeCompost: "Ev kompostu",
  industrialCompost: "Endüstriyel kompost",
  durability: "Yumuşamama",
  durabilityAria: (v: number) => `Dayanım ${v}/5`,
  budgetNeutralIn: (list: string) => `Bütçe nötr olduğu senaryolar: ${list}.`,
  source: "Kaynak",
  sampleTag: "örnek veri",
  sampleTagTitle: "Kaynaksız örnek veri — data/materials.json içinde güncellenecek",

  // Verify
  fillSample: "Örnek doldur",
  nextSample: "Sıradaki",
  claimLabel: "Tedarikçinin iddiası",
  claimPlaceholder: "ör. %100 biyobozunur, evde kompostlanabilir",
  docLabel: "Sertifika veya ürün belgesi metni",
  docPlaceholder: "Sertifika PDF'inden veya ürün sayfasından metni buraya yapıştırın.",
  verifying: "Yapay zekâ belgeyi inceliyor…",
  verify: "İddiayı doğrula",
  verifyEmpty:
    "Sonuç burada görünecek. LLM iddiayı yalnızca yapıştırılan belgeye göre denetler ve yapılandırılmış bir rapor döndürür.",
  verifyFailed: "Doğrulama başarısız.",
  badResponse: "Sunucudan geçersiz yanıt geldi.",
  reportTitle: "Doğrulama raporu",
  fClaim: "İddia",
  fStandards: "Belgede geçen standart",
  noStandards: "Standart bulunamadı",
  foundInText: "Metinde birebir bulundu",
  notFoundInText: "Metinde birebir bulunamadı",
  fCert: "Sertifika no / kurum",
  fReason: "Gerekçe",
  fMissing: "Eksik bilgiler",
  crossCheck: "Kural tabanlı çapraz kontrol: belgede düzenli ifadeyle bulunan standartlar",
  none: "yok",
  unsupported: (list: string) => ` Modelin bildirdiği ${list} metinde birebir geçmiyor; elle kontrol edin.`,
  modelNote: (m: string) => `Model: ${m} · Sonuç karar desteği içindir, hukuki onay değildir.`,
  verdict: { doğrulandı: "Doğrulandı", kısmen: "Kısmen doğrulandı", doğrulanamadı: "Doğrulanamadı" } satisfies Record<Verdict, string>,

  // Summary
  sumLess: "1 · Daha az pipet",
  sumBetter: "2 · Daha iyi pipet",
  sumVerified: "3 · Doğrulanmış iddia",
  sumYearly: (pct: string) => `yıllık tasarruf (orta senaryo, ${pct})`,
  sumStraws: (biz: string, n: string, lo: string, hi: string) => `${biz}: yılda ${n} pipet daha az. Aralık ${lo} – ${hi}.`,
  sumFits: (cost: string, today: string) => `Tasarrufla bütçe nötr: kalan pipetler için günlük maliyet ${cost}, bugün ${today}.`,
  sumOver: (extra: string) => `Orta senaryoda günde ${extra} ek maliyet; yine de en dengeli seçenek.`,
  sumVerifyPending: "Tedarikçinin iddiasını aşağıda doğrulayın. Sonuç buraya eklenecek.",
  sumGoVerify: "Doğrulamaya git",

  reason: (r: Reason, f: Formatters) => {
    switch (r.code) {
      case "fits":
        return `Orta senaryoda bütçe nötr: birim fiyat (~${f.tl(r.midPrice, 2)}) tavanın (${f.tl(r.cap, 2)}) altında.`;
      case "over":
        return `Orta senaryoda bütçeyi aşar: birim fiyat (~${f.tl(r.midPrice, 2)}) tavanın (${f.tl(r.cap, 2)}) üstünde.`;
      case "pfasHigh":
        return "PFAS riski yüksek.";
      case "pfasUnknown":
        return "PFAS durumu tedarikçiden teyit edilmeli.";
      case "industrialOnly":
        return "Yalnızca endüstriyel kompostta çözünür.";
      case "noSoften":
        return "İçecekte yumuşamaz.";
      case "softens":
        return "İçecekte yumuşar.";
    }
  },
};

export type Dict = typeof tr;

const en: Dict = {
  metaTitle: "STRAWISE — The right straw for the right business",
  langLabel: "Language",
  heroA: "Fewer straws",
  heroB: "better straws",
  heroC: "= same cost",
  heroLead:
    'Answer 3 questions about your café or restaurant. See how much you save with a "straws on request only" default, which verified material that saving lets you switch to, and check a supplier\'s "biodegradable" claim against its certificate with AI.',

  introTitle: "Tell us about your business",
  summaryTitle: "Summary",
  savingsTitle: "Straws on request: savings",
  savingsLead:
    "Usage drops when a straw is handed out only if the customer asks. The three scenarios reflect the range seen in field studies.",
  materialsTitle: "Materials your savings can pay for",
  materialsLead:
    "Ranked for your business type by budget (budget-neutral price in the mid scenario), resistance to going soggy, home compostability and PFAS risk.",
  verifyTitle: "Verify a supplier claim",
  verifyLead:
    "Paste the supplier's claim and the certificate or product sheet text. The AI extracts the standard, the certificate number and whether the claim matches the certified scope.",
  footer: 'Values tagged "sample data" are unsourced placeholders and will be updated. Verification results are decision support.',

  q1: "1. Business type",
  q2: "2. Average straws used per day",
  q2Placeholder: "e.g. 150",
  q3: "3. Current straw type and unit price",
  currentTypeAria: "Current straw type",
  unitPriceAria: "Unit price (TL)",
  errUsage: (max: string) => `Daily straw use must be between 1 and ${max}.`,
  errPrice: "Enter a unit price in TL greater than 0 (e.g. 0.40).",
  calculate: "Calculate",
  trySample: "Try a sample café",

  scenario: { alt: "Low scenario", orta: "Mid scenario", ust: "High scenario" },
  perDay: (from: string, to: string) => `${from} → ${to} straws a day`,
  colReduced: "Fewer",
  colSaved: "Saved",
  periodDaily: "Daily",
  periodMonthly: "Monthly",
  periodYearly: "Yearly",
  strawsUnit: "straws",
  budgetNeutral: "Unit price you can pay with no change in total spend:",
  assumptionsTitle: "Assumptions and sources",
  assumeReduction: (a: string, b: string, c: string) =>
    `With a "straws on request only" default, usage falls by ${a} (low), ${b} (mid) and ${c} (high).`,
  assumePrice: (p: string) => `Savings use your current unit price (${p}) and assume the material stays the same.`,
  assumeDays: (m: number, y: number) => `Month = ${m} days, year = ${y} days.`,
  assumeFormula: "Budget-neutral unit price = current unit price ÷ (1 − reduction rate).",

  recommended: "Recommended",
  perUnit: "/ unit",
  sameCost: "Same as today's cost",
  cheaper: (v: string) => `${v} a day cheaper`,
  extra: (v: string) => `${v} a day extra`,
  vsToday: "mid scenario, vs. today's spend",
  pfas: { yok: "PFAS-free", bilinmiyor: "PFAS unknown", yuksek: "High PFAS risk" },
  homeCompost: "Home compostable",
  industrialCompost: "Industrial compost",
  durability: "Stays firm",
  durabilityAria: (v: number) => `Durability ${v}/5`,
  budgetNeutralIn: (list: string) => `Budget-neutral in: ${list}.`,
  source: "Source",
  sampleTag: "sample data",
  sampleTagTitle: "Unsourced sample value — to be updated in data/materials.json",

  fillSample: "Fill sample",
  nextSample: "Next",
  claimLabel: "Supplier's claim",
  claimPlaceholder: "e.g. 100% biodegradable, home compostable",
  docLabel: "Certificate or product sheet text",
  docPlaceholder: "Paste the text from the certificate PDF or product page here.",
  verifying: "AI is reviewing the document…",
  verify: "Verify claim",
  verifyEmpty:
    "The result will appear here. The LLM checks the claim only against the pasted document and returns a structured report.",
  verifyFailed: "Verification failed.",
  badResponse: "The server returned an invalid response.",
  reportTitle: "Verification report",
  fClaim: "Claim",
  fStandards: "Standards in the document",
  noStandards: "No standard found",
  foundInText: "Found verbatim in the text",
  notFoundInText: "Not found verbatim in the text",
  fCert: "Certificate no. / body",
  fReason: "Reasoning",
  fMissing: "Missing information",
  crossCheck: "Rule-based cross-check: standards found in the document by pattern matching",
  none: "none",
  unsupported: (list: string) => ` The model reported ${list}, which does not appear verbatim in the text; check manually.`,
  modelNote: (m: string) => `Model: ${m} · Decision support only, not a legal approval.`,
  verdict: { doğrulandı: "Verified", kısmen: "Partially verified", doğrulanamadı: "Not verified" },

  sumLess: "1 · Fewer straws",
  sumBetter: "2 · Better straws",
  sumVerified: "3 · Verified claim",
  sumYearly: (pct: string) => `saved per year (mid scenario, ${pct})`,
  sumStraws: (biz: string, n: string, lo: string, hi: string) => `${biz}: ${n} fewer straws a year. Range ${lo} – ${hi}.`,
  sumFits: (cost: string, today: string) => `Budget-neutral thanks to the savings: ${cost} a day for the remaining straws, vs. ${today} today.`,
  sumOver: (extra: string) => `${extra} a day extra in the mid scenario; still the most balanced option.`,
  sumVerifyPending: "Verify the supplier's claim below. The result will be added here.",
  sumGoVerify: "Go to verification",

  reason: (r: Reason, f: Formatters) => {
    switch (r.code) {
      case "fits":
        return `Budget-neutral in the mid scenario: unit price (~${f.tl(r.midPrice, 2)}) is below the cap (${f.tl(r.cap, 2)}).`;
      case "over":
        return `Over budget in the mid scenario: unit price (~${f.tl(r.midPrice, 2)}) is above the cap (${f.tl(r.cap, 2)}).`;
      case "pfasHigh":
        return "High PFAS risk.";
      case "pfasUnknown":
        return "Confirm PFAS status with the supplier.";
      case "industrialOnly":
        return "Breaks down only in industrial compost.";
      case "noSoften":
        return "Does not go soggy in drinks.";
      case "softens":
        return "Goes soggy in drinks.";
    }
  },
};

export const DICTS: Record<Lang, Dict> = { tr, en };
