const POLYMARKET_EVENT_SLUG = 'peru-presidential-election-winner';
const POLYMARKET_EVENT_URL = `https://gamma-api.polymarket.com/events/slug/${POLYMARKET_EVENT_SLUG}`;
const POLYMARKET_PAGE_URL = `https://polymarket.com/es/event/${POLYMARKET_EVENT_SLUG}`;

interface GammaMarket {
  question?: string;
  slug?: string;
  active?: boolean;
  closed?: boolean;
  outcomes?: string[] | string | null;
  outcomePrices?: string[] | string | null;
  clobTokenIds?: string[] | string | null;
  oneHourPriceChange?: number | string | null;
  oneDayPriceChange?: number | string | null;
  volume24hr?: number | string | null;
  volume?: number | string | null;
  liquidity?: number | string | null;
  bestBid?: number | string | null;
  bestAsk?: number | string | null;
  lastTradePrice?: number | string | null;
}

interface GammaEvent {
  title?: string;
  slug?: string;
  active?: boolean;
  closed?: boolean;
  endDate?: string;
  updatedAt?: string;
  volume24hr?: number | string | null;
  volume?: number | string | null;
  liquidity?: number | string | null;
  openInterest?: number | string | null;
  markets?: GammaMarket[];
}

function parseStringArray(value: string[] | string | null | undefined) {
  if (Array.isArray(value)) return value.map((item) => String(item));
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map((item) => String(item)) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function toNumber(value: number | string | null | undefined) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function extractCandidateName(question: string) {
  return question
    .replace(/^Will\s+/i, '')
    .replace(/\s+win the 2026 Peruvian presidential election\?$/i, '')
    .trim();
}

function isPlaceholderCandidate(name: string) {
  return /^candidate\s+[a-z]$/i.test(name) || /^another candidate$/i.test(name);
}

export interface PolymarketCandidate {
  name: string;
  slug: string;
  probability: number;
  bestBid: number;
  bestAsk: number;
  lastTradePrice: number;
  hourChange: number;
  dayChange: number;
  volume24h: number;
  volume: number;
  liquidity: number;
  yesTokenId: string;
}

export interface PolymarketEventSnapshot {
  title: string;
  slug: string;
  active: boolean;
  closed: boolean;
  endDate: string | null;
  updatedAt: string;
  sourceUrl: string;
  volume24h: number;
  volume: number;
  liquidity: number;
  openInterest: number;
  candidates: PolymarketCandidate[];
}

export async function fetchPeruElectionMarket(): Promise<PolymarketEventSnapshot> {
  const response = await fetch(POLYMARKET_EVENT_URL, {
    headers: {
      'user-agent': 'DecidePeru/1.0 (+https://decideperu.local)',
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Polymarket respondió ${response.status}`);
  }

  const raw = (await response.json()) as GammaEvent;
  const candidates = (raw.markets ?? [])
    .map((market) => {
      const question = market.question?.trim() ?? '';
      const name = extractCandidateName(question);
      const outcomes = parseStringArray(market.outcomes);
      const prices = parseStringArray(market.outcomePrices).map((value) => toNumber(value));
      const tokenIds = parseStringArray(market.clobTokenIds);
      const yesIndex = outcomes.findIndex((outcome) => outcome.toLowerCase() === 'yes');
      const yesTokenId = yesIndex >= 0 ? tokenIds[yesIndex] : '';
      const probability = yesIndex >= 0 ? (prices[yesIndex] ?? 0) * 100 : 0;

      if (!market.active || !question || !yesTokenId || !prices.length || isPlaceholderCandidate(name)) {
        return null;
      }

      return {
        name,
        slug: market.slug ?? '',
        probability,
        bestBid: toNumber(market.bestBid) * 100,
        bestAsk: toNumber(market.bestAsk) * 100,
        lastTradePrice: toNumber(market.lastTradePrice) * 100,
        hourChange: toNumber(market.oneHourPriceChange) * 100,
        dayChange: toNumber(market.oneDayPriceChange) * 100,
        volume24h: toNumber(market.volume24hr),
        volume: toNumber(market.volume),
        liquidity: toNumber(market.liquidity),
        yesTokenId,
      } satisfies PolymarketCandidate;
    })
    .filter((candidate): candidate is PolymarketCandidate => Boolean(candidate))
    .sort((a, b) => b.probability - a.probability || b.volume24h - a.volume24h || a.name.localeCompare(b.name, 'es'));

  return {
    title: raw.title ?? 'Peru Presidential Election Winner',
    slug: raw.slug ?? POLYMARKET_EVENT_SLUG,
    active: Boolean(raw.active),
    closed: Boolean(raw.closed),
    endDate: raw.endDate ?? null,
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
    sourceUrl: POLYMARKET_PAGE_URL,
    volume24h: toNumber(raw.volume24hr),
    volume: toNumber(raw.volume),
    liquidity: toNumber(raw.liquidity),
    openInterest: toNumber(raw.openInterest),
    candidates,
  };
}
