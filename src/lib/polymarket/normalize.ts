import {
  POLYMARKET_EVENT_SLUG,
  POLYMARKET_PAGE_URL,
  type GammaEvent,
  type PolymarketCandidate,
  type PolymarketEventSnapshot,
} from './types';

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

function isValidCandidate(candidate: Partial<PolymarketCandidate> | null | undefined): candidate is PolymarketCandidate {
  return Boolean(
    candidate &&
      candidate.name &&
      typeof candidate.name === 'string' &&
      candidate.yesTokenId &&
      typeof candidate.yesTokenId === 'string' &&
      typeof candidate.probability === 'number' &&
      Number.isFinite(candidate.probability),
  );
}

export function sortPolymarketCandidates(candidates: PolymarketCandidate[]) {
  return [...candidates].sort(
    (a, b) =>
      b.probability - a.probability ||
      b.volume24h - a.volume24h ||
      a.name.localeCompare(b.name, 'es'),
  );
}

export function assertValidSnapshot(snapshot: PolymarketEventSnapshot) {
  if (!snapshot || typeof snapshot !== 'object') {
    throw new Error('Snapshot inválido: se esperaba un objeto.');
  }

  const candidates = Array.isArray(snapshot.candidates) ? snapshot.candidates.filter(isValidCandidate) : [];
  if (candidates.length < 3) {
    throw new Error(`Snapshot inválido: se esperaban al menos 3 candidatos válidos y llegaron ${candidates.length}.`);
  }

  return {
    ...snapshot,
    candidates: sortPolymarketCandidates(candidates),
  } satisfies PolymarketEventSnapshot;
}

export function normalizeGammaEvent(raw: GammaEvent): PolymarketEventSnapshot {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Polymarket devolvió un payload vacío o inválido.');
  }

  if (!Array.isArray(raw.markets)) {
    throw new Error('Polymarket no devolvió mercados en el payload.');
  }

  const candidates = raw.markets
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
    .filter((candidate): candidate is PolymarketCandidate => Boolean(candidate));

  return assertValidSnapshot({
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
  });
}
