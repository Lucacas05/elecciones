export { renderers } from '../../../renderers.mjs';

const POLYMARKET_EVENT_SLUG = "peru-presidential-election-winner";
const POLYMARKET_EVENT_URL = `https://gamma-api.polymarket.com/events/slug/${POLYMARKET_EVENT_SLUG}`;
const POLYMARKET_PAGE_URL = `https://polymarket.com/es/event/${POLYMARKET_EVENT_SLUG}`;
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
async function fetchPeruElectionMarket() {
  const response = await fetch(POLYMARKET_EVENT_URL, {
    headers: {
      "user-agent": "DecidePeru/1.0 (+https://decideperu.local)",
      accept: "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(`Polymarket respondió ${response.status}`);
  }
  const raw = await response.json();
  const candidates = (raw.markets ?? []).map((market) => {
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
  }).filter((candidate) => Boolean(candidate)).sort((a, b) => b.probability - a.probability || b.volume24h - a.volume24h || a.name.localeCompare(b.name, "es"));
  return {
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
  };
}

const prerender = false;
const GET = async () => {
  try {
    const payload = await fetchPeruElectionMarket();
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=30, s-maxage=30"
      }
    });
  } catch (error) {
    console.error("[polymarket] No se pudo cargar el mercado de Perú", error);
    return new Response(
      JSON.stringify({
        message: "No se pudo cargar Polymarket en este momento."
      }),
      {
        status: 502,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store"
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
