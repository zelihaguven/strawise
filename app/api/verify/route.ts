import {
  crossCheck,
  findStandards,
  MAX_CLAIM_CHARS,
  MAX_DOC_CHARS,
  parseVerifyResult,
  RESPONSE_SCHEMA,
  SYSTEM_PROMPT,
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

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

class ModelError extends Error {
  constructor(message: string, readonly retryable: boolean) {
    super(message);
  }
}

async function callGemini(model: string, apiKey: string, claim: string, documentText: string): Promise<unknown> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return errorResponse("Sunucuda GEMINI_API_KEY tanımlı değil.", 500);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (rateLimited(ip)) return errorResponse("Çok fazla istek. Lütfen bir dakika sonra tekrar deneyin.", 429);

  let body: { claim?: unknown; documentText?: unknown };
  try {
    body = await request.json();
  } catch {
    return errorResponse("Geçersiz istek gövdesi.", 400);
  }

  const claim = typeof body.claim === "string" ? body.claim.trim() : "";
  const documentText = typeof body.documentText === "string" ? body.documentText.trim() : "";
  if (claim.length < 5) return errorResponse("Tedarikçi iddiasını yazın.", 400);
  if (documentText.length < 20) return errorResponse("Sertifika veya ürün belgesi metnini yapıştırın.", 400);
  if (claim.length > MAX_CLAIM_CHARS) return errorResponse(`İddia en fazla ${MAX_CLAIM_CHARS} karakter olabilir.`, 400);
  if (documentText.length > MAX_DOC_CHARS) return errorResponse(`Belge metni en fazla ${MAX_DOC_CHARS} karakter olabilir.`, 400);

  const models = process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL, ...DEFAULT_MODELS] : DEFAULT_MODELS;
  let lastError = "Model yanıt vermedi.";

  for (const model of [...new Set(models)]) {
    try {
      const result = parseVerifyResult(await callGemini(model, apiKey, claim, documentText));
      const payload: VerifyResponse = {
        result,
        model,
        standardChecks: crossCheck(result.belgedeki_standartlar, documentText),
        regexStandards: findStandards(documentText),
      };
      return Response.json(payload);
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      const retryable = err instanceof ModelError ? err.retryable : true;
      console.error(`verify failed on ${model}: ${lastError}`);
      if (!retryable) break;
    }
  }

  return errorResponse(`Doğrulama şu anda yapılamadı: ${lastError}`, 502);
}
