import type { Intake, Lang } from "@/lib/data";

/** Demo inputs so the jury can try the flow in one click. 150/gün is the PDR's per-business assumption. */
export const SAMPLE_INTAKE: Intake = {
  businessType: "kafe",
  dailyUsage: 150,
  currentType: "kagit",
  unitPrice: 0.4,
};

export interface VerifySample {
  label: string;
  claim: string;
  documentText: string;
}

// Fictional documents; the certifier and numbers are made up for the demo.
export const VERIFY_SAMPLES: Record<Lang, VerifySample[]> = {
  tr: [
    {
      label: "Kapsamı dar sertifika",
      claim:
        "Pipetlerimiz %100 biyobozunurdur: evde kompostta, toprakta ve denizde tamamen yok olur. Plastik içermez.",
      documentText: `UYGUNLUK SERTİFİKASI (KURGUSAL ÖRNEK)
Belgelendirme kuruluşu: Örnek Belgelendirme ve Test A.Ş.
Sertifika No: OBT-IC-2024-0417
Sertifika sahibi: Yeşil Pipet Ltd. Şti.
Ürün: "GreenSip" PLA pipet, çap 6 mm, et kalınlığı en fazla 0,25 mm
Uygulanan standart: EN 13432:2000 – Ambalaj: kompostlaşma ve biyolojik parçalanma yoluyla geri kazanılabilir ambalaj gereklilikleri
Sonuç: Ürün, ENDÜSTRİYEL kompostlaştırma tesislerinde (58 °C ± 2 °C) 12 hafta içinde parçalanma ve 6 ay içinde %90 biyolojik bozunma gerekliliklerini karşılamaktadır.
Not: Bu sertifika ev kompostu, toprak veya deniz ortamındaki biyolojik bozunmayı kapsamaz.
Geçerlilik: 15.03.2024 – 14.03.2027`,
    },
    {
      label: "Belgesiz iddia",
      claim: "Kâğıt pipetlerimiz kompostlanabilir ve PFAS içermez, sertifikalıdır.",
      documentText: `ÜRÜN TEKNİK BİLGİ FORMU (KURGUSAL ÖRNEK)
Ürün: Eko kâğıt pipet, 3 katlı, 8 mm
Malzeme: Gıdaya uygun kâğıt, su bazlı yapıştırıcı
Kullanım: Soğuk içecekler için uygundur, 2 saate kadar dayanır.
Doğa dostu, çevreci ve tamamen geri dönüştürülebilir.
Ambalaj: 500 adet / kutu, 20 kutu / koli
Menşei: İthal`,
    },
  ],
  en: [
    {
      label: "Narrow-scope certificate",
      claim:
        "Our straws are 100% biodegradable: they fully disappear in home compost, in soil and in the sea. Plastic-free.",
      documentText: `CERTIFICATE OF CONFORMITY (FICTIONAL SAMPLE)
Certification body: Sample Certification & Testing Ltd.
Certificate No: SCT-IC-2024-0417
Holder: Green Straw Ltd.
Product: "GreenSip" PLA straw, 6 mm diameter, wall thickness max 0.25 mm
Standard applied: EN 13432:2000 – Packaging recoverable through composting and biodegradation
Result: The product meets the requirements for disintegration within 12 weeks and 90% biodegradation within 6 months in INDUSTRIAL composting facilities (58 °C ± 2 °C).
Note: This certificate does not cover biodegradation in home compost, soil or marine environments.
Valid: 15.03.2024 – 14.03.2027`,
    },
    {
      label: "Undocumented claim",
      claim: "Our paper straws are compostable, PFAS-free and certified.",
      documentText: `PRODUCT DATA SHEET (FICTIONAL SAMPLE)
Product: Eco paper straw, 3-ply, 8 mm
Material: Food-grade paper, water-based adhesive
Use: Suitable for cold drinks, lasts up to 2 hours.
Nature-friendly, eco and fully recyclable.
Packaging: 500 per box, 20 boxes per carton
Origin: Imported`,
    },
  ],
};
