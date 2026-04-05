import { put, get } from '@vercel/blob';
import { readFile } from 'node:fs/promises';
export { renderers } from '../../../renderers.mjs';

const POLYMARKET_EVENT_SLUG = "peru-presidential-election-winner";
const POLYMARKET_EVENT_URL = `https://gamma-api.polymarket.com/events/slug/${POLYMARKET_EVENT_SLUG}`;
const POLYMARKET_PAGE_URL = `https://polymarket.com/es/event/${POLYMARKET_EVENT_SLUG}`;
const POLYMARKET_BLOB_PATHNAME = `polymarket/${POLYMARKET_EVENT_SLUG}/latest.json`;
const POLYMARKET_USER_AGENT = "DecidePeru/1.0 (+https://decideperu.app)";

function parseStringArray(value) {
  if (Array.isArray(value)) return value.map((item) => String(item));
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map((item) => String(item)) : [];
    } catch {
      return [];
    }
  }
  return [];
}
function toNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}
function extractCandidateName(question) {
  return question.replace(/^Will\s+/i, "").replace(/\s+win the 2026 Peruvian presidential election\?$/i, "").trim();
}
function isPlaceholderCandidate(name) {
  return /^candidate\s+[a-z]$/i.test(name) || /^another candidate$/i.test(name);
}
function isValidCandidate(candidate) {
  return Boolean(
    candidate && candidate.name && typeof candidate.name === "string" && candidate.yesTokenId && typeof candidate.yesTokenId === "string" && typeof candidate.probability === "number" && Number.isFinite(candidate.probability)
  );
}
function sortPolymarketCandidates(candidates) {
  return [...candidates].sort(
    (a, b) => b.probability - a.probability || b.volume24h - a.volume24h || a.name.localeCompare(b.name, "es")
  );
}
function assertValidSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") {
    throw new Error("Snapshot inválido: se esperaba un objeto.");
  }
  const candidates = Array.isArray(snapshot.candidates) ? snapshot.candidates.filter(isValidCandidate) : [];
  if (candidates.length < 3) {
    throw new Error(`Snapshot inválido: se esperaban al menos 3 candidatos válidos y llegaron ${candidates.length}.`);
  }
  return {
    ...snapshot,
    candidates: sortPolymarketCandidates(candidates)
  };
}
function normalizeGammaEvent(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("Polymarket devolvió un payload vacío o inválido.");
  }
  if (!Array.isArray(raw.markets)) {
    throw new Error("Polymarket no devolvió mercados en el payload.");
  }
  const candidates = raw.markets.map((market) => {
    const question = market.question?.trim() ?? "";
    const name = extractCandidateName(question);
    const outcomes = parseStringArray(market.outcomes);
    const prices = parseStringArray(market.outcomePrices).map((value) => toNumber(value));
    const tokenIds = parseStringArray(market.clobTokenIds);
    const yesIndex = outcomes.findIndex((outcome) => outcome.toLowerCase() === "yes");
    const yesTokenId = yesIndex >= 0 ? tokenIds[yesIndex] : "";
    const probability = yesIndex >= 0 ? (prices[yesIndex] ?? 0) * 100 : 0;
    if (!market.active || !question || !yesTokenId || !prices.length || isPlaceholderCandidate(name)) {
      return null;
    }
    return {
      name,
      slug: market.slug ?? "",
      probability,
      bestBid: toNumber(market.bestBid) * 100,
      bestAsk: toNumber(market.bestAsk) * 100,
      lastTradePrice: toNumber(market.lastTradePrice) * 100,
      hourChange: toNumber(market.oneHourPriceChange) * 100,
      dayChange: toNumber(market.oneDayPriceChange) * 100,
      volume24h: toNumber(market.volume24hr),
      volume: toNumber(market.volume),
      liquidity: toNumber(market.liquidity),
      yesTokenId
    };
  }).filter((candidate) => Boolean(candidate));
  return assertValidSnapshot({
    title: raw.title ?? "Peru Presidential Election Winner",
    slug: raw.slug ?? POLYMARKET_EVENT_SLUG,
    active: Boolean(raw.active),
    closed: Boolean(raw.closed),
    endDate: raw.endDate ?? null,
    updatedAt: raw.updatedAt ?? (/* @__PURE__ */ new Date()).toISOString(),
    sourceUrl: POLYMARKET_PAGE_URL,
    volume24h: toNumber(raw.volume24hr),
    volume: toNumber(raw.volume),
    liquidity: toNumber(raw.liquidity),
    openInterest: toNumber(raw.openInterest),
    candidates
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function serializeError$1(error) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }
  return { message: String(error) };
}
async function readResponseSnippet(response) {
  try {
    const text = await response.clone().text();
    return text.slice(0, 400);
  } catch {
    return "";
  }
}
async function fetchLivePeruElectionMarketSnapshot({
  fetchImpl = fetch,
  logger = console,
  timeoutMs = 3500,
  retries = 2,
  retryDelaysMs = [400]
} = {}) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(POLYMARKET_EVENT_URL, {
        headers: {
          accept: "application/json",
          "user-agent": POLYMARKET_USER_AGENT
        },
        signal: controller.signal
      });
      const contentType = response.headers.get("content-type") || "";
      if (!response.ok) {
        const bodySnippet = await readResponseSnippet(response);
        throw new Error(`Polymarket respondió ${response.status}. Body: ${bodySnippet || "sin contenido"}`);
      }
      if (!contentType.includes("application/json")) {
        const bodySnippet = await readResponseSnippet(response);
        throw new Error(`Polymarket devolvió content-type inesperado: ${contentType || "desconocido"}. Body: ${bodySnippet || "sin contenido"}`);
      }
      const raw = await response.json();
      return normalizeGammaEvent(raw);
    } catch (error) {
      lastError = error;
      logger.error?.("[polymarket] Falló el fetch live", {
        url: POLYMARKET_EVENT_URL,
        attempt,
        retries,
        timeoutMs,
        error: serializeError$1(error)
      });
      if (attempt < retries) {
        await sleep(retryDelaysMs[attempt - 1] ?? retryDelaysMs.at(-1) ?? 0);
      }
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Polymarket falló sin detalle adicional.");
}

