import { isSample, SCENARIO_LABELS, SOURCES, type Material } from "@/lib/data";
import { fmtTl } from "@/lib/format";
import type { RankedMaterial } from "@/lib/rank";
import { SampleTag } from "./ui";

type Props = {
  ranked: RankedMaterial[];
};

const PFAS_LABEL = { yok: "PFAS yok", bilinmiyor: "PFAS bilinmiyor", yuksek: "PFAS riski yüksek" } as const;
const PFAS_STYLE = {
  yok: "bg-leaf-soft text-leaf",
  bilinmiyor: "bg-warn-soft text-warn",
  yuksek: "bg-bad-soft text-bad",
} as const;

function Tag({ m, field }: { m: Material; field: string }) {
  return isSample(m, field) ? <SampleTag /> : null;
}

function DurabilityMeter({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Dayanım ${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`h-2 w-3 rounded-[2px] ${i <= value ? "bg-ink" : "bg-line"}`} />
      ))}
    </span>
  );
}

export function MaterialList({ ranked }: Props) {
  return (
    <ol className="grid gap-3">
      {ranked.map((r, i) => {
        const m = r.material;
        const isTop = i === 0;
        const delta = r.dailyDeltaTl;
        const deltaLabel =
          Math.abs(delta) < 0.005
            ? "Bugünkü maliyetle aynı"
            : delta > 0
              ? `Günde ${fmtTl(delta, 2)} daha ucuz`
              : `Günde ${fmtTl(-delta, 2)} ek maliyet`;
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
                    {m.ad}
                    {isTop && (
                      <span className="ml-2 rounded-full bg-leaf px-2 py-0.5 align-middle text-xs font-semibold text-paper">
                        Önerilen
                      </span>
                    )}
                  </h3>
                  <p className="num text-sm text-muted">
                    {fmtTl(m.birim_fiyat_tl.min, 2)} – {fmtTl(m.birim_fiyat_tl.max, 2)} / adet
                    <Tag m={m} field="birim_fiyat_tl" />
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`num text-sm font-semibold ${delta >= 0 ? "text-leaf" : "text-warn"}`}>
                  {deltaLabel}
                </p>
                <p className="text-xs text-muted">orta senaryo, bugünkü harcamaya göre</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
              {m.sertifikalar.map((c) => (
                <span key={c} className="rounded-md border border-line bg-paper px-2 py-0.5 font-medium">
                  {c}
                </span>
              ))}
              <Tag m={m} field="sertifikalar" />
              <span className={`rounded-md px-2 py-0.5 font-semibold ${PFAS_STYLE[m.pfas_riski]}`}>
                {PFAS_LABEL[m.pfas_riski]}
              </span>
              <Tag m={m} field="pfas_riski" />
              <span className="rounded-md bg-paper px-2 py-0.5">{m.ev_kompost ? "Ev kompostu" : "Endüstriyel kompost"}</span>
              <Tag m={m} field="ev_kompost" />
              <span className="ml-1 inline-flex items-center gap-1.5 text-muted">
                Yumuşamama <DurabilityMeter value={m.dayanim} />
              </span>
              <Tag m={m} field="dayanim" />
            </div>

            <p className="mt-3 text-sm leading-relaxed">
              {m.not}
              <Tag m={m} field="not" />
            </p>

            <ul className="mt-2 grid gap-0.5 text-[13px] text-muted">
              {r.reasons.map((reason) => (
                <li key={reason}>→ {reason}</li>
              ))}
              {r.budgetNeutralIn.length > 0 && (
                <li>→ Bütçe nötr olduğu senaryolar: {r.budgetNeutralIn.map((k) => SCENARIO_LABELS[k]).join(", ")}.</li>
              )}
            </ul>

            {m.kaynaklar.length > 0 && (
              <p className="mt-2 border-t border-line pt-2 text-[12px] text-muted">
                Kaynak: {m.kaynaklar.map((k) => SOURCES[k]).join(" · ")}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
