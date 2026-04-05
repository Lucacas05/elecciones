export const POLYMARKET_EVENT_SLUG = 'peru-presidential-election-winner';
export const POLYMARKET_EVENT_URL = `https://gamma-api.polymarket.com/events/slug/${POLYMARKET_EVENT_SLUG}`;
export const POLYMARKET_PAGE_URL = `https://polymarket.com/es/event/${POLYMARKET_EVENT_SLUG}`;
export const POLYMARKET_BLOB_PATHNAME = `polymarket/${POLYMARKET_EVENT_SLUG}/latest.json`;
export const POLYMARKET_USER_AGENT = 'DecidePeru/1.0 (+https://decideperu.app)';

export interface GammaMarket {
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

export interface GammaEvent {
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

export type PolymarketSnapshotSource = 'live' | 'cache' | 'seed';
export type PolymarketStaleReason = 'none' | 'upstream_failed' | 'cache_used' | 'seed_used';

export interface PolymarketEventSnapshotResponse extends PolymarketEventSnapshot {
  servedFrom: PolymarketSnapshotSource;
  stale: boolean;
  staleReason: PolymarketStaleReason;
  fetchedAt: string;
}

export interface LoggerLike {
  error?: (...args: unknown[]) => void;
  warn?: (...args: unknown[]) => void;
}
