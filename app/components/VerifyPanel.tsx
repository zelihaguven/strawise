"use client";

import { useState, type FormEvent } from "react";
import { VERIFY_SAMPLES } from "@/lib/samples";
import { MAX_CLAIM_CHARS, MAX_DOC_CHARS, type VerifyResponse } from "@/lib/verify";
import { useLang } from "./LangProvider";
import { VerdictBadge } from "./VerdictBadge";
import { ghostButton, inputClass, primaryButton } from "./ui";

type Props = {
  result: VerifyResponse | null;
  onResult: (r: VerifyResponse | null) => void;
};

export function VerifyPanel({ result, onResult }: Props) {
  const { lang, t, f } = useLang();
  const samples = VERIFY_SAMPLES[lang];
  const [claim, setClaim] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [sampleIndex, setSampleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function fillSample() {
    const s = samples[sampleIndex % samples.length];
    setClaim(s.claim);
    setDocumentText(s.documentText);
    setSampleIndex((i) => (i + 1) % samples.length);
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim, documentText, lang }),
      });
      const data = await res.json().catch(() => ({ error: t.badResponse }));
      if (!res.ok) throw new Error(data.error ?? t.verifyFailed);
      onResult(data as VerifyResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.verifyFailed);
      onResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  const nextSample = samples[sampleIndex % samples.length];

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr] lg:items-start">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={fillSample} className={ghostButton}>
            {t.fillSample}
          </button>
          <span className="text-xs text-muted">{t.nextSample}: {nextSample.label}</span>
        </div>
        <label className="grid gap-2">
          <span className="text-sm font-semibold">{t.claimLabel}</span>
          <textarea
            className={`${inputClass} min-h-20`}
            maxLength={MAX_CLAIM_CHARS}
            placeholder={t.claimPlaceholder}
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
          />
        </label>
        <label className="grid gap-2">
          <span className="flex justify-between text-sm font-semibold">
            {t.docLabel}
            <span className="num font-normal text-muted">
              {f.int(documentText.length)}/{f.int(MAX_DOC_CHARS)}
            </span>
          </span>
          <textarea
            className={`${inputClass} min-h-52 font-mono text-[13px] leading-relaxed`}
            maxLength={MAX_DOC_CHARS}
            placeholder={t.docPlaceholder}
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
          />
        </label>
        {error && (
          <p role="alert" className="rounded-lg bg-bad-soft px-3 py-2 text-sm text-bad">
            {error}
          </p>
        )}
        <div>
          <button type="submit" className={primaryButton} disabled={isLoading || !claim.trim() || !documentText.trim()}>
            {isLoading ? t.verifying : t.verify}
          </button>
        </div>
      </form>

      <div aria-live="polite">
        {result ? (
          <VerifyResultCard data={result} />
        ) : (
          <div className="grid min-h-48 place-items-center rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">
            {t.verifyEmpty}
          </div>
        )}
      </div>
    </div>
  );
}

function VerifyResultCard({ data }: { data: VerifyResponse }) {
  const { t } = useLang();
  const { result, standardChecks, regexStandards, model } = data;
  const unsupported = standardChecks.filter((c) => !c.metindeBulundu);
  return (
    <article className="reveal grid gap-4 rounded-xl border border-ink bg-surface p-5 shadow-[4px_4px_0_var(--straw)]">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-xl font-semibold">{t.reportTitle}</h3>
        <VerdictBadge verdict={result.uyum} />
      </header>

      <dl className="grid gap-3 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{t.fClaim}</dt>
          <dd className="mt-0.5">{result.iddia}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{t.fStandards}</dt>
          <dd className="mt-1 flex flex-wrap gap-1.5">
            {result.belgedeki_standartlar.length === 0 && <span className="text-muted">{t.noStandards}</span>}
            {standardChecks.map((c) => (
              <span
                key={c.standart}
                className={`rounded-md border px-2 py-0.5 text-xs font-medium ${c.metindeBulundu ? "border-line bg-paper" : "border-bad/40 bg-bad-soft text-bad"}`}
                title={c.metindeBulundu ? t.foundInText : t.notFoundInText}
              >
                {c.standart} {c.metindeBulundu ? "✓" : "?"}
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{t.fCert}</dt>
          <dd className="mt-0.5">{result.sertifika_no_veya_kurum}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{t.fReason}</dt>
          <dd className="mt-0.5 leading-relaxed">{result.gerekce}</dd>
        </div>
        {result.eksik_bilgiler.length > 0 && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{t.fMissing}</dt>
            <dd>
              <ul className="mt-1 grid list-disc gap-0.5 pl-5">
                {result.eksik_bilgiler.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>

      <footer className="border-t border-line pt-3 text-[12px] leading-relaxed text-muted">
        <p>
          {t.crossCheck}{" "}
          <strong className="text-ink">{regexStandards.length ? regexStandards.join(", ") : t.none}</strong>.
          {unsupported.length > 0 && t.unsupported(unsupported.map((u) => u.standart).join(", "))}
        </p>
        <p className="mt-1">{t.modelNote(model)}</p>
      </footer>
    </article>
  );
}