const peruElectionWinnerSeed = {
  title: "Peru Presidential Election Winner",
  slug: "peru-presidential-election-winner",
  active: true,
  closed: false,
  endDate: "2026-04-12T00:00:00Z",
  updatedAt: "2026-04-05T14:15:48.458545Z",
  sourceUrl: "https://polymarket.com/es/event/peru-presidential-election-winner",
  volume24h: 644927.8912129999,
  volume: 6335910402711998e-9,
  liquidity: 123499840449e-5,
  openInterest: 852618.5345170001,
  candidates: [
    {
      name: "Carlos Álvarez",
      slug: "will-carlos-alvarez-win-the-2026-peruvian-presidential-election",
      probability: 30.05,
      bestBid: 30,
      bestAsk: 30.1,
      lastTradePrice: 31.4,
      hourChange: 0,
      dayChange: 0,
      volume24h: 0,
      volume: 0,
      liquidity: 0,
      yesTokenId: "96778993542273611384637311499081700062825144626170214374801025348770797572532"
    },
    {
      name: "Keiko Fujimori",
      slug: "will-keiko-fujimori-win-the-2026-peruvian-presidential-election",
      probability: 25,
      bestBid: 24.9,
      bestAsk: 25.1,
      lastTradePrice: 25,
      hourChange: 0,
      dayChange: 0,
      volume24h: 0,
      volume: 0,
      liquidity: 0,
      yesTokenId: "seed-keiko-fujimori"
    },
    {
      name: "Rafael López Aliaga",
      slug: "will-rafael-lopez-aliaga-win-the-2026-peruvian-presidential-election",
      probability: 15.5,
      bestBid: 15,
      bestAsk: 16,
      lastTradePrice: 15,
      hourChange: 0,
      dayChange: 0,
      volume24h: 0,
      volume: 0,
      liquidity: 0,
      yesTokenId: "91464516107556165907566387619157396733019262339196802152206657889196699256450"
    }
  ]
};

