import { describe, expect, it, vi } from 'vitest';
import { PolymarketUnavailableError, fetchPeruElectionMarket } from './index';
import type { PolymarketEventSnapshot } from './types';

const snapshot: PolymarketEventSnapshot = {
  title: 'Peru Presidential Election Winner',
  slug: 'peru-presidential-election-winner',
  active: true,
  closed: false,
  endDate: '2026-04-12T00:00:00Z',
  updatedAt: '2026-04-05T14:15:48.458545Z',
  sourceUrl: 'https://polymarket.com/es/event/peru-presidential-election-winner',
  volume24h: 10,
  volume: 20,
  liquidity: 30,
  openInterest: 40,
  candidates: [
    { name: 'Carlos Álvarez', slug: 'carlos', probability: 30.05, bestBid: 30, bestAsk: 30.1, lastTradePrice: 31.4, hourChange: 0, dayChange: 0, volume24h: 10, volume: 10, liquidity: 10, yesTokenId: 'carlos' },
    { name: 'Keiko Fujimori', slug: 'keiko', probability: 25, bestBid: 24.9, bestAsk: 25.1, lastTradePrice: 25, hourChange: 0, dayChange: 0, volume24h: 10, volume: 10, liquidity: 10, yesTokenId: 'keiko' },
    { name: 'Rafael López Aliaga', slug: 'rla', probability: 15.5, bestBid: 15, bestAsk: 16, lastTradePrice: 15, hourChange: 0, dayChange: 0, volume24h: 10, volume: 10, liquidity: 10, yesTokenId: 'rla' },
  ],
};

const logger = {
  error: vi.fn(),
  warn: vi.fn(),
};

describe('fetchPeruElectionMarket', () => {
  it('sirve live y persiste snapshot cuando el upstream responde', async () => {
    const persist = vi.fn().mockResolvedValue(true);

    const result = await fetchPeruElectionMarket({
      fetchLiveSnapshot: vi.fn().mockResolvedValue(snapshot) as never,
      persistSnapshot: persist as never,
      logger,
      now: () => new Date('2026-04-05T14:20:00.000Z'),
    });

    expect(result.servedFrom).toBe('live');
    expect(result.stale).toBe(false);
    expect(persist).toHaveBeenCalledWith(snapshot);
  });

  it('sirve cache si falla live y existe snapshot persistido', async () => {
    const result = await fetchPeruElectionMarket({
      fetchLiveSnapshot: vi.fn().mockRejectedValue(new Error('upstream failed')) as never,
      readPersistedSnapshot: vi.fn().mockResolvedValue(snapshot) as never,
      readSeedSnapshot: vi.fn().mockResolvedValue(null) as never,
      logger,
      now: () => new Date('2026-04-05T14:20:00.000Z'),
    });

    expect(result.servedFrom).toBe('cache');
    expect(result.stale).toBe(true);
    expect(result.staleReason).toBe('cache_used');
  });

  it('sirve seed si falla live y no hay cache', async () => {
    const result = await fetchPeruElectionMarket({
      fetchLiveSnapshot: vi.fn().mockRejectedValue(new Error('upstream failed')) as never,
      readPersistedSnapshot: vi.fn().mockResolvedValue(null) as never,
      readSeedSnapshot: vi.fn().mockResolvedValue(snapshot) as never,
      logger,
      now: () => new Date('2026-04-05T14:20:00.000Z'),
    });

    expect(result.servedFrom).toBe('seed');
    expect(result.stale).toBe(true);
    expect(result.staleReason).toBe('seed_used');
  });

  it('lanza error fatal si falla live, cache y seed', async () => {
    await expect(
      fetchPeruElectionMarket({
        fetchLiveSnapshot: vi.fn().mockRejectedValue(new Error('upstream failed')) as never,
        readPersistedSnapshot: vi.fn().mockResolvedValue(null) as never,
        readSeedSnapshot: vi.fn().mockRejectedValue(new Error('seed failed')) as never,
        logger,
      }),
    ).rejects.toBeInstanceOf(PolymarketUnavailableError);
  });
});
