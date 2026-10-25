# STRAWISE

Kafe ve restoranlar için: "sorulmadan verilmez" ile pipet tasarrufunu hesapla, tasarrufla geçilebilecek doğrulanmış malzemeyi sırala, tedarikçinin "biyobozunur/kompostlanabilir" iddiasını Gemini ile sertifika metnine göre denetle.

## Çalıştırma

```bash
npm install
cp .env.example .env.local   # GEMINI_API_KEY değerini gir
npm run dev                  # http://localhost:3000
npm test                     # birim testleri
```

## Veriyi güncelleme

Tüm malzeme, fiyat ve varsayım değerleri `data/materials.json` içindedir. Bir malzemenin `ornek_veri` listesinde adı geçen alanlar arayüzde **örnek veri** etiketiyle gösterilir. Gerçek değeri girince alan adını `ornek_veri` listesinden çıkar ve kaynağı `kaynaklar` listesine ekle.

## Yapı

- `lib/savings.ts`: %40 / %50 / %60 senaryo hesabı
- `lib/rank.ts`: işletme tipi ve hacme göre ağırlıklı malzeme sıralaması
- `lib/verify.ts`: LLM JSON şeması, sistem talimatı, kural tabanlı standart çapraz kontrolü
- `app/api/verify/route.ts`: sunucu tarafı Gemini çağrısı (anahtar yalnızca sunucuda)
