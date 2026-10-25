"use client";

import { useState } from "react";
import type { Intake } from "@/lib/data";
import { rankMaterials } from "@/lib/rank";
import { computeScenarios } from "@/lib/savings";
import type { VerifyResponse } from "@/lib/verify";
import { IntakeForm } from "./components/IntakeForm";
import { MaterialList } from "./components/MaterialList";
import { SavingsTable } from "./components/SavingsTable";
import { Summary } from "./components/Summary";
import { Section } from "./components/ui";
import { VerifyPanel } from "./components/VerifyPanel";

export default function Home() {
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
      <header className="pt-10 pb-8 sm:pt-16 sm:pb-12">
        <p className="text-sm font-semibold tracking-[0.2em] text-leaf">STRAWISE</p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
          Daha az pipet <span className="text-muted">+</span> daha iyi pipet{" "}
          <span className="relative whitespace-nowrap">
            <span className="absolute inset-x-0 bottom-1 -z-10 h-3 bg-straw sm:h-4" aria-hidden />= aynı maliyet
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Kafe veya restoranınız için 3 soruyu cevaplayın. &quot;Sorulmadan verilmez&quot; ile ne kadar tasarruf
          edeceğinizi, bu tasarrufla hangi doğrulanmış malzemeye geçebileceğinizi görün ve tedarikçinin
          &quot;biyobozunur&quot; iddiasını yapay zekâyla sertifikasına göre denetleyin.
        </p>
      </header>

      <div className="grid gap-14">
        <Section id="giris" step="01" title="İşletmenizi tanıyalım">
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <IntakeForm onSubmit={handleIntake} />
          </div>
        </Section>

        {intake && scenarios && ranked && (
          <>
            <Section id="ozet" step="★" title="Sonuç özeti">
              <Summary intake={intake} scenarios={scenarios} top={ranked[0]} verification={verification} />
            </Section>

            <Section
              id="tasarruf"
              step="02"
              title="Sorulmadan verilmez: tasarruf"
              lead="Pipet yalnızca müşteri isterse verildiğinde kullanım düşer. Üç senaryo, saha çalışmalarının aralığını gösterir."
            >
              <SavingsTable scenarios={scenarios} dailyUsage={intake.dailyUsage} unitPrice={intake.unitPrice} />
            </Section>

            <Section
              id="oneri"
              step="03"
              title="Tasarrufla geçebileceğiniz malzemeler"
              lead="Bütçe (orta senaryodaki bütçe nötr fiyat), yumuşamama, ev kompostu ve PFAS riskine göre işletme tipinize ağırlıklandırılmış sıralama."
            >
              <MaterialList ranked={ranked} />
            </Section>
          </>
        )}

        <Section
          id="dogrulama"
          step={intake ? "04" : "02"}
          title="Tedarikçi iddiasını doğrula"
          lead="Tedarikçinin iddiasını ve sertifika ya da ürün belgesi metnini yapıştırın. Yapay zekâ, belgede geçen standardı, sertifika numarasını ve iddianın kapsamla uyumunu çıkarır."
        >
          <VerifyPanel result={verification} onResult={setVerification} />
        </Section>
      </div>

      <footer className="mt-20 border-t border-line pt-6 text-xs leading-relaxed text-muted">
        <p>
          STRAWISE · Climathon 2026 · Ilgın Güven. &quot;Örnek veri&quot; etiketli değerler kaynaksızdır ve
          güncellenecektir. Doğrulama sonuçları karar desteği içindir.
        </p>
      </footer>
    </div>
  );
}
