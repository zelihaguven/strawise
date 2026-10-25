"use client";

import { useState, type FormEvent } from "react";
import { BUSINESS_TYPES, CURRENT_TYPES, nameOf, type BusinessType, type Intake } from "@/lib/data";
import { SAMPLE_INTAKE } from "@/lib/samples";
import { useLang } from "./LangProvider";
import { ghostButton, inputClass, primaryButton } from "./ui";

type Props = {
  onSubmit: (intake: Intake) => void;
};

const MAX_DAILY = 100_000;
const MAX_PRICE = 100;

const parseNum = (s: string) => Number(s.replace(",", "."));

export function IntakeForm({ onSubmit }: Props) {
  const { lang, t, f } = useLang();
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
      setError(t.errUsage(f.int(MAX_DAILY)));
      return;
    }
    if (!Number.isFinite(price) || price <= 0 || price > MAX_PRICE) {
      setError(t.errPrice);
      return;
    }
    submit({ businessType, dailyUsage: Math.round(usage), currentType, unitPrice: price });
  }

  function fillSample() {
    setBusinessType(SAMPLE_INTAKE.businessType);
    setDailyUsage(String(SAMPLE_INTAKE.dailyUsage));
    setCurrentType(SAMPLE_INTAKE.currentType);
    setUnitPrice(lang === "tr" ? String(SAMPLE_INTAKE.unitPrice).replace(".", ",") : String(SAMPLE_INTAKE.unitPrice));
    submit(SAMPLE_INTAKE);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">{t.q1}</legend>
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
              {nameOf(b, lang)}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="grid gap-2">
        <span className="text-sm font-semibold">{t.q2}</span>
        <input
          inputMode="numeric"
          className={inputClass}
          placeholder={t.q2Placeholder}
          value={dailyUsage}
          onChange={(e) => setDailyUsage(e.target.value)}
        />
      </label>

      <div className="grid gap-2">
        <span className="text-sm font-semibold">{t.q3}</span>
        <div className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1fr_12rem]">
          <select
            aria-label={t.currentTypeAria}
            className={inputClass}
            value={currentType}
            onChange={(e) => setCurrentType(e.target.value)}
          >
            {CURRENT_TYPES.map((ct) => (
              <option key={ct.id} value={ct.id}>
                {nameOf(ct, lang)}
              </option>
            ))}
          </select>
          <div className="relative w-32 sm:w-auto">
            <input
              aria-label={t.unitPriceAria}
              inputMode="decimal"
              className={`${inputClass} pr-10`}
              placeholder={lang === "tr" ? "0,40" : "0.40"}
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
          {t.calculate}
        </button>
        <button type="button" onClick={fillSample} className={ghostButton}>
          {t.trySample}
        </button>
      </div>
    </form>
  );
}