function resolveBlobToken(token) {
  return token ?? process.env.BLOB_READ_WRITE_TOKEN ?? "";
}
async function readStreamAsText(stream) {
  return await new Response(stream).text();
}
function parseStoredSnapshot(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("El snapshot persistido no es un objeto válido.");
  }
  return assertValidSnapshot(raw);
}
async function readPersistedSnapshot({
  token,
  blobGet = get
} = {}) {
  const resolvedToken = resolveBlobToken(token);
  if (!resolvedToken) return null;
  const result = await blobGet(POLYMARKET_BLOB_PATHNAME, {
    access: "private",
    token: resolvedToken,
    useCache: false
  });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  const text = await readStreamAsText(result.stream);
  return parseStoredSnapshot(JSON.parse(text));
}
async function persistSnapshot(snapshot, {
  token,
  blobPut = put
} = {}) {
  const resolvedToken = resolveBlobToken(token);
  if (!resolvedToken) return false;
  const payload = JSON.stringify(assertValidSnapshot(snapshot));
  await blobPut(POLYMARKET_BLOB_PATHNAME, payload, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
    token: resolvedToken
  });
  return true;
}
async function readSeedSnapshot({
  seedPath,
  seedPayload = peruElectionWinnerSeed
} = {}) {
  if (seedPath) {
    const text = await readFile(seedPath, "utf8");
    return parseStoredSnapshot(JSON.parse(text));
  }
  return parseStoredSnapshot(seedPayload);
}

class PolymarketUnavailableError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "PolymarketUnavailableError";
  }
}
function serializeError(error) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }
  return { message: String(error) };
}
function buildResponse(snapshot, servedFrom, staleReason, fetchedAt) {
  return {
    ...snapshot,
    servedFrom,
    stale: servedFrom !== "live",
    staleReason,
    fetchedAt
  };
}
async function fetchPeruElectionMarket({
  fetchLiveSnapshot = fetchLivePeruElectionMarketSnapshot,
  readPersistedSnapshot: readPersisted = readPersistedSnapshot,
  persistSnapshot: persist = persistSnapshot,
  readSeedSnapshot: readSeed = readSeedSnapshot,
  logger = console,
  now = () => /* @__PURE__ */ new Date()
} = {}) {
  const fetchedAt = now().toISOString();
  try {
    const liveSnapshot = await fetchLiveSnapshot({ logger });
    try {
      await persist(liveSnapshot);
    } catch (error) {
      logger.warn?.("[polymarket] No se pudo persistir el último snapshot válido", {
        error: serializeError(error)
      });
    }
    return buildResponse(liveSnapshot, "live", "none", fetchedAt);
  } catch (liveError) {
    logger.error?.("[polymarket] Falló el upstream live; intentando snapshot persistido", {
      error: serializeError(liveError)
    });
    try {
      const cachedSnapshot = await readPersisted();
      if (cachedSnapshot) {
        logger.warn?.("[polymarket] Sirviendo snapshot persistido", {
          source: "cache",
          staleReason: "cache_used"
        });
        return buildResponse(cachedSnapshot, "cache", "cache_used", fetchedAt);
      }
    } catch (cacheError) {
      logger.error?.("[polymarket] No se pudo leer el snapshot persistido", {
        error: serializeError(cacheError)
      });
    }
    try {
      const seedSnapshot = await readSeed();
      logger.warn?.("[polymarket] Sirviendo seed local de emergencia", {
        source: "seed",
        staleReason: "seed_used"
      });
      return buildResponse(seedSnapshot, "seed", "seed_used", fetchedAt);
    } catch (seedError) {
      logger.error?.("[polymarket] No se pudo leer el seed local de emergencia", {
        error: serializeError(seedError)
      });
      throw new PolymarketUnavailableError("No pudimos cargar Polymarket ni un respaldo disponible.", {
        cause: seedError instanceof Error ? seedError : void 0
      });
    }
  }
}

const prerender = false;
const GET = async () => {
  try {
    const payload = await fetchPeruElectionMarket();
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": payload.servedFrom === "live" ? "public, max-age=30, s-maxage=30" : "no-store",
        "x-polymarket-source": payload.servedFrom,
        "x-polymarket-stale": payload.stale ? "1" : "0"
      }
    });
  } catch (error) {
    console.error("[polymarket] No se pudo cargar el mercado de Perú", error);
    return new Response(
      JSON.stringify({
        message: error instanceof Error ? error.message : "No pudimos cargar Polymarket ni un respaldo disponible."
      }),
      {
        status: 503,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
          "x-polymarket-source": "unavailable",
          "x-polymarket-stale": "1"
        }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
