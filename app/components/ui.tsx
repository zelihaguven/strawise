import type { ReactNode } from "react";
import { useLang } from "./LangProvider";

export function SampleTag() {
  const { t } = useLang();
  return (
    <span
      title={t.sampleTagTitle}
      className="ml-1 inline-block rounded-sm border border-dashed border-warn/60 bg-warn-soft px-1 py-px align-middle text-[10px] font-semibold uppercase tracking-wide text-warn"
    >
      {t.sampleTag}
    </span>
  );
}

type SectionProps = {
  id: string;
  step: string;
  title: string;
  lead?: ReactNode;
  children: ReactNode;
};

export function Section({ id, step, title, lead, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="reveal scroll-mt-6">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-display text-sm font-semibold text-leaf">{step}</span>
        <h2 id={`${id}-h`} className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
      </div>
      {lead && <p className="mb-5 max-w-2xl text-[15px] leading-relaxed text-muted">{lead}</p>}
      {children}
    </section>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-[15px] text-ink shadow-[inset_0_1px_0_rgb(0_0_0/0.03)] transition-colors placeholder:text-muted/60 hover:border-muted/50 focus:border-leaf focus:outline-none";

export const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[15px] font-semibold text-paper shadow-[0_2px_0_var(--leaf)] transition-transform hover:-translate-y-px active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50";

export const ghostButton =
  "inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-straw-soft";
