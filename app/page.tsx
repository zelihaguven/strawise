"use client";

import { useState } from "react";
import type { Intake } from "@/lib/data";
import { rankMaterials } from "@/lib/rank";
import { computeScenarios } from "@/lib/savings";
import type { VerifyResponse } from "@/lib/verify";
import { IntakeForm } from "./components/IntakeForm";
import { LangProvider, LangSwitch, useLang } from "./components/LangProvider";
import { MaterialList } from "./components/MaterialList";
import { SavingsTable } from "./components/SavingsTable";
import { Summary } from "./components/Summary";
import { Section } from "./components/ui";
import { VerifyPanel } from "./components/VerifyPanel";

export default function Home() {
  return (
    <LangProvider>
      <App />
    </LangProvider>
  );
}

function App() {
  const { t } = useLang();
  const [intake, setIntake] = useState<Intake | null>(null);
  const [verification, setVerification] = useState<VerifyResponse | null>(null);

  const scenarios = intake ? computeScenarios(intake.dailyUsage, intake.unitPrice) : null;
  const ranked = intake ? rankMaterials(intake) : null;

  function handleIntake(next: Intake) {
    setIntake(next);
    requestAnimationFrame(() => document.getElementById("ozet")?.scrollIntoView({ behavior: "smooth" }));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
      <header className="pt-6 pb-8 sm:pt-10 sm:pb-12">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-[0.2em] text-leaf">STRAWISE</p>
          <LangSwitch />
        </div>
        <h1 className="font-display mt-6 max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tight sm:mt-8 sm:text-6xl">
          {t.heroA} <span className="text-muted">+</span> {t.heroB}{" "}
          <span className="relative whitespace-nowrap">
            <span className="absolute inset-x-0 bottom-1 -z-10 h-3 bg-straw sm:h-4" aria-hidden />
            {t.heroC}
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{t.heroLead}</p>
      </header>

      <div className="grid gap-14">
        <Section id="giris" step="01" title={t.introTitle}>
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <IntakeForm onSubmit={handleIntake} />
          </div>
        </Section>

        {intake && scenarios && ranked && (
          <>
            <Section id="ozet" step="★" title={t.summaryTitle}>
              <Summary intake={intake} scenarios={scenarios} top={ranked[0]} verification={verification} />
            </Section>

            <Section id="tasarruf" step="02" title={t.savingsTitle} lead={t.savingsLead}>
              <SavingsTable scenarios={scenarios} dailyUsage={intake.dailyUsage} unitPrice={intake.unitPrice} />
            </Section>

            <Section id="oneri" step="03" title={t.materialsTitle} lead={t.materialsLead}>
              <MaterialList ranked={ranked} />
            </Section>
          </>
        )}

        <Section id="dogrulama" step={intake ? "04" : "02"} title={t.verifyTitle} lead={t.verifyLead}>
          <VerifyPanel result={verification} onResult={setVerification} />
        </Section>
      </div>

      <footer className="mt-20 border-t border-line pt-6 text-xs leading-relaxed text-muted">
        <p>STRAWISE · Climathon 2026 · Ilgın Güven. {t.footer}</p>
      </footer>
    </div>
  );
}
