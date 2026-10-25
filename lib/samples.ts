import type { Intake } from "@/lib/data";

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
export const VERIFY_SAMPLES: VerifySample[] = [
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
];
