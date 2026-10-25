import {
  crossCheck,
  findStandards,
  MAX_CLAIM_CHARS,
  MAX_DOC_CHARS,
  parseVerifyResult,
  RESPONSE_SCHEMA,
  systemPrompt,
  type VerifyResponse,
} from "@/lib/verify";

export const maxDuration = 30;

// 3.8-flash timed out under free-tier load in testing; 3.6-flash answers in ~3s and
// 3.5-flash-lite in <1s, so the lite model is the fast fallback when 3.6 returns 503.
const DEFAULT_MODELS = ["gemini-3.6-flash", "gemini-3.5-flash-lite"];
const MODEL_TIMEOUT_MS = 15_000;
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 60_000;

// Best-effort per-instance limiter so one visitor can't burn the free-tier quota.
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.set(ip, [...recent, now]);
  return recent.length >= RATE_LIMIT;
}

type Lang = "tr" | "en";

const ERRORS = {
  noKey: { tr: "Sunucuda GEMINI_API_KEY tanımlı değil.", en: "GEMINI_API_KEY is not set on the server." },
  rate: { tr: "Çok fazla istek. Lütfen bir dakika sonra tekrar deneyin.", en: "Too many requests. Please try again in a minute." },
  body: { tr: "Geçersiz istek gövdesi.", en: "Invalid request body." },
  claim: { tr: "Tedarikçi iddiasını yazın.", en: "Enter the supplier's claim." },
  doc: { tr: "Sertifika veya ürün belgesi metnini yapıştırın.", en: "Paste the certificate or product sheet text." },
  claimLong: { tr: `İddia en fazla ${MAX_CLAIM_CHARS} karakter olabilir.`, en: `The claim can be at most ${MAX_CLAIM_CHARS} characters.` },
  docLong: { tr: `Belge metni en fazla ${MAX_DOC_CHARS} karakter olabilir.`, en: `The document can be at most ${MAX_DOC_CHARS} characters.` },
  failed: { tr: "Doğrulama şu anda yapılamadı. Lütfen biraz sonra tekrar deneyin.", en: "Verification is unavailable right now. Please try again shortly." },
} satisfies Record<string, Record<Lang, string>>;

function errorResponse(key: keyof typeof ERRORS, lang: Lang, status: number) {
  return Response.json({ error: ERRORS[key][lang] }, { status });
}

class ModelError extends Error {
  constructor(message: string, readonly retryable: boolean) {
    super(message);
  }
}

async function callGemini(
  model: string,
  apiKey: string,
  lang: Lang,
  claim: string,
  documentText: string,
): Promise<unknown> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt(lang) }] },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `<tedarikci_iddiasi>\n${claim}\n</tedarikci_iddiasi>\n\n<belge_metni>\n${documentText}\n</belge_metni>`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json",
          responseJsonSchema: RESPONSE_SCHEMA,
          thinkingConfig: { thinkingLevel: "low" },
        },
      }),
      signal: AbortSignal.timeout(MODEL_TIMEOUT_MS),
    },
  );

  if (!res.ok) {
    const detail = await res.text();
    console.error(`Gemini ${model} ${res.status}: ${detail.slice(0, 500)}`);
    throw new ModelError(`Model hatası (${res.status})`, [404, 429, 500, 503].includes(res.status));
  }

  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text ?? "")
    .join("");
  if (!text) throw new ModelError("Model boş yanıt döndürdü.", true);
  return JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, ""));
}

export async function POST(request: Request) {
  let body: { claim?: unknown; documentText?: unknown; lang?: unknown };
  try {
    body = await request.json();
  } catch {
    return errorResponse("body", "tr", 400);
  }
  const lang: Lang = body.lang === "en" ? "en" : "tr";

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return errorResponse("noKey", lang, 500);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (rateLimited(ip)) return errorResponse("rate", lang, 429);

  const claim = typeof body.claim === "string" ? body.claim.trim() : "";
  const documentText = typeof body.documentText === "string" ? body.documentText.trim() : "";
  if (claim.length < 5) return errorResponse("claim", lang, 400);
  if (documentText.length < 20) return errorResponse("doc", lang, 400);
  if (claim.length > MAX_CLAIM_CHARS) return errorResponse("claimLong", lang, 400);
  if (documentText.length > MAX_DOC_CHARS) return errorResponse("docLong", lang, 400);

  const models = process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL, ...DEFAULT_MODELS] : DEFAULT_MODELS;

  for (const model of [...new Set(models)]) {
    try {
      const result = parseVerifyResult(await callGemini(model, apiKey, lang, claim, documentText));
      const payload: VerifyResponse = {
        result,
        model,
        standardChecks: crossCheck(result.belgedeki_standartlar, documentText),
        regexStandards: findStandards(documentText),
      };
      return Response.json(payload);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const retryable = err instanceof ModelError ? err.retryable : true;
      console.error(`verify failed on ${model}: ${message}`);
      if (!retryable) break;
    }
  }

  return errorResponse("failed", lang, 502);
}
