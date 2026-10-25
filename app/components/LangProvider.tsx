"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import type { Lang } from "@/lib/data";
import { formatters, type Formatters } from "@/lib/format";
import { DICTS, LANGS, type Dict } from "@/lib/i18n";

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
  f: Formatters;
}

const LangContext = createContext<LangContextValue | null>(null);
const STORAGE_KEY = "strawise-lang";

function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  if (fromUrl === "tr" || fromUrl === "en") return fromUrl;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "tr" || stored === "en") return stored;
  } catch {
    // Storage can be blocked (private mode); fall through to the default.
  }
  return "tr";
}

// Tiny external store: the chosen language lives outside React so the server
// snapshot ("tr") and the client's saved choice reconcile without an effect.
let currentLang: Lang | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Lang {
  currentLang ??= initialLang();
  return currentLang;
}

function setLang(next: Lang) {
  currentLang = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Non-critical: the choice just won't persist.
  }
  const url = new URL(window.location.href);
  url.searchParams.set("lang", next);
  window.history.replaceState(null, "", url);
  listeners.forEach((l) => l());
}

export function LangProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, () => "tr" as Lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = DICTS[lang].metaTitle;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t: DICTS[lang], f: formatters(lang) }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}

export function LangSwitch() {
  const { lang, setLang, t } = useLang();
  return (
    <div role="group" aria-label={t.langLabel} className="inline-flex rounded-full border border-ink/20 bg-surface p-0.5 text-sm font-semibold">
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-3 py-1 transition-colors ${lang === l ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
