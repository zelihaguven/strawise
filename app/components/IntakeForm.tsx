"use client";

import { useState, type FormEvent } from "react";
import { BUSINESS_TYPES, CURRENT_TYPES, type BusinessType, type Intake } from "@/lib/data";
import { SAMPLE_INTAKE } from "@/lib/samples";
import { ghostButton, inputClass, primaryButton } from "./ui";

type Props = {
  onSubmit: (intake: Intake) => void;
};

const MAX_DAILY = 100_000;
const MAX_PRICE = 100;

const parseNum = (s: string) => Number(s.replace(",", "."));

export function IntakeForm({ onSubmit }: Props) {
  const [businessType, setBusinessType] = useState<BusinessType>("kafe");
  const [dailyUsage, setDailyUsage] = useState("");
  const [currentType, setCurrentType] = useState("plastik");
  const [unitPrice, setUnitPrice] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(intake: Intake) {
    setError(null);
    onSubmit(intake);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const usage = parseNum(dailyUsage);
    const price = parseNum(unitPrice);
    if (!Number.isFinite(usage) || usage < 1 || usage > MAX_DAILY) {
      setError(`Günlük pipet kullanımı 1 ile ${MAX_DAILY.toLocaleString("tr-TR")} arasında olmalı.`);
      return;
    }
    if (!Number.isFinite(price) || price <= 0 || price > MAX_PRICE) {
      setError("Birim fiyatı 0'dan büyük bir TL değeri olarak girin (ör. 0,40).");
      return;
    }
    submit({ businessType, dailyUsage: Math.round(usage), currentType, unitPrice: price });
  }

  function fillSample() {
    setBusinessType(SAMPLE_INTAKE.businessType);
    setDailyUsage(String(SAMPLE_INTAKE.dailyUsage));
    setCurrentType(SAMPLE_INTAKE.currentType);
    setUnitPrice(String(SAMPLE_INTAKE.unitPrice).replace(".", ","));
    submit(SAMPLE_INTAKE);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">1. İşletme tipi</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {BUSINESS_TYPES.map((b) => (
            <label
              key={b.id}
              className="cursor-pointer rounded-lg border border-line bg-surface px-3 py-2.5 text-center text-[15px] transition-colors hover:border-muted/50 has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-leaf"
            >
              <input
                type="radio"
                name="businessType"
                value={b.id}
                checked={businessType === b.id}
                onChange={() => setBusinessType(b.id)}
                className="sr-only"
              />
              {b.ad}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="grid gap-2">
        <span className="text-sm font-semibold">2. Günlük ortalama pipet kullanımı (adet)</span>
        <input
          inputMode="numeric"
          className={inputClass}
          placeholder="ör. 150"
          value={dailyUsage}
          onChange={(e) => setDailyUsage(e.target.value)}
        />
      </label>

      <div className="grid gap-2">
        <span className="text-sm font-semibold">3. Şu anki pipet tipi ve birim fiyatı</span>
        <div className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1fr_12rem]">
          <select
            aria-label="Şu anki pipet tipi"
            className={inputClass}
            value={currentType}
            onChange={(e) => setCurrentType(e.target.value)}
          >
            {CURRENT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.ad}
              </option>
            ))}
          </select>
          <div className="relative w-32 sm:w-auto">
            <input
              aria-label="Birim fiyat (TL)"
              inputMode="decimal"
              className={`${inputClass} pr-10`}
              placeholder="0,40"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted">TL</span>
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-bad-soft px-3 py-2 text-sm text-bad">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={primaryButton}>
          Hesapla
        </button>
        <button type="button" onClick={fillSample} className={ghostButton}>
          Örnek işletmeyle dene
        </button>
      </div>
    </form>
  );
}
