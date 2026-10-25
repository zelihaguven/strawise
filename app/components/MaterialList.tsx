import { isSample, nameOf, noteOf, sourceOf, type Material } from "@/lib/data";
import type { RankedMaterial } from "@/lib/rank";
import { useLang } from "./LangProvider";
import { SampleTag } from "./ui";

type Props = {
  ranked: RankedMaterial[];
};

const PFAS_STYLE = {
  yok: "bg-leaf-soft text-leaf",
  bilinmiyor: "bg-warn-soft text-warn",
  yuksek: "bg-bad-soft text-bad",
} as const;

function Tag({ m, field }: { m: Material; field: string }) {
  return isSample(m, field) ? <SampleTag /> : null;
}

function DurabilityMeter({ value }: { value: number }) {
  const { t } = useLang();
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={t.durabilityAria(value)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`h-2 w-3 rounded-[2px] ${i <= value ? "bg-ink" : "bg-line"}`} />
      ))}
    </span>
  );
}

export function MaterialList({ ranked }: Props) {
  const { lang, t, f } = useLang();
  return (
    <ol className="grid gap-3">
      {ranked.map((r, i) => {
        const m = r.material;
        const isTop = i === 0;
        const delta = r.dailyDeltaTl;
        const deltaLabel =
          Math.abs(delta) < 0.005 ? t.sameCost : delta > 0 ? t.cheaper(f.tl(delta, 2)) : t.extra(f.tl(-delta, 2));
        return (
          <li
            key={m.id}
            className={`relative rounded-xl border bg-surface p-4 sm:p-5 ${isTop ? "border-leaf shadow-[4px_4px_0_var(--leaf)]" : "border-line"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl leading-none font-semibold text-muted/50">{i + 1}</span>
                <div>
                  <h3 className="text-lg font-semibold">
                    {nameOf(m, lang)}
                    {isTop && (
                      <span className="ml-2 rounded-full bg-leaf px-2 py-0.5 align-middle text-xs font-semibold text-paper">
                        {t.recommended}
                      </span>
                    )}
                  </h3>
                  <p className="num text-sm text-muted">
                    {f.tl(m.birim_fiyat_tl.min, 2)} – {f.tl(m.birim_fiyat_tl.max, 2)} {t.perUnit}
                    <Tag m={m} field="birim_fiyat_tl" />
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`num text-sm font-semibold ${delta >= -0.005 ? "text-leaf" : "text-warn"}`}>{deltaLabel}</p>
                <p className="text-xs text-muted">{t.vsToday}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
              {m.sertifikalar.map((c) => (
                <span key={c} className="rounded-md border border-line bg-paper px-2 py-0.5 font-medium">
                  {c}
                </span>
              ))}
              <Tag m={m} field="sertifikalar" />
              <span className={`rounded-md px-2 py-0.5 font-semibold ${PFAS_STYLE[m.pfas_riski]}`}>{t.pfas[m.pfas_riski]}</span>
              <Tag m={m} field="pfas_riski" />
              <span className="rounded-md bg-paper px-2 py-0.5">{m.ev_kompost ? t.homeCompost : t.industrialCompost}</span>
              <Tag m={m} field="ev_kompost" />
              <span className="ml-1 inline-flex items-center gap-1.5 text-muted">
                {t.durability} <DurabilityMeter value={m.dayanim} />
              </span>
              <Tag m={m} field="dayanim" />
            </div>

            <p className="mt-3 text-sm leading-relaxed">
              {noteOf(m, lang)}
              <Tag m={m} field="not" />
            </p>

            <ul className="mt-2 grid gap-0.5 text-[13px] text-muted">
              {r.reasons.map((reason) => (
                <li key={reason.code}>→ {t.reason(reason, f)}</li>
              ))}
              {r.budgetNeutralIn.length > 0 && (
                <li>→ {t.budgetNeutralIn(r.budgetNeutralIn.map((k) => t.scenario[k]).join(", "))}</li>
              )}
            </ul>

            {m.kaynaklar.length > 0 && (
              <p className="mt-2 border-t border-line pt-2 text-[12px] text-muted">
                {t.source}: {m.kaynaklar.map((k) => sourceOf(k, lang)).join(" · ")}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
